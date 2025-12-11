import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class UploadException implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse<Response>();
        exception.response.success = false;
        res.status(exception.status).setHeader('Content-Type', 'text/html').json(exception.response);
    }
    
}