import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { NotFoundError } from "./not-found";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  console.error("Erro capturado:", error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Invalid Input",
      errors: error.flatten().fieldErrors,
      details: {
        issues: error.validation,
        method: request.method,
        url: request.url,
      },
    });
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: "Response Validation Error",
      message: "Request doesn't match the schema",
      details: {
        issues: error.validation,
        method: request.method,
        url: request.url,
      },
    });
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      error: "Internal Server Error",
      message: "Response doesn't match the schema",
      details: {
        issues: error.validation,
        method: request.method,
        url: request.url,
      },
    });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      message: error.message,
      details: {
        method: request.method,
        url: request.url,
      },
    });
  }

  if ((error as any).error === "resource not found") {
    return reply.status(404).send({
      message: "Resource not found",
      details: {
        method: request.method,
        url: request.url,
      },
    });
  }

  return reply.status(500).send({
    message: "Internal Server Error",
    details: {
      issues: error.validation,
      method: request.method,
      url: request.url,
    },
  });
};
