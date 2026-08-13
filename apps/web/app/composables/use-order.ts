import type {
  CreateOrderPayload,
  Order,
  OrderStatusValue,
} from '~/types/order';

export function useOrders() {
  const customerApi = useApi('customer_token');
  const staffApi = useApi();

  async function createOrder(payload: CreateOrderPayload) {
    return customerApi<Order>('/orders', { method: 'POST', body: payload });
  }

  async function fetchMyOrders() {
    return customerApi<Order[]>('/orders/mine');
  }

  async function fetchOrderById(id: string) {
    return customerApi<Order>(`/orders/${id}`);
  }

  async function fetchStoreOrders() {
    return staffApi<Order[]>('/orders');
  }

  async function updateOrderStatus(id: string, status: OrderStatusValue) {
    return staffApi<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  }

  return {
    createOrder,
    fetchMyOrders,
    fetchOrderById,
    fetchStoreOrders,
    updateOrderStatus,
  };
}
