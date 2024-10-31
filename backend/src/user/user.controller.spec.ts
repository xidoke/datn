import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CognitoService } from './cognito.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockCognitoService = {
    createUser: jest.fn(),
    authenticateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CognitoService,
          useValue: mockCognitoService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const expectedResult = {
        id: '123',
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      };

      mockUserService.create.mockResolvedValue(expectedResult);

      const result = await controller.signup(createUserDto);
      expect(result).toEqual(expectedResult);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const user = {
        id: '123',
        email: 'test@example.com',
      };

      const req = { user };
      mockUserService.findById.mockResolvedValue(user);

      const result = await controller.getCurrentUser(req);
      expect(result).toEqual(user);
      expect(userService.findById).toHaveBeenCalledWith(user.id);
    });
  });
});
