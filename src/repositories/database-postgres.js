import { randomUUID } from "node:crypto";
import { sql } from "../database.js";

export class DatabasePostgres {
  async list(search) {
    let query = search
      ? await sql`select * from videos where title ilike ${"%" + search + "%"}`
      : await sql`select * from videos`;
    return query;
  }

  async findOne(id) {
    const result = await sql`select * from videos where id = ${id} limit 1`;
    return result ? result[0] : null;
  }

  async create(video) {
    const videoId = randomUUID();
    const { title, description, duration } = video;
    await sql`insert into videos (id, title, description, duration) VALUES (${videoId}, ${title}, ${description}, ${duration})`;
  }

  async update(id, video) {
    const { title, description, duration } = video;
    await sql`update videos set title = ${title}, description = ${description}, duration = ${duration} WHERE id = ${id}`;
  }

  async delete(id) {
    await sql`delete from videos where id = ${id}`;
  }
}
