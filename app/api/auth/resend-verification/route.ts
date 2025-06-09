import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendVerificationMail, generateVerificationCode } from '@/helpers/sendVerficationMail'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Invalidate any existing unused codes
    await prisma.verificationCode.updateMany({
      where: {
        userId,
        type: 'EMAIL_VERIFICATION',
        used: false
      },
      data: { used: true }
    })

    // Generate new verification code
    const verificationCode = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    try {
      const saved = await prisma.verificationCode.create({
        data: {
          userId, // as string
          code: verificationCode,
          type: 'EMAIL_VERIFICATION',
          expires: expiresAt,
        }
      })

      console.log("Verification code saved:", saved)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to save verification code:", err.message)
      } else {
        console.error("Failed to save verification code:", err)
      }
    }


    // Send verification email
    const emailResult = await sendVerificationMail(user.email, user.name, verificationCode)

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Verification code sent successfully'
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}