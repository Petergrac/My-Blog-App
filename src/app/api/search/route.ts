import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const {searchParams} = new URL(request.url);
    const query = searchParams.get('q') || '';

    if(!query.trim()){
        return NextResponse.json([]);
    }
    const posts  = await prisma.post.findMany({
            where:{
                OR:[
                    {title: {contains: query,mode:'insensitive'}},
                    {description: {contains: query,mode:'insensitive'}},
                    {category: {contains: query,mode:'insensitive'}},
                    {content: {contains: query,mode:'insensitive'}}
                ],
                state:"PUBLISHED"
            },
            select:{
                id: true,
                title: true,
            },
            take: 5,
            orderBy:{
                createdAt: 'desc'
            }
    });
    return NextResponse.json(posts);
}