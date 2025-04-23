import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './create-user-dto';
import { UsersService } from './users.service';
import { LoginDTO } from './login-dto';
import { AuthGuard } from './auth/auth.guard';
// import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService:UsersService) {}
    
    @Post('/signup')
    async Create(
        @Body()
        createUserDTO : CreateUserDTO,
    ) {
        // console.log(typeof createUserDTO.blocked, typeof createUserDTO.email)
        // return createUserDTO
        return await this.userService.signup(createUserDTO);
    }

    @Post('/login')
    async login(
        @Body()
        loginDTO : LoginDTO,
    ) {
        // console.log(typeof createUserDTO.blocked, typeof createUserDTO.email)
        // return createUserDTO
        return await this.userService.login(loginDTO);
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    async getProfile(@Request() req ){
        return req.user;
    } 
}
