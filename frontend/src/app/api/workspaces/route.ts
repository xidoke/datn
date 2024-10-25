import { NextResponse } from 'next/server';

export async function GET() {
  // Dữ liệu Workspace mẫu (thay thế bằng dữ liệu thật từ backend)
  const workspaces = [
    {
      id: '1',
      name: 'Workspace 1',
      logo: 'alarm-clock-plus',
    },
    {
      id: '2',
      name: 'Workspace 2',
      logo: 'settings',
    },
  ];

  return NextResponse.json(workspaces);
}
