/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ma Bibliothèque was renamed rePlay (2026-11-12); keep the old link working.
  async redirects() {
    return [{ source: "/projects/ma-bibliotheque", destination: "/projects/replay", permanent: true }];
  },
};

export default nextConfig;
