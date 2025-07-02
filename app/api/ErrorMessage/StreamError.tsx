import { NextResponse } from "next/server"

export const StreamError = (message: string | object, status: number) => {
    try {
        // Convert object to JSON string if needed
        const messageString = typeof message === 'object' ? JSON.stringify(message) : message
        
        let stream = new ReadableStream({
            async start(controller) {
                for (let i = 0; i < messageString.length; i++) {
                    controller.enqueue(new TextEncoder().encode(messageString[i]))
                    await new Promise(resolve => setTimeout(resolve, 50))
                }
                controller.close()
            }
        })
        return new NextResponse(stream, {
            status: status,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        })
    }
    catch {
        return new NextResponse(`Something went wrong on our end.`, {status: 500})
    }
}