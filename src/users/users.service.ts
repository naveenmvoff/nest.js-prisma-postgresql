import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './create-user-dto';
import { SignupResponse } from './user';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async signup(payload: CreateUserDTO): Promise<SignupResponse> {
    //save the password as encrypted format - bcrypt.js
    const hash = await this.encryptpassword(payload.password, 10);
    //save the user in DB
    payload.password = hash
    //return id and email
  }
  async encryptpassword(plaintext, saltRounds) {
    return await bcrypt.hash(plaintext, saltRounds);
  }
}
