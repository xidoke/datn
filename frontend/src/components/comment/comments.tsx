"use client";

import { useCommentStore } from "@/stores/commentStore";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CommentsProps {
  issueId: string;
  projectId: string;
  workspaceSlug: string;
}

export default function Comments({
  issueId,
  projectId,
  workspaceSlug,
}: CommentsProps) {
  const {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment,
  } = useCommentStore();
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments(workspaceSlug, projectId, issueId);
  }, [fetchComments, workspaceSlug, projectId, issueId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addComment(workspaceSlug, projectId, issueId, newComment);
    setNewComment("");
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment(workspaceSlug, projectId, issueId, commentId);
  };

  if (isLoading) return <div className="p-4">Loading comments...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Comments</h3>
        <span className="text-sm text-muted-foreground">
          {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </span>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="relative">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.user.avatarUrl} />
                      <AvatarFallback>
                        {comment.user.firstName?.[0]}
                        {comment.user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {comment.user.firstName} {comment.user.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this comment? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(comment.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[100px] resize-none pr-12"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute bottom-4 right-4"
          disabled={!newComment.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
