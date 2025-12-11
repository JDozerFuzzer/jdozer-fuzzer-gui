import { Module } from "@nestjs/common";
import { FuzzerStorage } from "./FuzzerStorage";
import { RedisService } from "../storage/RedisService";
import { FuzzerPlan } from "./FuzzerPlan";

@Module({
    providers: [
        FuzzerStorage,
        RedisService,
        FuzzerPlan
    ],
    exports: [FuzzerStorage, FuzzerPlan]
})
export class FuzzerStorageModule { }