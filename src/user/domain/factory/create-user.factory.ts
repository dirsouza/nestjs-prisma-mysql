import { Prisma } from '@prisma/client';
import { UpdatePutUserDTO } from './../../adapter/dto/update-put-user.dto';
import { BcryptService } from '../../../bcrypt/domain/service/bcrypt.service';

export async function createUserFactory(
  data: UpdatePutUserDTO
): Promise<Prisma.UserCreateInput> {
  const bcryptService = new BcryptService();

  const birth = data.birth ? new Date(data.birth) : null;
  const password = await bcryptService.genHash(data.password);

  return { ...data, birth, password };
}
