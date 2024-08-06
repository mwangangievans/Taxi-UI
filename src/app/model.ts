export interface UserSession {
  userId: number;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
  hasVerifiedPhoneNumber: boolean | null;
}
