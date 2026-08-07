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

  async function createMenuItem(data: {
    categoryId: string;
    name: string;
    description?: string;
    price: number;
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
  };
}
