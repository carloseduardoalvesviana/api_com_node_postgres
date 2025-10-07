import { sql } from "./database.js";

await sql`
  CREATE TABLE videos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    duration INT NOT NULL
  )
`
  .then(() => {
    console.log("Tabela de videos criada");
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    process.exit();
  });
