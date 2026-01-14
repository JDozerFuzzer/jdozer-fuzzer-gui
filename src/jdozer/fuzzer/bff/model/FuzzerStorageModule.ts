import { Module } from "@nestjs/common";
import { FuzzerStorage } from "./FuzzerStorage";
import { RedisService } from "../storage/RedisService";
import { FuzzerPlan } from "./FuzzerPlan";
import { Vectors } from "./Vectors";
import { Mutations } from "./Mutations";
import { Operations } from "./Operations";
import { Fuzz } from "./Fuzz";

@Module({
    providers: [
        FuzzerStorage,
        RedisService,
        FuzzerPlan,
        Vectors,
        Mutations,
        Operations,
        Fuzz
    ],
    exports: [FuzzerStorage, FuzzerPlan, Vectors, Mutations, Operations, Fuzz]
})
export class FuzzerStorageModule { }