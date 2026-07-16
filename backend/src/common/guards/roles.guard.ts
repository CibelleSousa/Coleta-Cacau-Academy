import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Retrieve required roles from the handler or class
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If no roles are required, allow access
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // Extract the user from the request (populated by JwtAuthGuard)
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Check if the user exists and has the required role
        if (!user || !user.role) {
            return false;
        }

        return requiredRoles.includes(user.role);
    }
}