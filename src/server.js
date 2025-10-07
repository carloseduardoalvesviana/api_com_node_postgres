import { fastify } from "fastify";
import { DatabasePostgres } from "./repositories/database-postgres.js";
// import { Database } from "./src/repositories/database-memory.js";

const server = fastify();

// const database = new DatabaseMemory();
const database = new DatabasePostgres();

server.post("/videos", async (request, reply) => {
  const { title, description, duration } = request.body;

  await database.create({
    title,
    description,
    duration,
  });

  return reply.status(201).send();
});

server.get("/videos", async (request, reply) => {
  const search = request.query?.search;

  const videos = await database.list(search);

  return reply.send(videos);
});

server.get("/videos/:id", async (request, reply) => {
  const { id } = request.params;

  const video = await database.findOne(id);

  if (!video) {
    return reply.status(404).send();
  }

  return reply.send(video);
});

server.put("/videos/:id", async (request, reply) => {
  const { id } = request.params;

  const video = await database.findOne(id);

  if (!video) {
    return reply.status(404).send();
  }

  const { title, description, duration } = request.body;

  database.update(id, {
    title,
    description,
    duration,
  });

  return reply.status(204).send();
});

server.delete("/videos/:id", async (request, reply) => {
  const { id } = request.params;

  const video = await database.findOne(id);

  if (!video) {
    return reply.status(404).send();
  }

  await database.delete(id);

  return reply.status(204).send;
});

server.listen({
  port: process.env.PORT || 3333,
});
