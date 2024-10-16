import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { url } = request;
        if (url.includes("/auth")) {
            return true;
        }
        if (!request?.headers?.authorization) return super.canActivate(context);

        const [bearer, token] = request.headers.authorization.split(' ');
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = decoded;
            return true;
        } catch (error) {
            return super.canActivate(context);
        }


    }
}