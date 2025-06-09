import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json()

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find the verification code
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
        type: 'EMAIL_VERIFICATION',
        used: false,
        expires: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    })

    if (!verificationRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Update user as verified and mark code as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { 
          emailVerified: new Date() 
        }
      }),
      prisma.verificationCode.update({
        where: { id: verificationRecord.id },
        data: { used: true }
      })
    ])

    return NextResponse.json({
      message: 'Email verified successfully',
      verified: true
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}