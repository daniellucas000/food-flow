export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  storeId: string;
  createdAt: string;
}

export interface CustomerAuthResponse {
  access_token: string;
  customer: CustomerUser;
}
