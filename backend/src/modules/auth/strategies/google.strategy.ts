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

        const userDto = {
            googleId: id,
            name: `${name.givenName} ${name.familyName}`.trim(),
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
