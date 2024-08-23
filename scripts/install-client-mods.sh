# Check pnpm is installed

if ! command -v pnpm &> /dev/null
then
    echo "pnpm could not be found"
    echo "Please install pnpm by running 'npm i -g pnpm'"
    exit
fi

# Install client mods

pnpm i
pnpm dcm
