import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided in request.' },
        { status: 400 }
      );
    }

    const fileName = file.name || 'upload.jpg';
    const fileType = file.type || '';

    const isAudio = fileType.startsWith('audio/') || /\.(webm|wav|mp3|m4a|ogg|aac)$/i.test(fileName);
    const isImage = fileType.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp|heic|jfif|svg)$/i.test(fileName) || !fileType;

    if (!isAudio && !isImage) {
      return NextResponse.json(
        { success: false, error: 'Only image or audio files are permitted.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const subDir = isAudio ? 'audio' : 'photos';
    const extParts = fileName.split('.');
    const ext = extParts.length > 1 ? extParts.pop() : (isAudio ? 'webm' : 'jpg');
    const filename = `${isAudio ? 'voice' : 'img'}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${subDir}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      data: {
        url: publicUrl,
        filename,
        size: file.size,
        type: fileType
      }
    });
  } catch (err: any) {
    console.error('File upload API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'File upload failed.' },
      { status: 500 }
    );
  }
}
