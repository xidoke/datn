import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
;

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: string, issueId: string) {
    const { content } = createCommentDto;
    const issue = await this.prisma.issue.findUnique({ where: { id: issueId } });
    if (!issue) {
      throw new NotFoundException(`Issue with ID "${issueId}" not found`);
    }

    return this.prisma.issueComment.create({
      data: {
        content,
        issue: { connect: { id: issueId } },
        user: { connect: { id: userId } },
      },
      include: { user: true },
    });
  }

  findAllByIssue(issueId: string) {
    return this.prisma.issueComment.findMany({
      where: { issueId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.issueComment.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not authorized to delete this comment');
    }

    return this.prisma.issueComment.delete({ where: { id } });
  }

  async update(id: string, createCommentDto: CreateCommentDto, userId: string) {
    const { content } = createCommentDto;
    const comment = await this.prisma.issueComment.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException('You are not authorized to update this comment');
    }

    return this.prisma.issueComment.update({
      where: { id },
      data: { content },
      include: { user: true },
    });
  }
}

