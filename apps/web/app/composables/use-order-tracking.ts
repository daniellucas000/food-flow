import { io } from 'socket.io-client';

export function useOrderTracking(
  orderId: string,
  onStatusUpdate: (status: string) => void
) {
  if (!import.meta.client) return;

  const socket = io(useRuntimeConfig().public.apiBase, {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    socket.emit('join-order', orderId);
  });

  socket.on(
    'order-status-update',
    (data: { orderId: string; status: string }) => {
      if (data.orderId === orderId) {
        onStatusUpdate(data.status);
      }
    }
  );

  onUnmounted(() => socket.disconnect());
}
