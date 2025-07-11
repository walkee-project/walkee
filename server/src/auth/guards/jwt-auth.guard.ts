import {
  Injectable,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('JwtAuthGuard canActivate 호출됨');
    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): any {
    this.logger.log('JwtAuthGuard handleRequest 호출됨');
    this.logger.debug('Error:', err);
    this.logger.debug('User:', user);
    this.logger.debug('Info:', info);
    this.logger.debug('context:', context);

    if (err || !user) {
      this.logger.warn('JwtAuthGuard 인증 실패');
      this.logger.warn('Error details:', String(err));
      this.logger.warn('Info details:', String(info));
      throw new UnauthorizedException('인증에 실패했습니다.');
    }

    this.logger.log('JwtAuthGuard 인증 성공');
    return user;
  }
}
