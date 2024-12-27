import { CognitoIdentityProviderServiceException } from "@aws-sdk/client-cognito-identity-provider";
import { HttpException, HttpStatus } from "@nestjs/common";

export class CognitoServiceException extends HttpException {
  constructor(cognitoError: CognitoIdentityProviderServiceException) {
    // Truyền message từ cognitoError
    const message =
      cognitoError.message || "An error occurred with Cognito service";

    // Lấy mã trạng thái HTTP từ cognitoError nếu có, nếu không thì đặt mặc định là 500
    const statusCode =
      cognitoError.$metadata?.httpStatusCode ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    // Gọi constructor của HttpException với message và statusCode
    super(message, statusCode);

    // Thiết lập tên lỗi dựa trên cognitoError
    this.name = cognitoError.name;
  }
}
