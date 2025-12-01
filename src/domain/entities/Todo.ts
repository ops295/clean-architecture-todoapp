export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: number;
}
