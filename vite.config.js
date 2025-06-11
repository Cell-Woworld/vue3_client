// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ 
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  /*
    Default: /
    Base public path (应用基础请求路径) when served in development or production. Valid values include:
    
    Absolute URL pathname, e.g. /foo/
    Full URL, e.g. https://foo.com/
    Empty string or ./ (for embedded deployment)
  */
  // base: '/admin/',

  /*
    Directory to serve as plain static assets. 
    Files in this directory are served at / during dev and copied to the root of outDir during build, and are always served or copied as-is without transform. 
    The value can be either an absolute file system path or a path relative to project root.
    静态资源目录，开发模式下会自动放到 / 下，生产模式下会自动放到 outDir 根路径下。
    该目录可以配置为文件系统绝对目录或者相对于项目根目录的相对路径
  */
  publicDir:'public',

  /*
    Default: 'development' for serve, 'production' for build
    Specifying this in config will override the default mode for both serve and build. This value can also be overridden via the command line --mode option.
  */
  //mode:'',
    //vite开发服务器配置
  server: {
    host: 'localhost',
    port: 8080,
    open: true,
    strictPort: false,
    https: false,
      // 反向代理
    // proxy: {
    //   '/admin': {
    //     target: 'http://api.vite-admin.com',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/admin/, '')
    //   },
    // }    
      //proxy: {
    //   // string shorthand
    //   '/foo': 'http://localhost:4567/foo',
    //   // with options
    //   '/api': {
    //     target: 'http://jsonplaceholder.typicode.com',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   },
    //   // with RegEx
    //   '^/fallback/.*': {
    //     target: 'http://jsonplaceholder.typicode.com',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/fallback/, '')
    //   }
    // }
  },
  
  //生产模式打包配置
  build:{
    outDir: 'cordova_app/www',//Specify the output directory (relative to project root).
  },

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin', 'import'],
      }
    }
  },
})
