import { Inject, Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../storage/RedisService";
import { KeyManager } from "../storage/KeyManager";
import { UUID } from "crypto";

@Injectable()
export class Mutations {

    private readonly log: Logger = new Logger(Mutations.name);

    @Inject()
    private readonly redisService: RedisService;
    private readonly keyManager: KeyManager = new KeyManager();

    constructor() { }

    public async getMutationsByStatusCodeAndMethod(fuzzerId: UUID, operationId: string, method: string, statusCode: number) {
        try {
            const mutations: any[] = [];
            const keys: string[] = await this.redisService.getKeys(this.keyManager.forFuzz(fuzzerId).concat(`:FZZ:${operationId}:${statusCode}:*`));
            for (const key of keys) {
                const fzz: any = await this.redisService.get(key);
                if (fzz.request.method.toUpperCase() === method.toUpperCase()) {
                    mutations.push({
                        isValid: fzz.request.mutations.isValid,
                        requestId: fzz.request.uuid,
                        operationId: fzz.request.operationId,
                        statusCodeIsValid: fzz.response.audit.isValid,
                        responsePayloadIsValid: fzz.response.audit.payload.isValid
                    });
                }
            }
            return mutations;
        } catch (e) {
            const err = `An error occurred while trying to get mutations by status code and method.`;
            this.log.error(err, e.message);
            throw new Error(err);
        }
    }


}   