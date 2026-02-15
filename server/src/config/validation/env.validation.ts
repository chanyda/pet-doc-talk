import { Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { EnvironmentVariables } from "../dtos/env.dto";

const logger = new Logger("EnvValidation");

export function validate(config: Record<string, unknown>): EnvironmentVariables {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        logger.error("Environment variable validation failed.", errors.toString());
        throw new Error(errors.toString());
    }

    return validatedConfig;
}
