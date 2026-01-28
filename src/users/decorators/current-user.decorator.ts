import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    // ExecutionContext works very well to do not specify the communication protocol
    const request = ctx.switchToHttp().getRequest();
    request.session.currentUser;
  },
);
