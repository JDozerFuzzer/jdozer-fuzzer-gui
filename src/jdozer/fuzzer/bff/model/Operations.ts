import { Inject, Injectable, Logger } from "@nestjs/common";
import { Responses } from "./Responses";
import { RedisService } from "../storage/RedisService";
import { KeyManager } from "../storage/KeyManager";
import { UUID } from "crypto";

@Injectable()
export class Operations {

    private readonly log: Logger = new Logger(Operations.name);
    private readonly responses: Responses;
    private readonly keyManager: KeyManager = new KeyManager();

    private readonly redisService: RedisService;

    constructor(redisService: RedisService) {
        this.redisService = redisService;
        this.responses = new Responses(this.redisService);
    }

    async getByStatusCode(fuzzerId: UUID, operationId: string, method: string, statusCode: number) {
        try {
            const op: string = this.keyManager.forFuzz(fuzzerId).concat(`:FZZ:${operationId}`);
            return await this.responses.getByStatusCode(op, method, statusCode);
        } catch (e) {
            const err = `An error occurred while trying to obtain the responses for status code ${statusCode}.`;
            this.log.error(err, e);
            throw new Error(err);
        }
    }



}