import { StreamError } from "./ErrorMessage/StreamError";

export async function GET(){
    let errorMessage = StreamError(`Looks like you are lost. There is nothing here.`, 404)
    return errorMessage
}