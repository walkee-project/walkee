import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

interface SocialUserData {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  picture: string;
}

interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  provider: string;
}

interface SocialLoginResult {
  accessToken: string;
  user: {
    userIdx: number;
    userProvider: string;
    userId: string;
    userEmail: string;
    userName: string;
    userProfile: string;
    userPoint: number;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async socialLogin(
    socialUserData: SocialUserData,
  ): Promise<SocialLoginResult> {
    try {
      const { provider, providerId, email, name, picture } = socialUserData;

      let user = await this.usersService.findByEmail(email);

      console.log(user);
      if (!user) {
        // 이메일이 없으면 새 유저 생성
        user = await this.usersService.create({
          userProvider: provider,
          userId: providerId,
          userEmail: email,
          userName: name,
          userProfile: picture,
          userPoint: 0,
        });
      } else {
        // 이메일은 있으나 provider 정보가 다를 경우 갱신 (선택 사항)
        if (user.userProvider !== provider || user.userId !== providerId) {
          await this.usersService.updateSocialInfo(user.userIdx, {
            userProvider: provider,
            userId: providerId,
          });
        }
      }

      if (!user || typeof user.userIdx !== 'number') {
        this.logger.error(`Invalid user object: ${JSON.stringify(user)}`);
        throw new Error('JWT payload에 필수 정보가 없습니다.');
      }

      const payload: JwtPayload = {
        sub: Number(user.userIdx),
        email: user.userEmail,
        name: user.userName,
        provider: user.userProvider,
      };
      console.log(payload);
      const accessToken = await this.jwtService.signAsync(payload);
      console.log(accessToken);
      return {
        accessToken,
        user: {
          userIdx: user.userIdx,
          userProvider: user.userProvider,
          userId: user.userId,
          userEmail: user.userEmail,
          userName: user.userName,
          userProfile: user.userProfile || '',
          userPoint: user.userPoint,
        },
      };
    } catch (error) {
      this.logger.error('소셜 로그인 중 오류 발생:', error);
      throw new UnauthorizedException('로그인 처리 중 오류가 발생했습니다.');
    }
  }

  async validateUser(userIdx: number) {
    const user = await this.usersService.findOne(userIdx);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }
}
