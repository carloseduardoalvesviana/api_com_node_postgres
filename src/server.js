import { fastify } from "fastify";
import rateLimit from "@fastify/rate-limit";
import { DatabasePostgres } from "./repositories/database-postgres.js";
// import { Database } from "./src/repositories/database-memory.js";

const server = fastify({
  logger: true,
});

fastify.register(rateLimit, {
  max: 100, // Máximo de requisições por janela de tempo
  timeWindow: "1 minute", // Janela de tempo (1 minuto)
  errorResponseBuilder: (req, context) => {
    return {
      code: 429,
      error: "Too Many Requests",
      message: `Você atingiu o limite de ${context.max} requisições por minuto.`,
      date: Date.now(),
      expiresIn: context.ttl, // Tempo restante até a janela ser reiniciada
    };
  },
});

// const database = new DatabaseMemory();
const database = new DatabasePostgres();

fastify.get("/", async (request, reply) => {
  return { message: "Bem-vindo à API!" };
});

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
  host: "0.0.0.0",
  port: process.env.PORT || 3333,
});
