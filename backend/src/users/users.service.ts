import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { username, email, password, fullname } = createUserDto;

    // 1. Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existingUser) {
      throw new Error('Username or email already exists'); // Hoặc sử dụng custom exception
    }

    // 2. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạo user mới trong database bằng Prisma
    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullname,
      },
    });

    // 4. Trả về user object (có thể loại bỏ trường password)
    const { password: _password, ...user } = newUser;
    return user;
  }
}
