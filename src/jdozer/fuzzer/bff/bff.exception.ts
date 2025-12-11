import { HttpException } from "@nestjs/common";


export class BffException extends HttpException {

    constructor(error: { message: string, cause?: string } = {
        message: "No exception provided!",
    }, statusCode: number) {
        super(error.message, statusCode, {
            cause: error.cause
        });
        console.warn(`${this.constructor.name}: ${error.message}\n\tCause: ${error.cause}`);
    }

}