/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "covers.openlibrary.org" },
    ],
  },
  async redirects() {
    // The rooms of work used to live under /works. They are chapels in a
    // building now, and the building is the point — but the old paths were
    // published, so they are kept as permanent redirects rather than dropped.
    return [
      { source: "/works", destination: "/cathedral", permanent: true },
      { source: "/works/:slug", destination: "/cathedral/:slug", permanent: true },
    ];
  },
};

module.exports = nextConfig;
