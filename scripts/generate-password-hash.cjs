const { createHash } = require("node:crypto");

const [, , password, pepper] = process.argv;

if (!password || !pepper) {
  console.error('Uso: node scripts/generate-password-hash.cjs "MiPasswordSeguro" "MiPepperSeguro"');
  process.exit(1);
}

const hash = createHash("sha256").update(`${password}${pepper}`, "utf8").digest("hex");
console.log(`AUTH_PASSWORD_HASH=${hash}`);
