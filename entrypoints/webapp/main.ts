import { build, createServer, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  root: __dirname,
  plugins: [
    react(),
    tailwindcss(),
  ],
})

const args = process.argv.slice(2)

if (args.includes('build')) {
  await build(config)
  process.exit(0)
}

const server = await createServer({
  configFile: false,
  ...config,
})

await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
