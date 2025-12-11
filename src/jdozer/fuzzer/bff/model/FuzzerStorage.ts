import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../storage/RedisService";
import { KeyManager } from "../storage/KeyManager";
import { UUID } from "crypto";


@Injectable()
export class FuzzerStorage {

    private readonly log = new Logger(FuzzerStorage.name);
    private readonly keyManager: KeyManager = new KeyManager();

    constructor(private readonly redisService: RedisService) { }

    async getFuzzers(): Promise<string[]> {
        try {
            const keys: string[] = await this.redisService.getKeys('JDF:*:API');
            this.log.verbose(`Fuzzer keys found: ${keys.length}`);
            const fuzzrs: any[] = [];
            for (let key of keys) {
                this.log.verbose(`Getting fuzzer for key: ${key}`);
                this.log.verbose(`Fuzzer ID: ${this.keyManager.getUUIDForFuzz(key)}`);
                fuzzrs.push(await this.redisService.getFuzzer(this.keyManager.getUUIDForFuzz(key)));
            }
            return fuzzrs;
        } catch (e) {
            const err = `Error getting fuzzers: ${e.message}`;
            this.log.error(err);
            throw new Error(err);
        }
    }

    async getCantStatusCode(fuzzerId: UUID) {
        try {
            const scc: any[] = await this.redisService.get(this.keyManager.getSCC(fuzzerId));
            return scc;
        } catch (e) {
            const err = `An error occurred while trying to obtain the number of status codes.`;
            this.log.error(err, e.message);
            throw e;
        }
    }

    async OperationAndStatusCode(fuzzerId: UUID, operationId: string, statusCode: number) {
        try {
            const fzz: any[] = await this.redisService.getKeys(this.keyManager.forFuzz(fuzzerId).concat(':FZZ:', operationId, ':', statusCode.toString(), ':*'));
            const responses: any[] = [];
            for (let key of fzz) {
                let resp = await this.redisService.get(key);
                responses.push({
                    operationId: resp.request.operationId,
                    mutations: {
                        payload: resp.request.mutations.payload.valid,
                        headers: resp.request.mutations.headers.valid,
                        query: resp.request.mutations.queryParams.valid,
                        path: resp.request.mutations.pathParams.valid,
                        isValid: resp.request.mutations.isValid
                    },
                    response: {
                        statusCode: resp.response.statusCode,
                        statusMessage: resp.response.statusMessage,
                        time: resp.response.time,
                        audit: {
                            payload: {
                                isValid: resp.response.audit.payload.isValid,
                            }
                        }
                    }
                });
            }
        } catch(e) {}
    }

    async getFzzKeys(fuzzerId: UUID): Promise<string[]> {
        try {
            const fzzKeys: string[] = await this.redisService.getKeys(this.keyManager.forFuzz(fuzzerId).concat(`:FZZ:*`));
            return fzzKeys;
        } catch (e) {
            const err = `An error occurred while trying to obtain the test keys for the fuzzer: ${fuzzerId}`;
            this.log.error(err, e.message);
            throw e;
        }
    }

}