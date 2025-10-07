import { createServer } from "node:http";

const server = createServer((request, response) => {
  console.log("hello");
  return response.end();
});

server.listen(3333);
