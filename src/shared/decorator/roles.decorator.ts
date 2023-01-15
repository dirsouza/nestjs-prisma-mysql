import { SetMetadata } from '@nestjs/common';
import { ERoles } from '../enum/roles.enum';
import { ROLES_KEY } from '../constant';

export const Roles = (...roles: ERoles[]) => SetMetadata(ROLES_KEY, roles);
