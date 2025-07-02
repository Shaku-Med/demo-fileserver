import { StreamError } from "../ErrorMessage/StreamError";

export async function GET(request: Request) {
    try {
        return StreamError(`Nothing to see here.`, 404)
    }
    catch {
        return StreamError(`Failed to get GitHub keys`, 500)
    }
}