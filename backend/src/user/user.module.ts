import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthController } from "./auth.controller";
import { CognitoService } from "./cognito.service";

@Module({
  controllers: [UserController, AuthController],
  providers: [UserService, CognitoService],
})
export class UserModule {}
