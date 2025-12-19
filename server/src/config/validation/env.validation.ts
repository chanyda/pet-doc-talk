import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { EnvironmentVariables } from "../dto/env.dto";

export function validate(config: Record<string, unknown>): EnvironmentVariables {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        console.log(errors);
        throw new Error(errors.toString());
    }

    return validatedConfig;
}
