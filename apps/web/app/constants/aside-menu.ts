import { LayoutDashboard, Utensils } from '@lucide/vue';

export const asideMenu = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/admin',
  },
  {
    label: 'Cardápio',
    icon: Utensils,
    to: '/admin/menu',
  },
];
