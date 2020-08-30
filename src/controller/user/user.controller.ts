import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {of} from "rxjs";
import {CreateUserDto} from "../../dto/create-user.dto";
import {ModifyUserDto} from "../../dto/modify-user.dto";

@Controller('user')
export class UserController {
    @Get()
    findAll() {
        return of('all user')
    }

    @Post()
    createOne(@Body() createUserDto: CreateUserDto) {
        return of(createUserDto)
    }

    @Put(':id')
    modifyOne(@Param('id') id: string, @Body() modifyUserDto: ModifyUserDto) {
        return of({
            id,
            modifyUserDto
        })
    }

    @Delete(':id')
    deleteOneById(@Param('id') id: string) {
        return of(id)
    }

}
