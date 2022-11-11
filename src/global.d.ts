import { DeleteResult } from "typeorm";

interface IReader<T> {
  getCount(): Promise<number>;
  findAll(
    limit: number,
    skip: number,
    rest?: Record<string, any>
  ): Promise<TResultService<T>>;
  findById(id: number): Promise<T>;
}

interface IWriter<T> {
  create(data: Partial<T>): Promise<T>;
  createMany?(data: Partial<T>[]): Promise<T[]>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void | DeleteResult>;
}

type BaseRepository<T> = IReader<T> & IWriter<T>;
type Result<T, E> = [T?, E?];

type TResultService<T> = {
  total: number;
  data: T[];
};

type TUser = {
  id: number;
  email: string;
  password: string;
};

type TUserWToken = {
  user: TUser;
  token: string;
};
