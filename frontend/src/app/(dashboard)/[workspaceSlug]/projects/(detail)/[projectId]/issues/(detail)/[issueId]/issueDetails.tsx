"use client";

import { useState, useEffect } from "react";
import { IssueService } from "@/services/issue.service";

interface Issue {
  id: string;
  title: string;
  description: string;
  // ... other issue properties
}

export default function IssueDetail({ id }: { id: string }) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <div>Loading issue...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!issue) return <div>Issue not found</div>;

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">{issue.title}</h1>
      <p className="mb-6">{issue.description}</p>
      {/* Add other issue details here */}
    </div>
  );
}
