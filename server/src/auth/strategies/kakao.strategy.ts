import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

const adjectives = [
  '푸른',
  '빨간',
  '반짝이는',
  '날아가는',
  '행복한',
  '조용한',
  '빠른',
  '찬란한',
  '깜찍한',
  '무서운',
];

const nouns = [
  '달걀',
  '만보',
  '별',
  '바람',
  '나무',
  '호랑이',
  '고양이',
  '강아지',
  '바다',
  '불꽃',
];

function getRandomKoreanName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adj + noun;
}

interface KakaoProfile {
  id: string;
  username: string;
  displayName: string;
  _json: {
    properties: {
      nickname: string;
      profile_image?: string;
      thumbnail_image?: string;
    };
    kakao_account: {
      email?: string;
    };
  };
}

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('KAKAO_CLIENT_ID');
    const clientSecret = configService.get<string>('KAKAO_CLIENT_SECRET');

    if (!clientID || !clientSecret) {
      throw new Error('Kakao OAuth credentials are not configured properly');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: 'https://walkee.duckdns.org/auth/kakao/callback',
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: KakaoProfile,
    done: (error: any, user?: any) => void,
  ): void {
    const { _json } = profile;
    const user = {
      email: _json.kakao_account?.email || '',
      name: getRandomKoreanName(),
      picture:
        'http://walkeeteam.s3-website.ap-northeast-2.amazonaws.com/src/assets/profile.png',
      provider: 'kakao',
      providerId: profile.id,
    };
    done(null, user);
  }
}
