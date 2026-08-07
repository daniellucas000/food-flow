export interface Category {
  id: string;
  name: string;
  position: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId: string;
}
