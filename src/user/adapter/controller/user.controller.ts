import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../../domain/service/user.service';
import { CreateUserDTO, UpdatePatchUserDTO, UpdatePutUserDTO } from '../dto';
import { AuthGuard, RolesGuard } from '../../../shared/guard';
import { ParamId, Roles } from '../../../shared/decorator';
import { ERoles } from '../../../shared/enum';
import { TUser } from '../../domain/type';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(ERoles.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async list(): Promise<TUser[]> {
    return this.userService.list();
  }

  @Get(':id')
  async show(@ParamId() id: number): Promise<TUser> {
    return this.userService.show(id);
  }

  @Post()
  async create(@Body() body: CreateUserDTO): Promise<TUser> {
    return this.userService.create(body);
  }

  @Put(':id')
  async update(
    @Body() body: UpdatePutUserDTO,
    @ParamId() id: number
  ): Promise<TUser> {
    return this.userService.update(id, body);
  }

  @Patch(':id')
  async updatePartial(
    @Body() body: UpdatePatchUserDTO,
    @ParamId() id: number
  ): Promise<TUser> {
    return this.userService.updatePartial(id, body);
  }

  @Delete(':id')
  async delete(@ParamId() id: number): Promise<TUser> {
    return this.userService.delete(id);
  }
}
