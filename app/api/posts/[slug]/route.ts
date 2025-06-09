import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface GetRequest {
    url: string;
}

interface ErrorResponse {
    error: string;
}

export const GET = async (req: GetRequest, { params }: { params: { slug: string } }): Promise<ReturnType<typeof NextResponse.json>> => {
    const { slug } = params;
    try {
        const post = await prisma.post.findUnique({ where: { slug }, include: { user: true } })

        return NextResponse.json({ post }, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json<ErrorResponse>(
            { error: "Something went wrong!" },
            { status: 500 }
        );
    }
}