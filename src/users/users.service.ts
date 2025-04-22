import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDTO } from './create-user-dto';
import { SignupResponse } from './user';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { error, log } from 'console';
import { LoginDTO } from './login-dto';
import { JwtService } from '@nestjs/jwt';
import { promises } from 'dns';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signup(payload: CreateUserDTO): Promise<SignupResponse> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (existingUser) {
      // throw new Error('User already exist!');

      throw new BadRequestException(
        'User created with the email you provide.',
        {
          cause: new Error(),
          description: 'User already exist!',
        },
      );
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

  async login(loginDTO: LoginDTO) : Promise<{ accessToken: string}> {
    //find user based on email
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginDTO.email,
      },
    });

    //if there is no user, show unauthorized
    if (!user) {
      throw new UnauthorizedException();
    }

    // decrypt the user password
    const Ismatched = await this.decryptpassword(
      loginDTO.password,
      user.password,
    );
    if (!Ismatched) {
      throw new UnauthorizedException('Invalid password!');
    }
    //match user provided password with decrypt paasword
    const accessToken = await this.jwtService.signAsync(
      {
        email: user.email,
        id: user.id,
      },
      {expiresIn: '7d'}
    );

    //password is not match send invalid message

    //all match return json web token

    return {accessToken};
  }

  async encryptpassword(plaintext, saltRounds) {
    return await bcrypt.hash(plaintext, saltRounds);
  }
  async decryptpassword(plaintext, hash) {
    return await bcrypt.compare(plaintext, hash);
  }
}
