import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import type { JwtPayload } from './types/jwt-payload.type';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('signin')
  signIn(@Body() body: { email: string; password: string }) {
    return this.authService.signIn(body.email, body.password);
  }

  @HttpCode(201)
  @Post('store-signup')
  registerStore(
    @Body()
    body: {
      store: {
        name: string;
        slug: string;
        phone: string;
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
        openingHours: object;
      };
      owner: { name: string; email: string; password: string };
    },
  ) {
    return this.authService.registerStore(body.store, body.owner);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: JwtPayload) {
    return user;
  }
}
