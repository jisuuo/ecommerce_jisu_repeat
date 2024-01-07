import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RoleEnum } from '../enum/role.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  async getAllUsers() {
    // const user = await this.getUserById(userId);
    // if (!user.role.includes(RoleEnum.ADMIN)) {
    //   throw new HttpException('Not Admin', HttpStatus.BAD_REQUEST);
    // }
    return await this.userRepo.find();
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException('등록된 유저가 아닙니다.');
    }

    if (updateProfileDto.nickname) {
      user.nickname = updateProfileDto.nickname;
    }

    if (updateProfileDto.profileImg) {
      user.profileImg = updateProfileDto.profileImg;
    }

    if (updateProfileDto.country) {
      user.address.country = updateProfileDto.country;
    }

    if (updateProfileDto.city) {
      user.address.city = updateProfileDto.city;
    }

    if (updateProfileDto.street) {
      user.address.street = updateProfileDto.street;
    }

    const updateUser = await this.userRepo.save(user);
    return updateUser;
  }

  async updatePassword(userId: string, confirmPassword: string) {
    const user = await this.userRepo.findOneBy({ id: userId });

    const saltValue = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(confirmPassword, saltValue);

    await this.userRepo.update({ id: userId }, { password: user.password });
    const updateUser = await this.userRepo.findOneBy({ id: userId });
    return updateUser;
  }
}
