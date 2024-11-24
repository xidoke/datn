import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIssueStore, Issue } from "@/stores/issue/issueStore";
import { useProjectStateStore } from "@/stores/projectStateStore";
import { useProjectLabelStore } from "@/stores/projectLabelStore";

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue?: Issue;
}

export function IssueModal({ isOpen, onClose, issue }: IssueModalProps) {
  const { addIssue, updateIssue } = useIssueStore();
  const { states } = useProjectStateStore();
  const { labels } = useProjectLabelStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stateId, setStateId] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
      setStateId(issue.state.id);
      setSelectedLabels(issue.labels.map((label) => label.id));
      setPriority(issue.priority);
    } else {
      setTitle("");
      setDescription("");
      setStateId(states[0]?.id || "");
      setSelectedLabels([]);
      setPriority("medium");
    }
  }, [issue, states]);

  const handleSubmit = async () => {
    const issueData = {
      title,
      description,
      state: states.find((s) => s.id === stateId)!,
      labels: labels.filter((l) => selectedLabels.includes(l.id)),
      priority,
    };

    if (issue) {
      await updateIssue(issue.id, issueData);
    } else {
      await addIssue(issueData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{issue ? "Edit Issue" : "Create New Issue"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Issue Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select value={stateId} onValueChange={setStateId}>
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.id} value={state.id}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priority}
            onValueChange={(value: any) => setPriority(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          <div>
            <h3 className="mb-2">Labels</h3>
            <div className="flex flex-wrap gap-2">
              {labels.map((label) => (
                <Button
                  key={label.id}
                  variant={
                    selectedLabels.includes(label.id) ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    setSelectedLabels((prev) =>
                      prev.includes(label.id)
                        ? prev.filter((id) => id !== label.id)
                        : [...prev, label.id],
                    );
                  }}
                >
                  {label.name}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit}>
            {issue ? "Update Issue" : "Create Issue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
