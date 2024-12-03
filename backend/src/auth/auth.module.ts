import { Global, Module } from "@nestjs/common";
import { AuthController } from "src/auth/auth.controller";
import { CognitoService } from "./cognito.service";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";
import { CacheModule } from "@nestjs/cache-manager";

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 1000, // cache for 1 minute
      max: 100, // maximum number of items in cache
    }),
  ],
  controllers: [AuthController],
  providers: [CognitoService, AuthService, TokenService],
  exports: [CognitoService, AuthService, TokenService, CacheModule], // Export the services
})
export class AuthModule {}
