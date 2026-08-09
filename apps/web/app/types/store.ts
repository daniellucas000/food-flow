export interface ItemOption {
  id: string;
  name: string;
  priceModifier: string;
}

export interface ItemOptionGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  required: boolean;
  options: ItemOption[];
}

export interface PublicMenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  optionGroups: ItemOptionGroup[];
}

export interface PublicCategory {
  id: string;
  name: string;
  position: number;
  isActive: boolean;
  menuItems: PublicMenuItem[];
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
