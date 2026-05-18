/**
 * Seed script — imports data from the original MySQL dump
 * (`../izmirnat_flowershop (1).sql`) into PostgreSQL via Prisma.
 *
 * Run with:  npm run db:seed
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const DUMP_PATH = path.resolve(
  process.cwd(),
  "..",
  "izmirnat_flowershop (1).sql",
);

type Row = (string | number | null)[];

/** Extract all VALUES rows from INSERT statements for a given table.
 *  Uses a character-by-character SQL-aware search so semicolons inside
 *  string literals don't prematurely terminate the match. */
function extractInserts(sql: string, table: string): Row[] {
  const rows: Row[] = [];
  const header = `INSERT INTO \`${table}\``;
  let searchFrom = 0;

  while (true) {
    const headerIdx = sql.indexOf(header, searchFrom);
    if (headerIdx === -1) break;

    const valuesIdx = sql.indexOf("VALUES", headerIdx + header.length);
    if (valuesIdx === -1) break;

    // Skip whitespace after VALUES keyword
    let blockStart = valuesIdx + 6;
    while (blockStart < sql.length && /\s/.test(sql[blockStart])) blockStart++;

    // Find the first `;` not inside a SQL string literal
    let inStr = false;
    let esc = false;
    let blockEnd = sql.length;

    for (let i = blockStart; i < sql.length; i++) {
      const ch = sql[i];
      if (esc) { esc = false; continue; }
      if (ch === "\\" && inStr) { esc = true; continue; }
      if (ch === "'") {
        if (inStr && sql[i + 1] === "'") { i++; continue; } // '' escape
        inStr = !inStr;
        continue;
      }
      if (!inStr && ch === ";") {
        blockEnd = i;
        break;
      }
    }

    rows.push(...parseValuesBlock(sql.slice(blockStart, blockEnd)));
    searchFrom = blockEnd + 1;
  }

  return rows;
}

/** Parse a `(...),(...),(...)` VALUES block into rows. */
function parseValuesBlock(block: string): Row[] {
  const rows: Row[] = [];
  let depth = 0;
  let inString = false;
  let escape = false;
  let current = "";
  for (let i = 0; i < block.length; i++) {
    const ch = block[i];
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === "\\" && inString) {
      current += ch;
      escape = true;
      continue;
    }
    if (ch === "'" && !escape) {
      // MySQL escapes single quote as '' inside a string
      if (inString && block[i + 1] === "'") {
        current += "''";
        i++;
        continue;
      }
      inString = !inString;
      current += ch;
      continue;
    }
    if (inString) {
      current += ch;
      continue;
    }
    if (ch === "(") {
      if (depth === 0) {
        current = "";
      } else {
        current += ch;
      }
      depth++;
      continue;
    }
    if (ch === ")") {
      depth--;
      if (depth === 0) {
        rows.push(parseRow(current));
        current = "";
      } else {
        current += ch;
      }
      continue;
    }
    if (depth > 0) current += ch;
  }
  return rows;
}

function parseRow(raw: string): Row {
  const values: Row = [];
  let inString = false;
  let escape = false;
  let current = "";
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === "\\" && inString) {
      current += ch;
      escape = true;
      continue;
    }
    if (ch === "'") {
      if (inString && raw[i + 1] === "'") {
        current += "'";
        i++;
        continue;
      }
      inString = !inString;
      continue;
    }
    if (!inString && ch === ",") {
      values.push(castValue(current.trim()));
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.length > 0 || values.length > 0) {
    values.push(castValue(current.trim()));
  }
  return values;
}

function castValue(raw: string): string | number | null {
  if (raw === "" || raw.toUpperCase() === "NULL") return null;
  // Unescape MySQL backslash escapes
  const unescaped = raw
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
  if (/^-?\d+(\.\d+)?$/.test(unescaped)) return Number(unescaped);
  return unescaped;
}

