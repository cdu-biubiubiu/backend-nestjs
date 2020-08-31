import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
// import * as csurf from "csurf";
import * as helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.use(csurf({ cookie: true }));
  app.use(helmet());
  const options = new DocumentBuilder()
    .setTitle("Backend Api")
    .setDescription("nestjs 实现")
    .setVersion("0.0.1")
    .addBearerAuth()
    .addServer("http//")
    .addTag("link")
    .addTag("post")
    .addTag("user")
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup("api", app, document);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.APP_PORT || 3000;
  const host = "0.0.0.0";
  await app.listen(port, host);
  console.log("🤩 App is running!", await app.getUrl());
}

bootstrap();
