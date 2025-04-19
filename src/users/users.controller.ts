import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './create-user-dto';

@Controller('users')
export class UsersController {    
    @Post('/signup')
    Create(
        @Body()
        createUserDTO : CreateUserDTO,
    ) {
        console.log(typeof createUserDTO.blocked, typeof createUserDTO.email)
        return createUserDTO
    }
}
