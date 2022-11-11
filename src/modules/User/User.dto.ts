import { TUser } from "../../global";
import baseDTO from "../../utils/baseDTO";

export class UserDTO extends baseDTO<TUser> {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: TUser) {
    super();
    for (const el in data) {
      if (data[el] !== null) {
        this[el] = data[el];
      }
    }
  }

  protectPassword() {
    delete this.password;
    return this;
  }
}
