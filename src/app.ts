import { env } from "@/config/env";

import cors from "@fastify/cors";
import fastify from "fastify";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

import { errorHandler } from "./errors/error-handler";
import { printRequestData } from "./middlewares/print-request-data";

import { MercadoPagoRoutes } from "./routes/mercado-pago";

export const app = fastify();

const theme = new SwaggerTheme();
const content = theme.getBuffer(SwaggerThemeNameEnum.DARK);

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Mercado Pago API",
      description:
        "Projeto usando a API do Mercado Pago do <a href='https://www.linkedin.com/in/victor-lis-bronzo.'>Victor Lis Bronzo</a>.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.setErrorHandler(errorHandler);

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
  theme: {
    css: [{ filename: "theme.css", content: content }],
  },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.addHook("onRequest", printRequestData);

app.register((app) => {
  app.register(MercadoPagoRoutes, { prefix: "/payment" });
});

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log("Server running on port " + env.PORT);
});
