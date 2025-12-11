import { Body, Controller, Get, Post, UploadedFile, UseFilters, UseInterceptors, Response, HttpStatus, Param, Logger } from '@nestjs/common';
import { BffService } from './bff.service';
import { UUID } from 'crypto';
import { CreateFuzzerDto } from './dto/create-fuzzer.dto';
import { Response as Res } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadException } from './fuzzer.upload.exception'
import { FuzzerStorage } from './model/FuzzerStorage';
import { FuzzerPlan } from './model/FuzzerPlan';

@Controller('/jdozer-fuzzer/bff')
export class BffController {

  private readonly log: Logger = new Logger(BffController.name);

  constructor(
    private readonly bffService: BffService,
    private readonly fuzzerStorage: FuzzerStorage,
    private readonly fuzzerPlan: FuzzerPlan
  ) { }

  @Get('/fuzzers')
  async getFuzzers() {
    this.log.verbose('Getting fuzzers from storage');
    return this.fuzzerStorage.getFuzzers();
  }

  @Get('fuzzer/plan/:fuzzerId')
  async getFuzzerPlan(@Param('fuzzerId') fuzzerId: UUID) {
    this.log.verbose(`Getting fuzzer plan for fuzzer ID: ${fuzzerId}`);
    return this.fuzzerPlan.getPlan(fuzzerId);
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

  @Get('fuzzer/fuzzing/request/:requestId/details')
  async getFuzzingDetails(@Param('requestId') requestId: UUID) {
    console.debug('getFuzzingDetails -> ', requestId);
    return this.bffService.getFuzzingDetails(requestId);
  }

  @Post('/fuzzer')
  @UseInterceptors(FileInterceptor('contract'))
  @UseFilters(UploadException)
  async createFuzzer(@Body() createFuzzerDto: CreateFuzzerDto, @UploadedFile() file: Express.Multer.File, @Response() res: Res) {
    const resp: any = await this.bffService.createFuzzer(createFuzzerDto, file);
    return res.status(HttpStatus.ACCEPTED).json(resp);
  }

}
