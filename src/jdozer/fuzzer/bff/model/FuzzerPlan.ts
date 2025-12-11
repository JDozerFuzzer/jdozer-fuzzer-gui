import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../storage/RedisService";
import { UUID } from "crypto";
import { KeyManager } from "../storage/KeyManager";

@Injectable()
export class FuzzerPlan {

    private readonly log: Logger = new Logger(FuzzerPlan.name);
    private readonly keyManager: KeyManager = new KeyManager();

    private fuzzer: any = null;
    private dmmKeys: string[] = [];

    constructor(
        private readonly redisService: RedisService
    ) { }

    async getPlan(fuzzerId: UUID): Promise<any> {
        try {
            await this.getFuzzer(fuzzerId);
            await this.getCasesCant(fuzzerId);
            let op = this.getCasesForOperation();
            return op;
        } catch(e) {
            const err = `Error getting fuzzer plan for fuzzer ${fuzzerId}: ${e.message}`;
            this.log.error(err);
            throw new Error(err);
        }
    }

    async getCasesCant(fuzzerId: UUID): Promise<any> {
        try {
            this.dmmKeys = await this.redisService.getDummyCasesKeys(fuzzerId);
            return this.dmmKeys.length;
        } catch (e) {
            const err = `Error getting dummy cases count for fuzzer ${fuzzerId}: ${e.message}`;
            this.log.error(err);
            throw new Error(err);
        }
    }

    async getCasesForOperation(): Promise<any> {
        try {
            let op: any[] = [];
            this.fuzzer.operationIds.forEach((opId: string) => {
                this.log.verbose(`Getting DMM cases for operation: ${opId}`);
                op.push({
                    name: opId,
                    cant: this.dmmKeys.filter((key: string) => key.includes(`:DMM:${opId}:`)).length
                });
            });
            return op;
        } catch (e) {
            const err = `Error getting dummy cases for operations: ${e.message}`;
            this.log.error(err);
            throw new Error(err);
        }
    }

    private async getFuzzer(fuzzerId: UUID): Promise<any> {
        try {
            this.fuzzer = await this.redisService.getFuzzer(fuzzerId);
        } catch (e) {
            const err = `Error getting fuzzer ${fuzzerId}: ${e.message}`;
            this.log.error(err);
            throw new Error(err);
        }
    }

    private async getCasesSummary(fuzzerId: UUID): Promise<any> {
        try {
            let summary: any[] = [];
            let fzzKeys: string[] = await this.redisService.getKeys(`JDF:${fuzzerId}:FZZ:*`);
            this.log.verbose(`Fuzzer FZZ keys found: ${fzzKeys.length}`);
            let fzz: any = null;
            fzzKeys.forEach(async (key: string) => {
                fzz = await this.redisService.get(key);
                summary.push({
                    reqIsValid: fzz.request.mutations.isValid
                });
            });
        } catch(e) {}
    }

    /**
     * Small functions
     */
    private async requestIsValidCase(request: any) {
        try {

        } catch(e) {}
    }

}