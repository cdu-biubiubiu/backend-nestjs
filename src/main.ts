import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle("Biubiubiu Backend Api")
    .setDescription("Biubiubiu 的 nestjs 实现")
    .setVersion("0.0.1")
    // .addTag("api")
    .addTag("link")
    .addTag("post")
    .addTag("user")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);
  await app.listen(3000);
}

bootstrap();
