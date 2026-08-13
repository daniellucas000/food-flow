export interface CreateOrderPayload {
  deliveryType: 'DELIVERY' | 'PICKUP';
  paymentMethod: 'ONLINE' | 'CASH_ON_DELIVERY';
  deliveryFee: number;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: {
    menuItemId: string;
    quantity: number;
    unitPrice: number;
    selectedOptions: { itemOptionId: string; priceModifier: number }[];
  }[];
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  unitPrice: string;
}

export interface OrderAddress {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export type OrderStatusValue =
  | 'RECEIVED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  storeId: string;
  customerId: string;
  status: OrderStatusValue;
  subtotal: string;
  deliveryFee: string;
  total: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  address?: OrderAddress;
  customer?: { name: string; phone: string };
}
