import { randomInt } from "node:crypto";
import { createConnection } from "node:net";

type RconPacket = { body: string; id: number; type: number };

function encodePacket(id: number, type: number, body: string): Buffer {
  const value = Buffer.from(body, "utf8");
  const packet = Buffer.alloc(value.length + 14);
  packet.writeInt32LE(value.length + 10, 0);
  packet.writeInt32LE(id, 4);
  packet.writeInt32LE(type, 8);
  value.copy(packet, 12);
  return packet;
}

function extractPacket(
  buffer: Buffer,
): { packet: RconPacket; rest: Buffer } | null {
  if (buffer.length < 4) return null;
  const length = buffer.readInt32LE(0);
  if (length < 10 || length > 4 * 1024 * 1024) {
    throw new Error("Minecraft RCON returned an invalid packet");
  }
  if (buffer.length < length + 4) return null;
  return {
    packet: {
      body: buffer.subarray(12, length + 2).toString("utf8"),
      id: buffer.readInt32LE(4),
      type: buffer.readInt32LE(8),
    },
    rest: buffer.subarray(length + 4),
  };
}

export async function sendRconCommand(options: {
  command: string;
  host: string;
  password: string;
  port: number;
}): Promise<string> {
  return new Promise((resolve, reject) => {
    const requestId = randomInt(1, 0x7fffffff);
    const socket = createConnection({ host: options.host, port: options.port });
    let buffer = Buffer.alloc(0);
    let authenticated = false;

    const fail = (error: Error) => {
      socket.destroy();
      reject(error);
    };
    socket.setTimeout(4_000, () => fail(new Error("Minecraft RCON timed out")));
    socket.once("error", fail);
    socket.once("connect", () => {
      socket.write(encodePacket(requestId, 3, options.password));
    });
    socket.on("data", (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);
      try {
        let decoded = extractPacket(buffer);
        while (decoded) {
          buffer = decoded.rest;
          const { packet } = decoded;
          if (!authenticated) {
            if (packet.id === -1)
              return fail(new Error("Minecraft RCON rejected authentication"));
            if (packet.id === requestId && packet.type === 2) {
              authenticated = true;
              socket.write(encodePacket(requestId, 2, options.command));
            }
          } else if (packet.id === requestId) {
            socket.end();
            resolve(packet.body);
            return;
          }
          decoded = extractPacket(buffer);
        }
      } catch (error) {
        fail(
          error instanceof Error ? error : new Error("Minecraft RCON failed"),
        );
      }
    });
  });
}
