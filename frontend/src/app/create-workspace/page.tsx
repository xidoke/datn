import CreateWorkspaceForm from "@/components/workspaces/create-workspace-form";

export default function CreateWorkspacePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your workspace
          </h1>
        </div>
        <CreateWorkspaceForm />
      </div>
    </div>
  );
}
