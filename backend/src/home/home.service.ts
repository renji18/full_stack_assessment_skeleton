import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  // should return all homes related to a user
  // enabled pagination which returns the data, total number of pages, total items, a boolean for if there is a next page or not.
  async findHomesByUser(
    userId: number,
    response: Response,
    page?: number,
  ): Promise<Response> {
    try {
      if (!page) {
        const homes = await this.prisma.home.findMany({
          where: { user_home: { some: { user_id: Number(userId) } } },
        });

        return response
          .status(200)
          .json({ success: 'Request Successful', homes });
      } else {
        const totalItems = await this.prisma.home.count({
          where: { user_home: { some: { user_id: Number(userId) } } },
        });

        const limit = 50;
        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages;

        const homes = await this.prisma.home.findMany({
          where: { user_home: { some: { user_id: Number(userId) } } },
          skip,
          take: limit,
          include: { _count: true },
        });

        return response.status(200).json({
          success: 'Request Successful',
          data: homes,
          totalPages,
          totalItems,
          hasNextPage,
        });
      }
    } catch (error) {
      return response.status(500).json({
        error: 'An error occurred while fetching homes',
        details: error.message,
      });
    }
  }

  // this API should take in the new bunch of users (from the modal after Save) and the home for which the Edit Users button was clicked
  // first it checks if the new users provided exist or not.
  // the operation to then update the users is wrapped in a transaction to ensure that either all changes are made or none at all.
  async updateUsersForHome(
    updateUsersDto: { home_id: number; user_ids: number[] },
    response: Response,
  ): Promise<Response> {
    const { home_id, user_ids } = updateUsersDto;

    try {
      if (!Array.isArray(user_ids) || user_ids.some(isNaN)) {
        return response.status(400).json({
          error: 'Invalid input: user_ids must be an array of numbers',
        });
      }

      const existingUsers = await this.prisma.user.findMany({
        where: { user_id: { in: user_ids } },
        select: { user_id: true },
      });

      const existingUserIds = existingUsers.map((user) => user.user_id);

      const invalidUserIds = user_ids.filter(
        (id) => !existingUserIds.includes(id),
      );

      if (invalidUserIds.length > 0) {
        return response.status(400).json({
          error: `Invalid user_ids: ${invalidUserIds.join(', ')}`,
        });
      }

      await this.prisma.$transaction(async (prisma) => {
        await prisma.user_home.deleteMany({
          where: { home_id: Number(home_id) },
        });

        const data = user_ids.map((userId) => ({
          home_id: Number(home_id),
          user_id: Number(userId),
        }));

        await prisma.user_home.createMany({ data });
      });

      return response
        .status(200)
        .json({ success: 'Users updated successfully' });
    } catch (error) {
      return response.status(500).json({
        error: 'An error occurred while updating users',
        details: error.message,
      });
    }
  }
}
