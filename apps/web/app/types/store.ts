import type { MenuItem } from './menu';

export interface PublicCategory {
  id: string;
  name: string;
  position: number;
  isActive: boolean;
  menuItems: MenuItem[];
}

export interface PublicStoreMenu {
  store: {
    id: string;
    name: string;
    slug: string;
    isOpen: boolean;
    deliveryFee: string;
  };
  categories: PublicCategory[];
}
