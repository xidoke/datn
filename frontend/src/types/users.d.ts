export interface IUser {
  id: string;
  avatar: string | null;
  //   date_joined: string;
  display_name: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string | null;
  last_workspace_id: string;
  username: string;
}
