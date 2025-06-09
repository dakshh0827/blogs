import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ErrorResponse {
    error: string;
}

export const GET = async (req: Request): Promise<ReturnType<typeof NextResponse.json>> => {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const cate = searchParams.get("cate") || "";
    const postsPerPage = 4;
    
    try {
        const [posts, count] = await prisma.$transaction([
            prisma.post.findMany({
                take: postsPerPage, 
                skip: (parseInt(page) - 1) * postsPerPage, 
                where: {...(cate && {catSlug: cate})}
            }),
            prisma.post.count({where: {...(cate && {catSlug: cate})}})
        ]);

        return NextResponse.json({ posts, count }, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json<ErrorResponse>(
            { error: "Something went wrong!" },
            { status: 500 }
        );
    }
}

export const POST = async (req: Request): Promise<ReturnType<typeof NextResponse.json>> => {
    const session = await getAuthSession();
    if(!session?.user) {
        return NextResponse.json<ErrorResponse>(
            { error: "Not Authenticated" },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();
        
        // Validate required fields
        if (!body.title || !body.slug || !body.desc || !body.catSlug) {
            return NextResponse.json<ErrorResponse>(
                { error: "Missing required fields: title, slug, desc, and catSlug are required" },
                { status: 400 }
            );
        }

        // Check if a post with the same slug already exists
        const existingPost = await prisma.post.findUnique({
            where: { slug: body.slug }
        });

        if (existingPost) {
            // Generate a unique slug by appending a timestamp
            const timestamp = Date.now();
            body.slug = `${body.slug}-${timestamp}`;
        }
        console.log("Creating post with slug:", body.catSlug);
        // Check if the category exists, if not create it
        let category = await prisma.category.findUnique({
            where: { slug: body.catSlug }
        });

        if (!category) {
            // Create the category if it doesn't exist
            // Extract category title from catSlug (convert slug back to title)
            const categoryTitle: string = body.catSlug
                .split('-')
                .map((word: string): string => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            category = await prisma.category.create({
                data: {
                    slug: body.catSlug,
                    title: categoryTitle,
                    img: null,
                }
            });
        }

        // Create the post
        const post = await prisma.post.create({ 
            data: { 
                title: body.title,
                slug: body.slug,
                desc: body.desc,
                catSlug: body.catSlug,
                img: body.img,
                userEmail: session.user.email!
            },
            include: {
                cat: true,
                user: true
            }
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error("Error creating post:", error);
        
        // Handle Prisma errors
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return NextResponse.json<ErrorResponse>(
                    { error: "A post with this slug already exists" },
                    { status: 409 }
                );
            }
            if (error.message.includes('Foreign key constraint')) {
                return NextResponse.json<ErrorResponse>(
                    { error: "Invalid category or user reference" },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json<ErrorResponse>(
            { error: "Something went wrong while creating the post!" },
            { status: 500 }
        );
    }
}