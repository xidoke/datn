"use client";
import React from "react";
import AttachmentList from "./AttachmentList";
import AttachmentUpload from "./AttachmentUpload";

const IssueDetail = ({ issueId }) => {
  return (
    <div>
      {/* Other issue details */}
      <h3>Attachments</h3>
      <AttachmentList issueId={issueId} />
      <AttachmentUpload issueId={issueId} />
    </div>
  );
};

export default IssueDetail;
