export type ProjectType = {
  id: number;
  name: string;
  created_at: Date;
  updatedAt: Date;
  owner: number;
  members: number[];
};
