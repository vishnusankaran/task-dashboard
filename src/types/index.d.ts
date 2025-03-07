export type TaskArray = Task[] | [];

export type User = {
  id: string;
  name: string;
  avatar?: string;
  email: string;
};

export type StatusType = "pending" | "in-progress" | "completed";

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: StatusType;
  user: User;
};
