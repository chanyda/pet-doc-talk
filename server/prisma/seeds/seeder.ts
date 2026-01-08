import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "generated/prisma/client";

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL || "",
    }),
});

async function main() {
    console.log("━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🌱 Prisma seed start");
    console.log("━━━━━━━━━━━━━━━━━━━━━━");

    await prisma.category.createMany({
        data: [{ name: "건강·상담·병원" }, { name: "사료·간식·용품" }, { name: "행동·훈련" }, { name: "자유 질문" }],
        skipDuplicates: true,
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Prisma seed end");
    console.log("━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (err) => {
        console.error(err);
        await prisma.$disconnect();
        process.exit(1);
    });
