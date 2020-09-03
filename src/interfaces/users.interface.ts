export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  last_login?: Date;
}
