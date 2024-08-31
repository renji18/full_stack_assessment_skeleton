import { Body, Controller, Get, Put, Query, Res } from '@nestjs/common';
import { HomeService } from './home.service';
import { Response } from 'express';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('find-by-user')
  async findHomesByUser(
    @Query('userId') userId: number,
    @Res() response: Response,
    @Query('page') page?: number,
  ) {
    return this.homeService.findHomesByUser(userId, response, page);
  }

  @Put('update-users')
  async updateUsersForHome(
    @Body() updateUsersDto: { home_id: number; user_ids: number[] },
    @Res() response: Response,
  ) {
    return this.homeService.updateUsersForHome(updateUsersDto, response);
  }
}
