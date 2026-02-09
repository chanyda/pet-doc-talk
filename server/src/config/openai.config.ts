import { registerAs } from "@nestjs/config";
import { OpenaiConfigType } from "src/types/config.type";

export default registerAs<OpenaiConfigType>("openai", () => ({
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-5-mini-2025-08-07",
}));
