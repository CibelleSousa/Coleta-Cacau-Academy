import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    async getMyProfile(@CurrentUser() user: User) {
        return this.usersService.getProfile(user.id);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Atualizar perfil do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    async updateMyProfile(
        @CurrentUser() user: User,
        @Body() updateDto: UpdateUserDto,
    ) {
        return this.usersService.updateMyProfile(user.id, updateDto);
    }
}
