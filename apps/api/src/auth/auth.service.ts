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
import { Customer, User } from '../generated/prisma/client';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly customerService: CustomerService,

    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userWithoutPassword,
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

  async signUpCustomer(
    slug: string,
    data: { name: string; phone: string; email: string; password: string },
  ): Promise<{ access_token: string; customer: Omit<Customer, 'password'> }> {
    const store = await this.storeService.store({ slug });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const existingEmail = await this.customerService.findByEmail(
      store.id,
      data.email,
    );
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    const existingPhone = await this.customerService.findByPhone(
      store.id,
      data.phone,
    );
    if (existingPhone) {
      throw new ConflictException('Phone already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const customer = await this.customerService.createCustomer({
      name: data.name,
      phone: data.phone,
      storeId: store.id,
      email: data.email,
      password: hashedPassword,
    });

    const payload = { sub: customer.id, type: 'customer', storeId: store.id };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...customerWithoutPassword } = customer;

    return {
      access_token: await this.jwtService.signAsync(payload),
      customer: customerWithoutPassword,
    };
  }

  async signInCustomer(
    storeId: string,
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const customer = await this.customerService.findByEmail(storeId, email);

    if (!customer || !customer.password) {
      throw new NotFoundException('Customer not found');
    }

    const passwordMatch = await bcrypt.compare(password, customer.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: customer.id, type: 'customer', storeId };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async continueAsGuest(
    storeId: string,
    data: { name: string; phone: string },
  ): Promise<{ access_token: string }> {
    let customer = await this.customerService.findByPhone(storeId, data.phone);

    if (!customer) {
      customer = await this.customerService.createCustomer({
        name: data.name,
        phone: data.phone,
        storeId,
      });
    }

    const payload = { sub: customer.id, type: 'customer', storeId };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
