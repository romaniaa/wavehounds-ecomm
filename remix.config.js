/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: 'app',
  assetsBuildDirectory: 'dist/client/build',
  ignoredRouteFiles: ['**/.*'],
  postcss: true,
  
  // 1. Tell the server compiler where to find the physical files
  serverNodeBuiltinsPolyfill: {
    modules: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
    },
  },

  // 2. Tell the browser compiler where to find the physical files
  browserNodeBuiltinsPolyfill: {
    modules: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
    },
  },

  /**
   * The following settings are required to deploy Hydrogen apps to Oxygen:
   */
  publicPath: (process.env.HYDROGEN_ASSET_BASE_URL ?? '/') + 'build/',
  server: './server.ts',
  serverBuildPath: 'dist/worker/index.js',
  serverConditions: ['worker', process.env.NODE_ENV],
  serverDependenciesToBundle: 'all',
  serverMainFields: ['browser', 'module', 'main'],
  serverMinify: process.env.NODE_ENV === 'production',
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  tailwind: true,
  watchPaths: [
    './public',
    './.env',
    './server.ts',
    './tailwind.config.ts',
    './sanity.details.ts',
  ],
};