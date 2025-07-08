import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';

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

interface NaverProfile {
  id: string;
  displayName: string;
  _json: {
    id: string;
    email: string;
    name: string;
    nickname: string;
  };
}

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('NAVER_CLIENT_ID');
    const clientSecret = configService.get<string>('NAVER_CLIENT_SECRET');

    if (!clientID || !clientSecret) {
      throw new Error('Naver OAuth credentials are not configured properly');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: configService.get<string>(
        'NAVER_CALLBACK_URL',
        'http://localhost:3000/auth/naver/callback',
      ),
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: NaverProfile,
    done: (error: any, user?: any) => void,
  ): void {
    const { _json } = profile;

    const user = {
      email: _json.email, // 여기 수정
      name: getRandomKoreanName(),
      picture: 'http://localhost:5173/src/assets/profile.png',
      provider: 'naver',
      providerId: _json.id, // 여기 수정
    };

    done(null, user);
  }
}
