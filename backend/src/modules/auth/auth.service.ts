import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateOrCreateUser(profile: CreateUserDto): Promise<User> {
    let user = await this.userRepository.findOne({ where: { googleId: profile.googleId } });
    
    if (!user) {
      user = this.userRepository.create({
        ...profile,
        streakCount: 1,
        lastLoginDate: new Date()
      });
      await this.userRepository.save(user);
    } else {
      this.updateStreak(user);
      await this.userRepository.save(user);
    }
    
    return user;
  }

  private updateStreak(user: User) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLogin =  user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    if(lastLogin) {
      lastLogin.setHours(0, 0, 0, 0);
    }

    if(!lastLogin) {
      user.streakCount = 1;
    } else {
      const diffTime = today.getTime() - lastLogin.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return
      } else if (diffDays === 1) {
        user.streakCount += 1;
      } else {
        user.streakCount = 1;
      }
    }
    user.lastLoginDate = new Date();
  }

  generateJwt(user: User): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
