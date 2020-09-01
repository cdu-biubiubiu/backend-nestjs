import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth/auth.service";
import { LocalStrategy } from "./auth/local.strategy";
import { JwtStrategy } from "./auth/jwt.strategy";

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, LocalStrategy, JwtStrategy],
  exports: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "testSecret",
      signOptions: { expiresIn: "20m" },
    }),
  ],
})
export class UserModule {}
