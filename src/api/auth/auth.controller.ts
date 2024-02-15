import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { VerifyBody } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('verify')
  @ApiOperation({ summary: 'Verify' })
  verify(@Body() body: VerifyBody) {
    return this.service.verify(body);
  }
}
