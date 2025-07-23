import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

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

interface GoogleProfile {
  id: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');

    if (!clientID || !clientSecret) {
      throw new Error('Google OAuth credentials are not configured properly');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: 'https://walkeeee.cloud/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): void {
    const { emails } = profile;
    const user = {
      email: emails[0]?.value || '',
      name: getRandomKoreanName(),
      provider: 'google',
      providerId: profile.id,
    };
    done(null, user);
  }
}
