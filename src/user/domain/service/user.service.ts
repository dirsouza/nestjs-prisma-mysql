import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../../prisma/domain/service/prisma.service';
import {
  CreateUserDTO,
  UpdatePatchUserDTO,
  UpdatePutUserDTO,
} from './../../adapter/dto';
import { Exception } from '../../../shared/exception/exception';
import { EException } from '../../../shared/enum';
import { excludeFieldHelper } from '../../../shared/helper';
import { createUserFactory, updateUserFactory } from '../factory';
import { TUser } from '../type';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<TUser[]> {
    const usersList: TUser[] = [];

    const users = await this.prisma.user.findMany();
    for (const user of users) {
      usersList.push(excludeFieldHelper(user, ['password']));
    }

    return usersList;
  }

  async show(id: number): Promise<TUser> {
    await this.userByIdExists(id);

    const user = await this.prisma.user.findUnique({ where: { id } });

    return excludeFieldHelper(user, ['password']);
  }

  async create(createUser: CreateUserDTO): Promise<TUser> {
    await this.userByEmailExists(createUser.email);

    const data = await createUserFactory(createUser);
    const user = await this.prisma.user.create({ data });

    return excludeFieldHelper(user, ['password']);
  }

  async update(id: number, updateUser: UpdatePutUserDTO): Promise<TUser> {
    await this.userByIdExists(id);

    const data = await createUserFactory(updateUser);
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return excludeFieldHelper(user, ['password']);
  }

  async updatePartial(
    id: number,
    updateUser: UpdatePatchUserDTO
  ): Promise<TUser> {
    await this.userByIdExists(id);

    const data = await updateUserFactory(updateUser);
    if (!Object.keys(data).length) {
      throw new Exception(EException.USER_NO_DATA, 'No user data to update');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return excludeFieldHelper(user, ['password']);
  }

  async delete(id: number): Promise<TUser> {
    await this.userByIdExists(id);

    const user = await this.prisma.user.delete({ where: { id } });

    return excludeFieldHelper(user, ['password']);
  }

  private async userByEmailExists(email: string): Promise<void> {
    const user = await this.prisma.user.count({ where: { email } });
    if (user) {
      throw new Exception(
        EException.USER_EXISTS,
        'There is already a user with the entered email address'
      );
    }
  }

  private async userByIdExists(id: number): Promise<void> {
    const user = await this.prisma.user.count({ where: { id } });
    if (!user) {
      throw new Exception(
        EException.USER_NOT_FOUND,
        'Unable to find user by entered ID'
      );
    }
  }
}
