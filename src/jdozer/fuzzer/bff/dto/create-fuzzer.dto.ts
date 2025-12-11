import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class CreateFuzzerDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    version: string;

}
