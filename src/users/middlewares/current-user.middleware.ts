import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';

// we need to include the currentUser before run everything. If not it is in the interceptor, and that runs before
// the request handler

// BEFORE
/* request -> cookie middleware -> AdminGuard -> CurrentUserInterceptor -> Request handler
NOW
 request -> cookie middleware -> CurrentUserMiddleware -> AdminGuard -> Request handler
*/

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      req.currentUser = user;
    }
    next();
  }
}
