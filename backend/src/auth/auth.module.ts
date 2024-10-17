import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AwsCognitoService } from './aws-cognito.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AwsCognitoService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
