import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [UserModule, HomeModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
