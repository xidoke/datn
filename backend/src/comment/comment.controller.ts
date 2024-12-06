import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { RequestWithUser } from 'src/user/interfaces/request.interface';
import { CognitoAuthGuard } from 'src/auth/guards/cognito.guard';


@UseGuards(CognitoAuthGuard)
@Controller('workspaces/:workspaceSlug/projects/:projectId/issues/:issueId/comments')
export class CommentController {
     constructor(private readonly commentsService: CommentService) {}

  @Post()
  create(
    @Param('issueId') issueId: string,
    @Body() createCommentDto: CreateCommentDto,@Req() req : RequestWithUser ) {
    return this.commentsService.create(createCommentDto, req.user.userId, issueId);
  }

  @Get()
  findAllByIssue(@Param('issueId') issueId: string) {
    return this.commentsService.findAllByIssue(issueId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req : RequestWithUser ) {
    return this.commentsService.remove(id, req.user.userId);
  }

  // update comment
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: CreateCommentDto, @Req() req : RequestWithUser) {
    return this.commentsService.update(id, updateCommentDto, req.user.userId);
  }
}
