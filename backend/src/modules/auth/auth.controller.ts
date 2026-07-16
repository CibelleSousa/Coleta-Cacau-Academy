import { Controller, Get, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GoogleOAuthGuard } from '../../common/guards/google-oauth.guard';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from '../../database/entities/user.entity';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Get('google')
    @ApiOperation({ summary: 'Iniciar fluxo de autenticação com Google' })
    @ApiResponse({ status: 302, description: 'Redireciona para a página de login do Google.' })
    @UseGuards(GoogleOAuthGuard)
        async googleAuth() {
            // Guard redirects to Google
        }

    @Get('google/callback')
    @ApiOperation({ summary: 'Callback do Google OAuth' })
    @ApiResponse({ status: 302, description: 'Autenticação bem-sucedida, redireciona para o frontend com cookie.' })
    @UseGuards(GoogleOAuthGuard)
    async googleCallback(@Req() req: Request, @Res() res: Response) {
        // At this point, req.user contains our validated User entity thanks to GoogleStrategy
        const user = req.user as User;
        if (!user) throw new UnauthorizedException('Authentication failed');

        // Generate the JWT
        const token = this.authService.generateJwt(user);

        // Set the JWT in an HttpOnly cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: this.configService.get('nodeEnv') === 'production',
            sameSite: 'lax', // 'lax' is generally safer for OAuth redirects than 'none'
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        });

        // Redirect user to the Next.js dashboard
        const frontendUrl = this.configService.get<string>('frontendUrl');
        return res.redirect(`${frontendUrl}/app`);
    }

    
    @Get('logout')
    @ApiOperation({ summary: 'Encerrar sessão (limpar cookies)' })
    @ApiResponse({ status: 200, description: 'Logout realizado com sucesso.' })
    async logout(@Req() req: Request, @Res() res: Response) {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: this.configService.get('nodeEnv') === 'production',
        });
        return res.status(200).json({ message: 'Logged out successfully' });
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Dados do usuário retornados com sucesso.' })
    @UseGuards(AuthGuard('jwt'))
    async getMe(@Req() req: Request) {
        // Thanks to JwtStrategy, req.user is populated safely
        const user = req.user as User;
        return { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl, role: user.role };
    }
}
