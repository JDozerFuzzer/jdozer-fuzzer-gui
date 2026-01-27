import { Body, Controller, Get, Post, UploadedFile, UseFilters, UseInterceptors, Response, HttpStatus, Param, Logger, Inject } from '@nestjs/common';
import { BffService } from './bff.service';
import { UUID } from 'crypto';
import { CreateFuzzerDto } from './dto/create-fuzzer.dto';
import { Response as Res } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadException } from './fuzzer.upload.exception'
import { FuzzerStorage } from './model/FuzzerStorage';
import { FuzzerPlan } from './model/FuzzerPlan';
import { Vectors } from './model/Vectors';
import { Mutations } from './model/Mutations';
import { Operations } from './model/Operations';
import { Fuzz } from './model/Fuzz';
import { BffException } from './bff.exception';

@Controller('/jdozer-fuzzer/bff')
export class BffController {

  private readonly log: Logger = new Logger(BffController.name);

  @Inject()
  private readonly mutations: Mutations;

  @Inject()
  private readonly operations: Operations;

  constructor(
    private readonly bffService: BffService,
    private readonly fuzzerStorage: FuzzerStorage,
    private readonly fuzzerPlan: FuzzerPlan,
    private readonly vectors: Vectors,
    private readonly fuzz: Fuzz
  ) { }

  @Get('/fuzzers')
  async getFuzzers() {
    this.log.verbose('Getting fuzzers from storage');
    return this.fuzzerStorage.getFuzzers();
  }

  @Get('/fuzzer/:fuzzerId')
  async getDetails(@Param('fuzzerId') fuzzerId: UUID, @Response() res: Res) {
    try {
      this.log.verbose(`Getting fuzzer details for fuzzer ID: ${fuzzerId}`);
      return res.json(await this.fuzzerStorage.getDetails(fuzzerId));
    } catch (e) {
      const err = `An error occurred while trying to obtain fuzzer details.`;
      this.log.error(err, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err });
    }

  }

  @Get('fuzzer/:fuzzerId/engine-metrics')
  async getEngineMetrics(@Param('fuzzerId') fuzzerId: UUID, @Response() res: Res) {
    try {
      return res.json(await this.fuzzerStorage.getEngineMetrics(fuzzerId));
    } catch (e) {
      const err: string = e.message;
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err });
    }
  }

  @Get('fuzzer/plan/:fuzzerId')
  async getFuzzerPlan(@Param('fuzzerId') fuzzerId: UUID) {
    this.log.verbose(`Getting fuzzer plan for fuzzer ID: ${fuzzerId}`);
    return this.fuzzerPlan.getPlan(fuzzerId);
  }

  @Get('fuzzer/:fuzzerId/vectors/status_codes')
  async getVectorsByStatusCode(@Param('fuzzerId') fuzzerId: UUID) {
    try {
      return await this.vectors.getByStatusCode(fuzzerId);
    } catch (e) {
      const err = `An error occurred while trying to obtain the vectors for status code.`;
      this.log.error(err, e);
      throw new Error(err);
    }
  }

  @Get('fuzzer/:fuzzerId/status_codes')
  async getStatusCodeByFuzzer(@Param('fuzzerId') fuzzerId: UUID, @Response() res: Res) {
    try {
      this.log.verbose(`Get the number of status codes: ${fuzzerId}`);
      return res.json(await this.fuzzerStorage.getCantStatusCode(fuzzerId));
    } catch (e) {
      const err = `An error occurred while trying to obtain the number of status codes.`;
      this.log.error(err, e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
  }

  @Get('/fuzzer/:fuzzerId/vectors/summary')
  async getVectorsSummary(@Param('fuzzerId') fuzzerId: UUID) {
    try {
      return await this.vectors.getSummary(fuzzerId);
    } catch (e) {
      const err = `An error occurred while trying to obtain the vectors summary.`;
      this.log.error(err, e);
      throw new Error(err);
    }
  }

  @Get('fuzzer/:fuzzerId/request/:requestId/details')
  async getFuzzDetails(@Param('fuzzerId') fuzzerId: UUID, @Param('requestId') requestId: UUID) {
    console.debug('getFuzzDetails -> ', requestId);
    try {
      return this.fuzz.getDetail(fuzzerId, requestId);
    } catch (e) {
      const err = `An error occurred while trying to obtain the fuzz details.`;
      this.log.error(err, e);
      throw new Error(err);
    }
  }

  @Get('fuzzer/:fuzzerId/:operation/:statusCode')
  async getStatusCodeResponseByOperation(@Param('fuzzerId') fuzzerId: UUID, @Param('operation') operation: string, @Param('statusCode') statusCode: number) {
    try {
      console.debug('getStatusCodeResponseByOperation -> ', fuzzerId, operation, statusCode);
      return this.bffService.getStatusCodeResponseByOperation(fuzzerId, operation, statusCode);
    } catch (e) {
      const err = `An error occurred while trying to obtain the response for operation ${operation} with status code ${statusCode}.`;
      this.log.error(err, e);
      throw new Error(err);
    }
  }

  @Post('/fuzzer')
  @UseInterceptors(FileInterceptor('contract'))
  @UseFilters(UploadException)
  async createFuzzer(@Body() createFuzzerDto: CreateFuzzerDto, @UploadedFile() file: Express.Multer.File, @Response() res: Res) {
    try {
      const resp: any = await this.bffService.createFuzzer(createFuzzerDto, file);
      return res.status(HttpStatus.ACCEPTED).json(resp);
    } catch (e) {
      if (e instanceof BffException) {
        return res.status(e.getStatus()).json({ message: e.message });
      }
      const err: string = `An error occurred while trying to create the fuzzer.`;
      this.log.error(err, e.message);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err });
    }
  }

  /**
   * @deprecated
   * @param fuzzerId
   * @param operationId 
   * @param method 
   * @param statusCode 
   * @returns 
   */
  @Get('fuzzer/:fuzzerId/mutations/validations/:operationId/:method/:statusCode')
  async getMutationsByStatusCodeAndMethod(@Param('fuzzerId') fuzzerId: UUID, @Param('operationId') operationId: string, @Param('method') method: string, @Param('statusCode') statusCode: number) {
    try {
      return await this.mutations.getMutationsByStatusCodeAndMethod(fuzzerId, operationId, method, statusCode);
    } catch (e) {
      const err = `An error occurred while trying to obtain the mutations for operation ${operationId} with status code ${statusCode}.`;
      this.log.error(err, e);
      throw new Error(err);
    }
  }

  @Get('/fuzzer/:fuzzerId/:operationId/:method/responses/:statusCode')
  async getResponsesByStatusCode(@Param('fuzzerId') fuzzerId: UUID, @Param('operationId') operationId: string, @Param('method') method: string, @Param('statusCode') statusCode: number) {
    try {
      return await this.operations.getByStatusCode(fuzzerId, operationId, method, statusCode)
    } catch (e) {
      const err = `An error occurred while trying to obtain the vectors for status code.`;
      this.log.error(err, e);
      throw new Error(err);
    }
  }

}
