import { Logger } from "@nestjs/common";
import { RedisService } from "../storage/RedisService";
import { KeyManager } from "../storage/KeyManager";


export class Responses {

    private readonly log: Logger = new Logger(Responses.name);
    private readonly redisService: RedisService;
    private readonly keyManager: KeyManager = new KeyManager();
    private readonly operationId: string;

    constructor(redisService: RedisService) {
        this.redisService = redisService;
    }

    async getByStatusCode(operationId: string, method: string, statusCode: number) {
        try {
            this.log.verbose(`Getting responses for status code ${statusCode} and operation ${operationId}.`);
            const keys: string[] = await this.redisService.getKeys(operationId.concat(`:${statusCode}:*`));
            const responses: any[] = [];
            for (const key of keys) {
                const resp: any = await this.redisService.get(key);
                if (resp.request.method.toUpperCase() !== method.toUpperCase()) {
                    continue;
                }
                responses.push({
                    id: resp.request.uuid,
                    statusCode: resp.response.statusCode,
                    method: resp.request.method,
                    statusMessage: resp.response.statusMessage,
                    totalTime: resp.response.timings.phases.total,
                    reqIsValid: resp.request.mutations.isValid,
                    payloadIsValid: resp.response.audit.payload.isValid,
                    payloadErrorMessage: resp.response.audit.payload.errors.map((e: any) => e.message).join(', '),
                    statusCodeIsValid: resp.response.audit.statusCode.isValid
                });
            }
            return responses;
        } catch (e) {
            const err = `An error occurred while trying to obtain the responses for status code ${statusCode}.`;
            this.log.error(err, e);
            throw new Error(err);
        }
    }

}