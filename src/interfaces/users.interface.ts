export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  created_date: Date;
  last_login?: Date;
}
