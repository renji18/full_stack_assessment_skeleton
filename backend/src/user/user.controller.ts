import { Controller, Get, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('find-all')
  findAllUsers(@Res() response: Response) {
    return this.userService.findAllUsers(response);
  }

  @Get('find-by-home')
  findUsersByHome(@Query('homeId') homeId: number, @Res() response: Response) {
    return this.userService.findUsersByHome(homeId, response);
  }
}
