"use client"
import React from "react";
import useAttachmentStore from "../_store/attachmentStore";

const AttachmentUpload = ({ issueId }: { issueId: string }) => {
  const { addAttachment } = useAttachmentStore();

  return <input type="file" />;
};

export default AttachmentUpload;
