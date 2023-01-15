import { IsJWT } from 'class-validator';

export class AuthAccessTokenDTO {
  @IsJWT()
  accessToken: string;
}
