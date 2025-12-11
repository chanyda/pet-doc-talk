import { plainToInstance } from "class-transformer";
import { IsEnum, IsInt, Max, Min, validateSync } from "class-validator";

enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsInt()
    @Min(0)
    @Max(65535)
    PORT: number;
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        console.log(errors);
        throw new Error(errors.toString());
    }

    return validatedConfig;
}
