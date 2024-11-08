import { Global, Module } from "@nestjs/common";
import { AuthController } from "src/auth/auth.controller";
import { CognitoService } from "./cognito.service";
import { AuthService } from "./auth.service";

@Global()
@Module({
  controllers: [AuthController],
  providers: [CognitoService, AuthService],
  exports: [CognitoService, AuthService], // Export the services
})
export class AuthModule {}
