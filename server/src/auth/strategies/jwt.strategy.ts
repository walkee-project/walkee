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

// 타입 안전한 cookieExtractor 함수
const cookieExtractor = (req: Request): string | null => {
  console.log('cookieExtractor called');
  console.log('req.cookies:', req?.cookies);
  console.log('req.headers.cookie:', req?.headers?.cookie);

  let token: string | null = null;

  // 쿠키 파서가 설정된 경우 - 타입 안전하게 처리
  const cookies = req?.cookies as Record<string, string> | undefined;
  if (cookies?.['access_token']) {
    token = cookies['access_token'];
  }
  // 쿠키 파서가 설정되지 않은 경우 수동으로 파싱
  else if (req?.headers?.cookie && typeof req.headers.cookie === 'string') {
    const parsedCookies = req.headers.cookie.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    token = parsedCookies['access_token'] || null;
  }

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

    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      console.error('JWT_SECRET not found in configuration');
      throw new Error('JWT_SECRET must be configured');
    }

    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT payload received:', payload);

    // payload 검증 강화
    if (!payload || typeof payload.sub !== 'number' || isNaN(payload.sub)) {
      console.error('Invalid JWT payload sub:', payload?.sub);
      throw new UnauthorizedException('Invalid JWT payload');
    }

    try {
      const user = await this.authService.validateUser(payload.sub);
      if (!user) {
        console.error('User not found for sub:', payload.sub);
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error validating user:', error);
      throw new UnauthorizedException('User validation failed');
    }
  }
}
