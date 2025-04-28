import { CurseforgeV1Client } from '@xmcl/curseforge'

// TODO: use t3-env
export const cClient = new CurseforgeV1Client(process.env.CURSEFORGE_API_KEY);