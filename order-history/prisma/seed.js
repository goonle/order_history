// prisma/seed.js
import "dotenv/config";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

import bcrypt from "bcryptjs";

async function main() {
  // 1) 기본 유닛
  const units = ["ea", "kg", "g", "L", "ml", "pack", "box", "canteen"];
  for (const name of units) {
    await prisma.unit.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 2) 기본 카테고리
  const categories = ["meat", "vegetable", "dairy", "snack", "drink", "frozen", "etc"];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 3) 기본 태그
  const tags = ["food", "clothes", "japan", "vegetable", "bakery"];
  for (const name of tags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 4) 기본 유저 (admin / 비번: change-me-1234)
  const accountId = "admin";
  const password = "change-me-1234";
  const passwordEncrypted = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { accountId },
    update: {},
    create: {
      accountId,
      passwordEncrypted,
    },
  });

  // 5) 기본 Vendor 1개
  const vendor = await prisma.vendor.create({
    data: {
      name: "Sample Vendor",
      note: "Seed vendor for development",
    },
  });

  // 6) VendorTag 연결
  const foodTag = await prisma.tag.findUnique({ where: { name: "food" } });
  if (foodTag) {
    await prisma.vendorTag.upsert({
      where: {
        vendorId_tagId: {
          vendorId: vendor.id,
          tagId: foodTag.id,
        },
      },
      update: {},
      create: {
        vendorId: vendor.id,
        tagId: foodTag.id,
      },
    });
  }

  // 7) 기본 Template 1개
  const template = await prisma.template.create({
    data: {
      name: "Default Order Template",
      userId: user.id,
      vendorId: vendor.id,
      subject: "Order Request",
      header: "Hello,\n\nPlease find our order below:\n",
      footer: "\n\nThanks,\nAdmin",
    },
  });

  // 8) OrderChannel 예시 1개 (sms_manual)
  await prisma.orderChannel.create({
    data: {
      vendorId: vendor.id,
      type: "sms_manual",
      destination: "+64XXXXXXXXX",
      subjectTemplateId: template.id,
      bodyTemplateId: template.id,
      sendMode: "manual",
    },
  });

  // 9) Item 예시 1개
  const unitEa = await prisma.unit.findUnique({ where: { name: "ea" } });
  const catEtc = await prisma.category.findUnique({ where: { name: "etc" } });

  if (unitEa && catEtc) {
    await prisma.item.create({
      data: {
        name: "Sample Item",
        vendorId: vendor.id,
        categoryId: catEtc.id,
        unitId: unitEa.id,
        priceCents: 499,
        isActive: true,
        imageUrl: null,
      },
    });
  }

  console.log("✅ Seed complete");
  console.log(`👤 user: ${accountId}`);
  console.log(`🔑 password: ${password}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
