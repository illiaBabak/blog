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

export type BlogAction =
  | {
      type: 'delete';
      blogsToDelete: number[];
      setBlogsToDelete: React.Dispatch<React.SetStateAction<number[]>>;
    }
  | {
      type: 'edit';
      blogToEdit: Blog | null;
      setBlogToEdit: React.Dispatch<React.SetStateAction<Blog | null>>;
    }
  | {
      type: 'comments';
    };

export type CommentType = {
  blog_id: number;
  created_at: string;
  id: number;
  text: string;
  user_id: string;
};
