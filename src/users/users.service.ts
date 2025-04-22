import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './create-user-dto';
import { SignupResponse } from './user';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async signup(payload: CreateUserDTO): Promise<SignupResponse> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (existingUser) {
      // throw new Error('User already exist!');

      throw new BadRequestException('User created with the email you provide.', {
        cause: new Error(),
        description: 'User already exist!',
      });
    }
    //save the password as encrypted format - bcrypt.js
    const hash = await this.encryptpassword(payload.password, 10);
    //save the user in DB
    payload.password = hash;
    //return id and email
    return await this.prisma.user.create({
      data: payload,
      select: {
        email: true,
        id: true,
      },
    });
  }

  async login(loginDTO: LoginDTO) {}


  async encryptpassword(plaintext, saltRounds) {
    return await bcrypt.hash(plaintext, saltRounds);
  }
}
