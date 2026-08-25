export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'STAFF';
  storeId: string;
}

export interface StoreSummary {
  id: string;
  name: string;
  logoUrl: string | null;
  bannerUrl: string | null;
}

export interface AuthResponse {
  access_token: string;
  user: StaffUser;
  store: StoreSummary;
}
