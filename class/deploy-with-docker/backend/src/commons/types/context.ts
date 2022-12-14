export interface IUser {
  user?: {
    id: string;
    email: string;
  };
}

export interface IContext {
  req: Request & IUser;
  res: Response;
}
