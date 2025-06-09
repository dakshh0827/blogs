import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ErrorResponse {
  error: string;
}

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<ReturnType<typeof NextResponse.json>> => {
  const { slug } = await params;
  
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { user: true },
    });

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json<ErrorResponse>({ error: "Something went wrong!" }, { status: 500 });
  }
};