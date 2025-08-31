const nextConfig = {
    eslint: {
      // Allow build but still get warnings
      ignoreDuringBuilds: false,
    },
    typescript: {
      // Fail build if TS errors exist
      ignoreBuildErrors: false,
    },
    images: {
      // Use optimization unless deploying to unsupported platform
      unoptimized: false,
    },
  }
  