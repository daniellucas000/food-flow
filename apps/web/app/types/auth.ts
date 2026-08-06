export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'STAFF';
  storeId: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: StaffUser;
}
