import { createServer, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const config = defineConfig({
  plugins: [react()],
})

const server = await createServer({
  configFile: false,
  root: __dirname,
  server: {},
  ...config,
})

await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
