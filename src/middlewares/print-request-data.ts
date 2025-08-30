import { FastifyReply, FastifyRequest } from "fastify";

export async function printRequestData(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const clientOrigin =
    request.headers.origin ||
    request.headers.referer ||
    request.headers["user-agent"] ||
    "Unknown";
  console.log(`[ ${request.method} ] ${request.url} | Client: ${clientOrigin}`);
}