import { Controller, Get, UseGuards, Req, Res, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface SocialUser {
  email: string;
  name: string;
  picture: string;
  provider: string;
  providerId: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // ConfigService 주입
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Google OAuth 시작
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as SocialUser;
    const result = await this.authService.socialLogin(user);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.redirect(
      'https://d1i3d05ur40jbn.cloudfront.net/home',
    );
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {
    // Kakao OAuth 시작
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthCallback(@Req() req: Request, @Res() res: Response) {
    console.log(req.user);
    const user = req.user as SocialUser;
    const result = await this.authService.socialLogin(user);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'none', // 또는 'none' + secure:true (HTTPS 필수)
      secure: true, // HTTP면 false로 설정
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.redirect(
      'https://d1i3d05ur40jbn.cloudfront.net/home',
    );
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverAuth() {
    // Naver OAuth 시작
  }

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as SocialUser;
    const result = await this.authService.socialLogin(user);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.redirect(
      'https://d1i3d05ur40jbn.cloudfront.net/home',
    );
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.status(200).json({ message: '로그아웃 성공' });
  }
}
