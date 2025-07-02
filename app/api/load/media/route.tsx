import { NextRequest, NextResponse } from "next/server"
import { StreamError } from "../../ErrorMessage/StreamError"

export async function GET(request: NextRequest) {
   return StreamError(`This is not a media file.`, 400)
}