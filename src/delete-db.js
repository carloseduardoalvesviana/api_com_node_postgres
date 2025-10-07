import { sql } from "./database.js";

await sql`DROP TABLE IF EXISTS videos`
  .then(() => {
    console.log("Tabela de videos apagada");
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    process.exit();
  });
