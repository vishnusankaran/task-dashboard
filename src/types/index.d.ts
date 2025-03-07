export type TaskArray = Task[] | [];

export type User = {
  id: string;
  name: string;
  avatar?: string;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
  user: User;
};
