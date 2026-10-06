import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { spawn } from 'child_process'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function djangoBackendPlugin() {
  let djangoProcess = null

  return {
    name: 'django-backend-autostart',
    configureServer(server) {
      // Check if Django backend is already responding on port 8000
      const checkReq = http.get('http://127.0.0.1:8000/api/v1/destinations/', () => {
        console.log('\x1b[32m%s\x1b[0m', '✓ Django backend is active on http://127.0.0.1:8000');
      })

      checkReq.on('error', () => {
        console.log('\x1b[33m%s\x1b[0m', '⚡ Django backend not running on port 8000. Auto-starting Django server...');
        const backendDir = path.resolve(__dirname, '../backend')
        const pythonExe = path.resolve(backendDir, 'venv/Scripts/python.exe')

        djangoProcess = spawn(pythonExe, ['manage.py', 'runserver', '127.0.0.1:8000'], {
          cwd: backendDir,
          stdio: 'inherit',
          shell: true,
        })

        djangoProcess.on('error', (err) => {
          console.error('\x1b[31m%s\x1b[0m', 'Failed to auto-start Django backend:', err.message)
        })

        const cleanup = () => {
          if (djangoProcess) {
            console.log('\x1b[33m%s\x1b[0m', 'Stopping Django backend...');
            try { djangoProcess.kill() } catch {}
            djangoProcess = null
          }
        }

        process.on('exit', cleanup)
        process.on('SIGINT', cleanup)
        process.on('SIGTERM', cleanup)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), djangoBackendPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/media': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
