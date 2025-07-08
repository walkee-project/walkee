import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('JwtAuthGuard canActivate 호출됨');
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    this.logger.log('JwtAuthGuard handleRequest 호출됨');
    if (err || !user) {
      this.logger.warn('JwtAuthGuard 인증 실패');
    }
    return user;
  }
}
