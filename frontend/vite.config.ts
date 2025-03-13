import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '/',
    plugins: [react({
        jsxImportSource: '@emotion/react',
        babel: {
            plugins: ['@emotion/babel-plugin'],
        },
    }), viteTsconfigPaths()],
    server: {
        // this ensures that the browser opens upon server start
        open: false,
        // this sets a default port to 3000
        port: 3000,
    },
    publicDir: 'public', // Explicitly set the public directory
    build: {
        outDir: 'dist', // Output directory for production builds
        assetsDir: 'assets', // Directory for bundled assets
        emptyOutDir: true, // Clean the output directory before build
    }
})