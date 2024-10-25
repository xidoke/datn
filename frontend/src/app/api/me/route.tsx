// app/api/me/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Dữ liệu currentUser mẫu (thay thế bằng dữ liệu thật từ backend)
  const currentUser = {
    id: '1',
    avatar: 'https://github.com/shadcn.png',
    display_name: 'Xidoke',
    email: 'user@example.com',
    first_name: 'John',
    last_name: 'Doe',
    last_workspace_id: '1',
    username: 'user123',
    // ... other attributes
  };

  return NextResponse.json(currentUser);
}
