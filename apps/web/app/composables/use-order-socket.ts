import { io } from 'socket.io-client';
import type { Order } from '~/types/order';

export function useOrderSocket(
  storeId: string,
  onNewOrder: (order: Order) => void
) {
  if (!import.meta.client) return;

  const socket = io(useRuntimeConfig().public.apiBase);
  const audio = new Audio('/sounds/ding.mp3');
  let isUnlocked = false;

  function unlockAudio() {
    if (isUnlocked) return;
    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        isUnlocked = true;
        document.removeEventListener('click', unlockAudio);
      })
      .catch(() => {});
  }

  document.addEventListener('click', unlockAudio);

  socket.on('connect', () => {
    socket.emit('join-store', storeId);
  });

  socket.on('new-order', (order: Order) => {
    onNewOrder(order);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });

  onUnmounted(() => {
    socket.disconnect();
    document.removeEventListener('click', unlockAudio);
  });
}
