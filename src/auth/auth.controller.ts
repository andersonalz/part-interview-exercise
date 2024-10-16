import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @Post('sign_in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  signIn(@Body() _authDto: AuthDto, @CurrentUser() user) {
    return this.authService.signIn(_authDto);
  }
   
  @UseGuards(JwtAuthGuard)
  @Post('sign_up')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }
}
