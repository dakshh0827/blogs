import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        Posts: true
                    }
                }
            }
        });
        
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error("Error fetching categories with counts:", error);
        return NextResponse.json(
            { error: "Something went wrong!" },
            { status: 500 }
        );
    }
}