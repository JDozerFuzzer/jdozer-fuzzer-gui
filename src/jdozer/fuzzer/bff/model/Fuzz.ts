import { Injectable, Logger } from "@nestjs/common";
import { KeyManager } from "../storage/KeyManager";
import { RedisService } from "../storage/RedisService";
import { UUID } from "crypto";

@Injectable()
export class Fuzz {

    private readonly log: Logger = new Logger(Fuzz.name);
    private readonly keyManager: KeyManager = new KeyManager();


    constructor(private readonly redisService: RedisService) { }

    async getDetail(fuzzerId: UUID, requestId: UUID) {
        try {
            const key: string[] = await this.redisService.getKeys(this.keyManager.forFuzz(fuzzerId).concat(`:FZZ:*:*:${requestId}`));
            if (key.length !== 1) {
                throw new Error(`The fuzzing data for the request ${requestId} was not found.`);
            }
            const fuzz: any = await this.redisService.get(key[0]);
            return fuzz;
        } catch (e) {
            const err = `An error occurred while retrieving the fuzzing data.`;
            this.log.error(err, e.message);
            throw new Error(err);
        }
    }
}