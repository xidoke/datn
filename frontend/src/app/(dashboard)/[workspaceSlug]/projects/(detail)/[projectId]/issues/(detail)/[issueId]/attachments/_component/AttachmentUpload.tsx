"use client"
import React from "react";
import useAttachmentStore from "../_store/attachmentStore";

const AttachmentUpload = ({ issueId }) => {
  const { addAttachment } = useAttachmentStore();

  return (
      <input type="file"  />
  );
};

export default AttachmentUpload;
