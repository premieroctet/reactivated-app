import {
  Controller,
  NotFoundException,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Repository } from '../repository/repository.entity';
import { RepositoryService } from '../repository/repository.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    public service: UsersService,
    private readonly repositoryService: RepositoryService,
  ) {}

  @Post(':id/delete-account')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Param('id') userId: string, @Req() req) {
    const user = await this.service.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (req.user.id !== user.id) {
      throw new UnauthorizedException();
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
