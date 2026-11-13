import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AccountType, isAdmin, isSuperAdmin } from '@v6y/core-logic';

/**
 * Restricts a resolver to ADMIN and SUPERADMIN accounts, i.e. the accounts the
 * back-office lets in. The back-office checks the role at login only, on the
 * client, so every mutation it calls must enforce it again here.
 */
@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const { user } = GqlExecutionContext.create(context).getContext<{ user?: AccountType }>();

        return !!user && (isAdmin(user) || isSuperAdmin(user));
    }
}
