// Exemple de user (à remplacer par ton state ou ton fetch)
export type User = {
  id: number;
  customerId: string | null;
  firstname: string;
  lastname: string;
  email: string;
  enabled: boolean;
  emailVerified: boolean;
  phone: number;
  urlProfile: string;
  roles: string;
  defaultCard: boolean;
  isLoggedIn: boolean;
  token: string | null;
  customerPortalUrl: string | null;
};
