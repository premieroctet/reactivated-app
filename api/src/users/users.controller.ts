import {
  Controller,
  Param,
  Post,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Crud } from '@nestjsx/crud';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { join } from 'path';
import { RepositoryService } from '../repository/repository.service';
import { Repository } from '../repository/repository.entity';

@Crud({
  model: {
    type: User,
  },
})
@Controller('users')
export class UsersController {
  constructor(
    public service: UsersService,
    private readonly repositoryService: RepositoryService,
  ) {}

  @Post(':id/delete-account')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Param('id') userId: string) {
    const user = await this.service.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const repos: Repository[] = await this.repositoryService.getAllRepos();
    const reposOfUser = repos.filter((repo: Repository) => {
      if (repo.users.length === 1 && repo.users[0].id === user.id) {
        return true;
      }
      return false;
    });
    await this.repositoryService.removeRepos(reposOfUser);
    return await this.service.deleteUser(user);
  }
}
