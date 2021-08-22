import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
// import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { RolesGuard } from './utils/role/role.guard';

require('dotenv').config()

@Module({
  imports: [
    // AuthModule, 
    // UsersModule,
    // MongooseModule.forRoot(
    //   process.env.MONGODB_URL,
    // ), // so that we can use Mongoose
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule {}