/** Rewrite `img/products/X.png` → `/products/X.png` for Next.js public/. */
function rewriteImagePath(value: string | null): string | null {
  if (!value || !value.includes("/")) return null; // "0" or bare non-path values
  return value.replace(/^img\//, "/").replace(/^\/?products\//, "/products/");
}

async function main() {
  if (!fs.existsSync(DUMP_PATH)) {
    throw new Error(`SQL dump not found at ${DUMP_PATH}`);
  }
  const sql = fs.readFileSync(DUMP_PATH, "utf-8");

  console.log("→ Wiping existing rows...");
  await prisma.order.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.deliveryHour.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.admin.deleteMany();

  // admins
  const admins = extractInserts(sql, "admins");
  for (const row of admins) {
    const [id, username, passwordHash, name, isSuperadmin, createdAt] = row;
    await prisma.admin.create({
      data: {
        id: Number(id),
        username: String(username),
        passwordHash: String(passwordHash),
        name: String(name),
        isSuperadmin: Boolean(Number(isSuperadmin)),
        createdAt: new Date(String(createdAt)),
      },
    });
  }
  console.log(`✓ admins: ${admins.length}`);

  // categories
  const categories = extractInserts(sql, "categories");
  for (const row of categories) {
    const [id, name, slug, description, image, isActive, createdAt, updatedAt] =
      row;
    await prisma.category.create({
      data: {
        id: Number(id),
        name: String(name),
        slug: String(slug),
        description: description == null ? null : String(description),
        image: rewriteImagePath(image == null ? null : String(image)),
        isActive: Boolean(Number(isActive)),
        createdAt: new Date(String(createdAt)),
        updatedAt: new Date(String(updatedAt)),
      },
    });
  }
  console.log(`✓ categories: ${categories.length}`);

  // delivery_hours
  const hours = extractInserts(sql, "delivery_hours");
  for (const row of hours) {
    const [id, timeSlot, isActive, createdAt] = row;
    await prisma.deliveryHour.create({
      data: {
        id: Number(id),
        timeSlot: String(timeSlot),
        isActive: Boolean(Number(isActive)),
        createdAt: new Date(String(createdAt)),
      },
    });
  }
  console.log(`✓ delivery_hours: ${hours.length}`);

  // settings
  const settings = extractInserts(sql, "settings");
  for (const row of settings) {
    const [id, key, value] = row;
    await prisma.setting.create({
      data: {
        id: Number(id),
        settingKey: String(key),
        settingValue: value == null ? null : String(value),
      },
    });
  }
  console.log(`✓ settings: ${settings.length}`);

  // products
  const products = extractInserts(sql, "products");
  for (const row of products) {
    const [
      id,
      name,
      isActive,
      isFeatured,
      slug,
      ismainpage,
      price,
      image,
      availableDays,
      availableDistricts,
      availableHours,
      createdAt,
      description,
    ] = row;
    await prisma.product.create({
      data: {
        id: Number(id),
        name: String(name),
        isActive: Boolean(Number(isActive)),
        isFeatured: Boolean(Number(isFeatured)),
        slug: slug == null ? null : String(slug),
        isMainPage: ismainpage == null ? null : Boolean(Number(ismainpage)),
        price: String(price),
        image: rewriteImagePath(image == null ? null : String(image)),
        availableDays: availableDays == null ? null : String(availableDays),
        availableDistricts:
          availableDistricts == null ? null : String(availableDistricts),
        availableHours: availableHours == null ? null : String(availableHours),
        createdAt: new Date(String(createdAt)),
        description: description == null ? null : String(description),
      },
    });
  }
  console.log(`✓ products: ${products.length}`);

  // product_categories
  const links = extractInserts(sql, "product_categories");
  for (const row of links) {
    const [productId, categoryId] = row;
    await prisma.productCategory
      .create({
        data: {
          productId: Number(productId),
          categoryId: Number(categoryId),
        },
      })
      .catch(() => {
        // Skip if FK fails (orphaned link)
      });
  }
  console.log(`✓ product_categories: ${links.length}`);

  // Fix autoincrement sequences so future inserts don't collide with imported IDs
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('admins','id'),  (SELECT COALESCE(MAX(id),1) FROM admins));`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('categories','id'),  (SELECT COALESCE(MAX(id),1) FROM categories));`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('products','id'),  (SELECT COALESCE(MAX(id),1) FROM products));`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('delivery_hours','id'),  (SELECT COALESCE(MAX(id),1) FROM delivery_hours));`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('settings','id'),  (SELECT COALESCE(MAX(id),1) FROM settings));`,
  );

  console.log("✓ Seed complete");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
