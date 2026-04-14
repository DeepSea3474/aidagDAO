/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  i18n: {
    locales: ["en", "tr", "es", "fr", "de", "pt", "ru", "ar", "ja", "zh"],
    defaultLocale: "en",
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;

