"use client"
import React from "react";
import useAttachmentStore from "../_store/attachmentStore";

const AttachmentList = ({ issueId }: { issueId: string }) => {
  const { attachments, isLoading, error, fetchAttachments, removeAttachment } =
    useAttachmentStore();

  React.useEffect(() => {
    fetchAttachments(issueId);
  }, [issueId, fetchAttachments]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {attachments.map((attachment) => (
        <div key={attachment.id}>
          <a href={attachment.url} target="_blank" rel="noopener noreferrer">
            {attachment.fileName}
          </a>
          <button onClick={() => removeAttachment(attachment.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentList;
