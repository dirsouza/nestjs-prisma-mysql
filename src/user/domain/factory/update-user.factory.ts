import { Prisma } from '@prisma/client';
import { UpdatePatchUserDTO } from './../../adapter/dto/update-patch-user.dto';
import { BcryptService } from '../../../bcrypt/domain/service/bcrypt.service';

export async function updateUserFactory(
  data: UpdatePatchUserDTO
): Promise<Prisma.UserUpdateInput> {
  const bcryptService = new BcryptService();

  const user: Prisma.UserUpdateInput = {};
  if (data.name) user.name = data.name;
  if (data.email) user.email = data.email;
  if (data.birth) user.birth = new Date(data.birth);
  if (data.password) user.password = await bcryptService.genHash(data.password);
  if (data.role) user.role = data.role;

  return user;
}
