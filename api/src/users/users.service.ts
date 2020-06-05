import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUser(username: string): Promise<User> {
    const users = await this.usersRepository.find({
      where: [{ username }],
    });
    return users[0];
  }

  async getById(id: User['id']) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async updateUser(user: User) {
    this.usersRepository.save(user);
  }

  async createUser(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  async deleteUser(user: User) {
    this.usersRepository.delete(user);
  }

  async githubAuth(accessToken, profile): Promise<User> {
    let user = await this.getUser(profile.username);

    if (!user) {
      let newUser: User = {
        username: profile.username,
        githubId: profile.id,
        githubToken: accessToken,
      };
      user = await this.createUser(newUser);
    } else {
      await this.updateUser({
        ...user,
        githubToken: accessToken,
      });
    }

    return user;
  }
}
