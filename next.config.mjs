/** @type {import('next').NextConfig} */
const nextConfig = {
  // output standalone menghasilkan bundle mandiri yang ideal untuk Docker:
  // semua file yang dibutuhkan dikumpulkan di .next/standalone
  // sehingga image produksi tidak perlu menyertakan seluruh node_modules
  output: 'standalone',
};

export default nextConfig;
