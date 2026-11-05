import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { StreakService } from './streak.service';
import { User } from '../../database/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, StreakService],
    // StreakService é exportado para o StreakInterceptor, registrado
    // globalmente no AppModule.
    exports: [UsersService, StreakService],
})
export class UsersModule {}