import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationMail, generateVerificationCode } from '@/helpers/sendVerficationMail'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json(
          { error: 'User already exists and is verified. Please sign in.' },
          { status: 400 }
        )
      }

      // User exists but not verified - resend verification

      // Invalidate any existing unused codes for this user
      await prisma.verificationCode.updateMany({
        where: {
          userId: existingUser.id,
          type: 'EMAIL_VERIFICATION',
          used: false
        },
        data: { used: true }
      })

      const verificationCode = generateVerificationCode()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Save new verification code
      await prisma.verificationCode.create({
        data: {
          userId: existingUser.id,
          code: verificationCode,
          type: 'EMAIL_VERIFICATION',
          expires: expiresAt,
          used: false
        }
      })

      await sendVerificationMail(existingUser.email, existingUser.name, verificationCode)

      return NextResponse.json({
        message: 'Account exists but not verified. New verification code sent to your email.',
        requiresVerification: true,
        userId: existingUser.id
      }, { status: 200 })
    }

    // Hash password for new user
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null // Not verified yet
      }
    })

    // Invalidate any existing unused codes (unlikely for new user but safe)
    await prisma.verificationCode.updateMany({
      where: {
        userId: user.id,
        type: 'EMAIL_VERIFICATION',
        used: false
      },
      data: { used: true }
    })

    const verificationCode = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save verification code in DB
    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code: verificationCode,
        type: 'EMAIL_VERIFICATION',
        expires: expiresAt,
        used: false
      }
    })

    await sendVerificationMail(email, name, verificationCode)

    return NextResponse.json({
      message: 'Registration successful! Please check your email for verification code.',
      requiresVerification: true,
      userId: user.id
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
