import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as process from 'process';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 회원가입 api
  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userRepo.create(createUserDto);
    await this.userRepo.save(newUser);
    return newUser;
  }

  // 로그인 api
  async getUserByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (user) return user;
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async getUserById(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (user) return user;
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async getUserByUsername(username: string) {
    const user = await this.userRepo.findOneBy({ username: username });
    if (user) return user;
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async updatePassword(userId: string, confirmPassword: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const saltValue = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(confirmPassword, saltValue);

    await this.userRepo.update({ id: userId }, { password: user.password });
    console.log(userId);
    const updateUser = await this.userRepo.findOneBy({ id: userId });
    return updateUser;
  }
}
