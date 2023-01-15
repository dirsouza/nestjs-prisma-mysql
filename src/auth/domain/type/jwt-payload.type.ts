export type TJwtPayload = {
  name: string;
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
};
