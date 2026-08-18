import { LayoutDashboard, ReceiptText, Utensils } from '@lucide/vue';

export const asideMenu = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/admin',
  },
  {
    label: 'Pedidos',
    icon: ReceiptText,
    to: '/admin/orders',
  },
  {
    label: 'Cardápio',
    icon: Utensils,
    to: '/admin/menu',
  },
];
