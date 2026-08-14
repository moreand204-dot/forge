/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverComponentsExternalPackages: ['better-sqlite3', 'archiver'] }
};
export default nextConfig;
