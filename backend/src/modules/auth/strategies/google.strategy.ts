import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { User } from '../../../database/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<void> {
        const { id, name, emails, photos } = profile;

        if (!emails || emails.length === 0) {
            return done(new UnauthorizedException('Google account must have an email'), false);
        }

        // Interpolar direto num template literal materializa a string
        // "undefined" quando o Google não envia familyName (contas sem
        // sobrenome). O .trim() não remove, porque fica no meio — e esse
        // nome é impresso no certificado. Juntar só as partes presentes.
        const nomeCompleto = [name?.givenName, name?.familyName]
            .filter((parte): parte is string => typeof parte === 'string' && parte.trim() !== '')
            .join(' ')
            .trim();

        const userDto = {
            googleId: id,
            // displayName e o e-mail são fallbacks para contas sem nome algum.
            name: nomeCompleto || profile.displayName || emails[0].value,
            email: emails[0].value,
            avatarUrl: photos[0]?.value,
        };

        try {
            const user: User = await this.authService.validateOrCreateUser(userDto);
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    }
}
