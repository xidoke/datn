import { Module } from "@nestjs/common";
import { IssuesController } from "./issue.controller";
import { IssuesService } from "./issue.service";

@Module({
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssueModule {}
