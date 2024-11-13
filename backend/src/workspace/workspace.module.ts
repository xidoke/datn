import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService, UserService],
})
export class WorkspaceModule {}
