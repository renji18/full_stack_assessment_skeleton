import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // find all the users from the database
  async findAllUsers(response: Response): Promise<Response> {
    try {
      const users = await this.prisma.user.findMany({
        include: { _count: true },
      });

      return response
        .status(200)
        .json({ success: 'Request Successful', users });
    } catch (error) {
      return response.status(500).json({
        error: 'An error occurred while fetching users',
        details: error.message,
      });
    }
  }

  // should return all users related to a home
  async findUsersByHome(homeId: number, response: Response): Promise<Response> {
    try {
      const users = await this.prisma.user.findMany({
        where: { user_home: { some: { home_id: Number(homeId) } } },
      });

      return response
        .status(200)
        .json({ success: 'Request Successful', users });
    } catch (error) {
      return response.status(500).json({
        error: 'An error occurred while fetching users',
        details: error.message,
      });
    }
  }
}
