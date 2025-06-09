import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const categories = await prisma.category.findMany();
        
        return NextResponse.json(categories, { status: 200 });
    }catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Something went wrong!" },
            { status: 500 }
        );
    }
}