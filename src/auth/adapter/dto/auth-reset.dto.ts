import { PickType } from '@nestjs/mapped-types';
import { IsJWT } from 'class-validator';
import { CreateUserDTO } from './../../../user/adapter/dto/create-user.dto';

export class AuthResetDTO extends PickType(CreateUserDTO, [
  'password',
] as const) {
  @IsJWT()
  token: string;
}
