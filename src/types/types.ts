export type Blog = {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  user_id: string | null;
};

export type PublicUser = {
  email: string | null;
  id: number;
  user_id: string;
  username: string | null;
};
