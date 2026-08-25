import { defineStore } from 'pinia';
import type { StaffUser } from '~/types/auth';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<StaffUser | null>(null);

    function setUser(newUser: StaffUser) {
      user.value = newUser;
    }

    function clearUser() {
      user.value = null;
    }

    return { user, setUser, clearUser };
  },
  { persist: true }
);
