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
    } else if (user.name !== profile.name || user.avatarUrl !== profile.avatarUrl) {
      // Mantém nome e foto em sincronia com o Google a cada login. Antes,
      // os dados do perfil só eram gravados na criação da conta: trocar o
      // nome no Google não refletia aqui, e nomes gravados de forma
      // incorreta ficavam congelados para sempre.
      user.name = profile.name;
      user.avatarUrl = profile.avatarUrl ?? user.avatarUrl;
      await this.userRepository.save(user);
    }

    // A streak não é mais atualizada aqui. Fazer isso só no fluxo OAuth era
    // justamente o bug: com JWT de um dia, quem volta com cookie válido não
    // passa por este método. O StreakInterceptor global cobre toda requisição
    // autenticada, inclusive o callback do Google.
    return user;
  }

  generateJwt(user: User): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
