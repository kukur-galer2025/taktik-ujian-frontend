import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://TaktikUjian.com'; // Ganti dengan domain asli Anda

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Cegah bot mengindeks halaman internal/dashboard yang wajib login
      disallow: ['/dashboard/', '/tryout/', '/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
