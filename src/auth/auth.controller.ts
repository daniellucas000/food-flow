import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import type { JwtPayload } from './types/jwt-payload.type';
import { CurrentUser } from './decorators/current-user.decorator';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorators/roles.decorator';

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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('OWNER')
  @Post('staff')
  createStaff(
    @CurrentUser() user: JwtPayload,
    @Body() body: { name: string; email: string; password: string },
  ) {
    return this.authService.createStaff(user.storeId, body);
  }
}
