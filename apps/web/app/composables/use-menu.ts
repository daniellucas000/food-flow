import type { Category, MenuItem } from '~/types/menu';

export function useMenu() {
  const api = useApi();

  async function fetchCategories() {
    return api<Category[]>('/categories');
  }

  async function createCategory(name: string) {
    return api<Category>('/categories', {
      method: 'POST',
      body: { name },
    });
  }

  async function deleteCategory(id: string) {
    return api(`/categories/${id}`, { method: 'DELETE' });
  }

  async function fetchMenuItems() {
    return api<MenuItem[]>('/menu-items');
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const result = await api<{ url: string }>('/upload/image', {
      method: 'POST',
      body: formData,
    });

    return result.url;
  }

  async function createMenuItem(data: {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
  }) {
    return api<MenuItem>('/menu-items', {
      method: 'POST',
      body: data,
    });
  }

  async function deleteMenuItem(id: string) {
    return api(`/menu-items/${id}`, { method: 'DELETE' });
  }

  return {
    fetchCategories,
    createCategory,
    deleteCategory,
    fetchMenuItems,
    createMenuItem,
    deleteMenuItem,
    uploadImage,
  };
}
