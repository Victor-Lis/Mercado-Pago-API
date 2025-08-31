import { FastifyReply, FastifyRequest } from "fastify";

export async function printRequestData(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const fullUrl = `${request.protocol}://${request.headers.host}${request.url}`;
  console.log(`[ ${request.method} ] ${fullUrl}`);
}