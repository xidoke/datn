import { TeamMembers } from "./team-members";

export default function TeamPage({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Team Members
          </h1>
          <p className="text-muted-foreground">
            Click on a member to view their work.
          </p>
        </div>
      </div>
      <TeamMembers workspaceSlug={params.workspaceSlug} />
    </div>
  );
}
