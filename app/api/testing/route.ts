import { NextRequest } from "next/server"

export const GET = async (req:any) => {
    let params: any = {}
    for (const [key, val] of req.nextUrl.searchParams) { 
        params[key] = val 
    }
    console.log(params)
} 
