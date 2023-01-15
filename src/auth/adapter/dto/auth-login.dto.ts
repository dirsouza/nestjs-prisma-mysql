import { PickType } from '@nestjs/mapped-types';
import { CreateUserDTO } from '../../../user/adapter/dto/create-user.dto';

export class AuthLoginDTO extends PickType(CreateUserDTO, [
  'email',
  'password',
] as const) {}
