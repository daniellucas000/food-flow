import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { StoreService } from '../store/store.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.user({ email: email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      type: 'user',
      role: user.role,
      storeId: user.storeId,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async registerStore(
    storeData: {
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
    },
    ownerData: { name: string; email: string; password: string },
  ): Promise<{ access_token: string }> {
    const existingStore = await this.storeService.store({
      slug: storeData.slug,
    });

    if (existingStore) {
      throw new ConflictException('Slug already in use');
    }

    const existingUser = await this.userService.user({
      email: ownerData.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHashed = await bcrypt.hash(ownerData.password, 10);

    const { store, user } = await this.prisma.$transaction(async (tx) => {
      const store = await tx.store.create({ data: storeData });

      const user = await tx.user.create({
        data: {
          name: ownerData.name,
          email: ownerData.email,
          password: passwordHashed,
          role: 'OWNER',
          store: { connect: { id: store.id } },
        },
      });

      return { store, user };
    });

    const payload = {
      sub: user.id,
      type: 'user',
      role: user.role,
      storeId: store.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async createStaff(
    ownerStoreId: string,
    staffData: { name: string; email: string; password: string },
  ): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userService.user({
      email: staffData.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(staffData.password, 10);

    const staff = await this.userService.createStaff({
      name: staffData.name,
      email: staffData.email,
      password: hashedPassword,
      storeId: ownerStoreId,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = staff;
    return result;
  }
}
