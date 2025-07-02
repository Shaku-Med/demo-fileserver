import { NextRequest, NextResponse } from "next/server"
import { StreamError } from "../../ErrorMessage/StreamError"

export async function GET(request: NextRequest) {
   return StreamError(`This route's not available for use.`, 404)
}