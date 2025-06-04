import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
    console.log('Received file:', file);
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  console.log('uploading file:', file.name, 'size:', file.size);
  const blob = await put(file.name, file.stream(), {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  console.log('Blob URL:', blob.url);

  return NextResponse.json({ url: blob.url });
}
