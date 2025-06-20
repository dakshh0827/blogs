import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ErrorResponse {
  error: string;
}

export const GET = async (req: Request): Promise<ReturnType<typeof NextResponse.json>> => {
  try {
    // req.url is a full URL string
    const { searchParams } = new URL(req.url);
    const postSlug = searchParams.get("postSlug");

    const comments = await prisma.comment.findMany({
      where: { ...(postSlug && { postSlug }) },
      include: { user: true },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json<ErrorResponse>({ error: "Something went wrong!" }, { status: 500 });
  }
};

export const POST = async (req: Request): Promise<ReturnType<typeof NextResponse.json>> => {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json<ErrorResponse>({ error: "Not Authenticated" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const comment = await prisma.comment.create({ data: { ...body, userEmail: session.user.email } });

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json<ErrorResponse>({ error: "Something went wrong!" }, { status: 500 });
  }
};
