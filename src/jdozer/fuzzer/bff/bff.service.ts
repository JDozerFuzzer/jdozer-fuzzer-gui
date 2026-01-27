import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { UUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { CreateFuzzerDto } from './dto/create-fuzzer.dto';
import * as FormData from 'form-data';
import { Readable } from 'stream';
import { BffException } from './bff.exception';
import { AxiosError } from 'axios';

/**
 * @deprecated
 */
@Injectable()
export class BffService {

    private readonly log: Logger = new Logger(BffService.name);

    constructor(private readonly httpService: HttpService) { }

    async getFuzzers(owner: UUID) {
        return await firstValueFrom(this.httpService.get(`${process.env.FUZZER_BACKEND_URL}/fuzzer/owner/${owner.toString()}`))
            .then(res => res.data)
            .catch(error => {
                console.warn('Failed to fetch fuzzers', error.response.data);
                throw new BffException(error.response.data, error.response.status);
            });
    }

    async getStatusCodeByFuzzer(fuzzerId: UUID) {
        const resp = await firstValueFrom(this.httpService.get(`${process.env.FUZZER_BACKEND_URL}/fuzzing/${fuzzerId}`));
        return resp.data;
    }

    async getStatusCodeResponseByOperation(fuzzerId: UUID, operation: string, statusCode: number) {
        const resp = await firstValueFrom(this.httpService.get(`${process.env.FUZZER_BACKEND_URL}/fuzzing/${fuzzerId}/${operation}/${statusCode}`));
        return resp.data;
    }

    async getFuzzingDetails(fuzzerId: UUID, requestId: UUID) {
        const resp = await firstValueFrom(this.httpService.get(`${process.env.FUZZER_BACKEND_URL}/fuzzer/${fuzzerId}/request/${requestId}/details`));
        return resp.data;
    }

    async createFuzzer(createFuzzerDto: CreateFuzzerDto, file: Express.Multer.File): Promise<any> {

        const formData = new FormData();
        formData.append('name', createFuzzerDto.name);
        formData.append('version', createFuzzerDto.version);
        formData.append('contract', Readable.from(file.buffer), { filename: file.originalname });

        this.log.verbose(`Endpoint: ${process.env.FUZZER_SEEDER_HOST}, Port: ${process.env.FUZZER_SEEDER_PORT}`);

        return await firstValueFrom(this.httpService.post(`http://${process.env.FUZZER_SEEDER_HOST}:${process.env.FUZZER_SEEDER_PORT}/fuzzer`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        })).then(respCore => {
            this.log.verbose('Fuzzer created successfully, starting engine and hacking processes');
            return respCore.data;
        }).catch((error: AxiosError) => {
            this.log.error(error.message, error.stack);
            throw new BffException({
                message: error.response.data ? (error.response.data as any).message : error.message,
                cause: error.response.data.toString()
            }, error.response.status || 500);
        });
    }

    /**
    private async startHacking(fuzzerId: UUID) {
        await firstValueFrom(this.httpService.post(`${process.env.FUZZER_HACKING_URL}/jdozer-fuzzer/hacking/${fuzzerId}`))
            .catch(error => new Error(`Failed to start fuzzer hacking: ${error.message}`));
    }

    private async startFuzzer(fuzzerId: UUID, owner: UUID) {
        await firstValueFrom(this.httpService.post(`${process.env.FUZZER_ENGINE_URL}/jdozer/fuzzer/engine/${fuzzerId}/${owner}`))
            .catch(error => new Error(`Failed to start fuzzer engine: ${error.message}`));
    }
    */

}