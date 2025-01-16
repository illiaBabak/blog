export type Blog = {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  user_id: string | null;
};

export type PublicUser = {
  user_id: string;
  email: string | null;
  username: string | null;
  image_url: string | null;
};
