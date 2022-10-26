import { Get, Controller } from '@nestjs/common'


@Controller()
export class AppController{
    @Get("/")
    test(){
        return '테스트 중입니다. 3번'
    }
}