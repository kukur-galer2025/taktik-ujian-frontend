export const getImageUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  if (path.startsWith('/')) {
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/${path}`;
};
