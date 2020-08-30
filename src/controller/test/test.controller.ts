import {Controller, Delete, Get, Post, Put} from '@nestjs/common';

@Controller('test')
export class TestController {
    @Get()
    get() {
        return 'test get'
    }
    @Post()
    post() {
        return 'test post'
    }
    @Put()
    put() {
        return 'test put'
    }

    @Delete()
    delete() {
        return 'test delete'
    }
}
