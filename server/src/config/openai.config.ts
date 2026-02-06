import { registerAs } from "@nestjs/config";
import { OpenaiConfigType } from "src/types/config.type";

export default registerAs<OpenaiConfigType>("openai", () => ({
    apiKey: process.env.OPENAI_API_KEY || "",
}));
