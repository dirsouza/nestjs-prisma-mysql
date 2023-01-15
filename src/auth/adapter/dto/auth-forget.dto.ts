import { PickType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './../../../user/adapter/dto/create-user.dto';

export class AuthForgetDTO extends PickType(CreateUserDTO, [
  'email',
] as const) {}
