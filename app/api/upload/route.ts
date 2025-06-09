import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { file } = data

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: 'blog-images',
      resource_type: 'auto',
    })

    return NextResponse.json({ 
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      message: 'File uploaded successfully' 
    })

  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('public_id')

    if (!publicId) {
      return NextResponse.json({ error: 'No public_id provided' }, { status: 400 })
    }

    await cloudinary.uploader.destroy(publicId)
    
    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}