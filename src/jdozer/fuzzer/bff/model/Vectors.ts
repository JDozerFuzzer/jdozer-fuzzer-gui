import { Inject, Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../storage/RedisService";
import { UUID } from "crypto";
import { KeyManager } from "../storage/KeyManager";


@Injectable()
export class Vectors {

    private readonly log: Logger = new Logger(Vectors.name);

    @Inject()
    private readonly redisService: RedisService;
    private readonly keyManager: KeyManager = new KeyManager();

    constructor() { }

    public async getSummary(fuzzerId: UUID) {
        try {

            const vCounts = await this.getCounts(fuzzerId);
            const summary: {
                operationId: string,
                id: number,
                description: string,
                owaspCategory: string,
                subcategory: string,
                context: string,
                tags: string,
                technique: string,
                browserSpecific: string
            }[] = [];
            for (const vc of vCounts) {
                const vId = Object.keys(vc.vectors);
                for (const v of vId) {
                    const vector: any = await this.redisService.get(`JDF:VEC:${v}`);
                    summary.push({
                        operationId: vc.operationId,
                        id: vector.id,
                        description: vector.description,
                        owaspCategory: vector.owasp_category,
                        subcategory: vector.subcategory,
                        context: vector.context,
                        tags: vector.tags,
                        technique: vector.technique,
                        browserSpecific: vector.browser_specific
                    });
                }
            }

            return summary;

        } catch (e) {
            const err = `An error occurred while trying to obtain the summary.`;
            this.log.error(err, e.message);
            throw e;
        }
    }

    public async getByStatusCode(fuzzerId: UUID) {
        try {
            const vStatusCodeCounts: any[] = [];
            const counts: any = await this.getCounts(fuzzerId);
            for (const c of counts) {
                const vId = Object.keys(c.vectors);
                for (const v of vId) {
                    const vector: any = await this.getVector(parseInt(v));
                    const vForStatusCode: any = {
                        operationId: c.operationId,
                        id: vector.id,
                        description: vector.description,
                        owaspCategory: vector.owasp_category,
                        subcategory: vector.subcategory,
                        context: vector.context,
                        tags: vector.tags,
                        technique: vector.technique,
                        browserSpecific: vector.browser_specific,
                        statusCodes: {}
                    };
                    for (const rId of c.vectors[v].requestIds) {
                        const rKey: any = await this.redisService.getKeys(`JDF:${fuzzerId}:FZZ:*:*:${rId}`);
                        const stsCode = rKey[0].split(":")[4];
                        if (!vForStatusCode.statusCodes[stsCode]) {
                            vForStatusCode.statusCodes[stsCode] = {
                                count: 0,
                                requests: []
                            };
                        }
                        vForStatusCode.statusCodes[stsCode].count++;
                        vForStatusCode.statusCodes[stsCode].requests.push(rId);
                    }
                    vStatusCodeCounts.push(vForStatusCode);
                }
                return vStatusCodeCounts;
            }
        } catch (e) {
            const err = `An error occurred while trying to obtain the vectors for status code.`;
            this.log.error(err, e.message);
            throw e;
        }
    }

    private async getVector(id: number): Promise<any> {
        try {
            const vector: any = await this.redisService.get(`JDF:VEC:${id}`);
            return vector;
        } catch (e) {
            const err = `An error occurred while trying to obtain the vector.`;
            this.log.error(err, e.message);
            throw e;
        }
    }

    private async getCounts(fuzzerId: UUID): Promise<any> {
        try {
            const vCounts: any = await this.redisService.get(this.keyManager.forFuzz(fuzzerId).concat(`:VEC:COUNT`));
            return vCounts;
        } catch (e) {
            const err = `An error occurred while trying to obtain the counts.`;
            this.log.error(err, e.message);
            throw e;
        }
    }


}
