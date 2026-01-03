export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completed?: boolean;
}

export interface Tag {
  name: string;
  count: number;
}

