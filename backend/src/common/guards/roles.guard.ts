import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../../database/entities/user.entity';

/**
 * Autoriza por papel, a partir da metadata de `@Roles()`.
 *
 * Deve ser usado SEMPRE depois do JwtAuthGuard, na mesma lista:
 *
 *     @UseGuards(JwtAuthGuard, RolesGuard)
 *
 * O Nest executa os guards na ordem global → controller → rota, e dentro de
 * uma lista, na ordem declarada. Registrá-lo como APP_GUARD global faria com
 * que rodasse ANTES do JwtAuthGuard: `request.user` ainda estaria indefinido
 * e toda rota com @Roles() negaria acesso, inclusive a quem tem o papel.
 *
 * Sem metadata @Roles(), libera — por isso pode ficar em todos os
 * controllers sem alterar o comportamento das rotas existentes.
 */
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
        const request = context.switchToHttp().getRequest<{ user?: User }>();
        const user = request.user;

        // Check if the user exists and has the required role
        if (!user?.role) {
            return false;
        }

        return requiredRoles.includes(user.role);
    }
}