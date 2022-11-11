import { User } from "./User.entity";
import UserRepository from "./User.repository";
import jwt from "jsonwebtoken";
import { UserDTO } from "./User.dto";
import { err, ok, promisifier } from "../../utils/promisifier";
import { Result, TResultService, TUserWToken } from "../../global";

export default class UserService {
  repo: UserRepository;
  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  async findAll(
    limit: number,
    skip: number
  ): Promise<Result<TResultService<UserDTO>, Error>> {
    if (limit === 0) {
      skip = 0;
    }
    const [result, error] = await promisifier<TResultService<UserDTO>>(
      this.repo.findAll(limit, skip)
    );
    if (error) {
      return err(new Error(error));
    }
    return ok(result);
  }

  // TODO: implement service + repo
  async findByEmail(email: string): Promise<UserDTO[]> {
    return ok(new UserDTO({ id: 1 }));
  }

  async create(data: Partial<User>): Promise<Result<UserDTO, Error>> {
    const [user] = await this.findByEmail(data.email);
    if (user) {
      return err(new Error("pseudo already exists"));
    }
    const [result, error] = await promisifier<UserDTO>(this.repo.create(data));
    if (error) {
      return err(new Error(error));
    }

    return ok(result.protectPassword());
  }

  async update(id: string, data: Partial<User>) {}
  async delete(id: string) {}

  async authenticate(
    pseudo: string,
    password: string
  ): Promise<Result<TUserWToken, Error>> {
    const [user, error] = await this.findByEmail(pseudo);
    if (error) {
      return err(new Error("no user found with this pseudo"));
    }
    const result = this.repo.compareHash(password, user.password);

    if (!result) {
      return err(new Error("incorrect password"));
    }

    const protectedUser = new UserDTO(user).protectPassword();

    return ok({
      user: protectedUser,
      token: this.generateToken(protectedUser),
    });
  }

  generateToken(user: UserDTO) {
    return jwt.sign(Object.assign({}, user), process.env.SECRET, {
      expiresIn: "10d",
    });
  }
}
