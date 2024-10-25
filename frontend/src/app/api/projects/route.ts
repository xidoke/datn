import { NextResponse } from 'next/server';

export async function GET() {
  // Dữ liệu Project mẫu (thay thế bằng dữ liệu thật từ backend)
  const projects = [
    {
      id: '1',
      name: 'Project A',
      workspaceId: '1',
    },
    {
      id: '2',
      name: 'Project B',
      workspaceId: '2'
    },
  ];

  return NextResponse.json(projects);
}
