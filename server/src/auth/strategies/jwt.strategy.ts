import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  provider: string;
}

const cookieExtractor = (req: Request) => {
  console.log('cookieExtractor req.cookies:', req?.cookies);
  const token = req?.cookies?.['access_token'] ?? null;
  console.log('Extracted JWT token:', token);
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    console.log('JwtStrategy constructor called'); 
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT payload received:', payload);
    if (typeof payload?.sub !== 'number' || isNaN(payload.sub)) {
      console.error('Invalid JWT payload sub:', payload?.sub);
      throw new UnauthorizedException('Invalid JWT payload');
    }
    const user = await this.authService.validateUser(payload.sub);
    return user;
  }
}
