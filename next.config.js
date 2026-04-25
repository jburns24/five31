/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle OpenTelemetry packages for the browser
      config.externals = config.externals || [];
      config.externals.push(({ context, request }, callback) => {
        if (request.startsWith('@opentelemetry/')) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      });
    } else {
      // Provide fallbacks for Node.js built-in modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        dns: false,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
