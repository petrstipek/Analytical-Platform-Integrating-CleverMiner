type Role = 'admin' | 'editor' | 'viewer';

export type Member = {
  name: string;
  role: Role;
};
