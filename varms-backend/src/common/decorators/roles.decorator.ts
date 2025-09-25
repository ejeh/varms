import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type RoleName = 'Student' | 'Supervisor' | 'Examiner' | 'Admin';

export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
