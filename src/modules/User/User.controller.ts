import { Request, Response, NextFunction } from "express";
import { Controller, Get, Post, ClassErrorMiddleware } from "@overnightjs/core";
import errorHandler from "../../services/errorHandler";
import UserService from "./User.service";
import { UserDTO } from "./User.dto";

@Controller("user")
@ClassErrorMiddleware(errorHandler)
export default class UserController {
  constructor(private service: UserService) {}

  @Get()
  private async find(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { limit = 20, skip = 0 } = req.query;

    const [result, error] = await this.service.findAll(+limit, +skip);
    if (error) {
      next(error);
      return;
    }

    res.json({
      total: result.total,
      limit: +limit,
      skip: +skip,
      data: result?.data
        ? result.data.map((el: UserDTO) => el.serialize())
        : [],
    });
  }

  @Post()
  private async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const [result, error] = await this.service.create(req.body);
    if (error) {
      next(error);
      return;
    }
    res.json(result);
    return;
  }
}
