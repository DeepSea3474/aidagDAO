/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false, // Rust tabanlı derleyiciyi kapatır (Segmentation fault'un ana sebebi)
  
  experimental: {
    workerThreads: false, // Build işlemini tek bir iş parçacığına indirir (RAM tasarrufu)
    cpus: 1,              // İşlemci kullanımını kısıtlar
    forceSwcTransforms: false
  },

  // Resim optimizasyonunu kapatır (Sharp kütüphanesi Termux'ta genelde çöker)
  images: {
    unoptimized: true
  },

  webpack: (config) => {
    // Önbelleği kapatır, böylece hatalı build artıkları temizlenir
    config.cache = false;
    return config;
  }
}

module.exports = nextConfig;
