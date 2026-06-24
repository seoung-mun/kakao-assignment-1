import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {
  const todoId = (await params).todoId;
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) throw new Error('Failed to update todo in backend');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ todoId: string }> }
) {
  const todoId = (await params).todoId;
  try {
    const res = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) throw new Error('Failed to delete todo in backend');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
