import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { Connection, Model, mongo } from "mongoose";
import { User, UserSchema } from "./user.schema";
import { closeMongeConnection, MockMongodbModule } from "../config/mongodb/mock-mongodb.module";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { CreateUserDto, Role } from "./dto/create-user.dto";
import { JwtModule } from "@nestjs/jwt";
import {
  BadRequestException,
  ForbiddenException,
  GoneException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ModifyUserDto } from "./dto/modify-user.dto";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { filterPassword } from "./user.util";
import { verifyPassword } from "../utils/bcrypt.util";
import { RegistryUserDto } from "./dto/registry-user.dto";

describe("UserService", () => {
  let N: number;
  const badId = "12345";
  let service: UserService;
  let connection: Connection;
  let model: Model<User>;
  let old: User;
  let oldObjectId;

  beforeAll(async () => {
    process.env.SALT_ROUND = "10";
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MockMongodbModule({
          connectionName: (Date.now() * Math.random()).toString(16),
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
        ]),
        JwtModule.register({
          secret: "testSecret",
          signOptions: { expiresIn: "60m" },
        }),
      ],
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
    connection = await module.get(getConnectionToken());
    model = connection.model(User.name, UserSchema);
  });
  beforeEach(async () => {
    await model.deleteMany({}).exec();
    const users: CreateUserDto[] = [
      {
        username: "user",
        password: "$2b$10$th5o/3yhpA3wpTcEOQAu9OBQ.L2ArJYgrM220L/QlHVVWXPxnNFDK",
        role: Role.User,
      },
      {
        username: "admin",
        password: "$2b$10$1rFloJ/PE2EsOC8VDLp.VeT5TdDU/gBo8bjDw8AoTLuT44NyqRIbe",
        role: Role.Admin,
      },
      {
        username: "superAdmin",
        password: "$2b$10$OZ.X7mRn8iwXCTD5wn/.8.n9j7iQR4ZZJNJbd7QvC3ta06BultwF6",
        role: Role.SuperAdmin,
      },
    ];
    N = users.length;
    await model.insertMany(users);
    old = (await model.find().exec())[0];
    oldObjectId = new mongo.ObjectID(old._id);
  });
  afterAll(async () => {
    await connection.close();
    await closeMongeConnection();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
  describe("findAll", () => {
    it("should return all user without password", async () => {
      const users = await service.findAll();
      expect(users.length).toBe(N);
      expect(users[0].password).not.toBeDefined();
      expect(users[0].username).toEqual(old.username);
      expect(users[0].role).toEqual(old.role);
    });
  });
  describe("findOne", () => {
    it("should return a user without password", async () => {
      const user = await service.findOne(old._id);
      expect(user.username).toEqual(old.username);
      expect(user.password).not.toBeDefined();
      expect(user.role).toEqual(old.role);
    });
    it("should throw 400", async () => {
      await expect(service.findOne(badId)).rejects.toThrow(BadRequestException);
    });
    it("should throw 404", async () => {
      await model.deleteMany({}).exec();
      await expect(service.findOne(old._id)).rejects.toThrow(NotFoundException);
    });
  });
  describe("createOne", () => {
    let createUserDto: CreateUserDto;
    beforeEach(() => {
      createUserDto = {
        username: "newUser",
        password: "newPassword",
        role: Role.User,
      };
    });
    it("should be created", async () => {
      const user = await service.createOne(createUserDto);
      const id = new mongo.ObjectID(user._id);
      const count = await model.countDocuments().exec();
      expect(count).toBe(N + 1);
      const found = await model.findById(id);
      expect(found.toObject()).toEqual(user.toObject());
    });
    it("should throw 403 ", async () => {
      createUserDto.username = "user";
      await expect(service.createOne(createUserDto)).rejects.toThrow(ForbiddenException);
    });
  });
  describe("modifyOne", () => {
    let newUser: ModifyUserDto;
    beforeEach(() => {
      newUser = {
        username: "modify",
        password: "modify",
        role: Role.Admin,
      };
    });
    it("should modify a user", async () => {
      const modified = await service.modifyOne(old._id, newUser);
      const found = await model.findById(old._id).exec();
      expect(old.toObject()).toEqual(modified.toObject());
      expect(found.username).toEqual(newUser.username);
      expect(found.password).toEqual(newUser.password);
      expect(found.role).toEqual(newUser.role);
    });
    it("should throw 400", async () => {
      await expect(service.modifyOne(badId, newUser)).rejects.toThrow(BadRequestException);
    });
    it("should throw 403", async () => {
      newUser.role = Role.SuperAdmin;
      await expect(service.modifyOne(old._id, newUser)).rejects.toThrow(ForbiddenException);
    });
    it("should throw 404", async () => {
      await model.deleteMany({}).exec();
      await expect(service.modifyOne(old._id, newUser)).rejects.toThrow(NotFoundException);
    });
  });
  describe("deleteOne", () => {
    it("should delete a user", async () => {
      const deleted = await service.deleteOne(old._id);
      const count = await model.countDocuments().exec();
      expect(count).toBe(N - 1);
      expect(deleted.toObject()).toEqual(old.toObject());
    });
    it("should throw 400", async () => {
      await expect(service.deleteOne(badId)).rejects.toThrow(BadRequestException);
    });
    it("should throw 403", async () => {
      const superAdmin = await model.findOne({ username: "superAdmin" }).exec();
      await expect(service.deleteOne(superAdmin._id)).rejects.toThrow(ForbiddenException);
    });
    it("should throw 404", async () => {
      await model.deleteMany({}).exec();
      await expect(service.deleteOne(old._id)).rejects.toThrow(NotFoundException);
    });
  });
  describe("validate", () => {
    let verifyUserDto: VerifyUserDto;
    beforeEach(() => {
      verifyUserDto = {
        username: "superAdmin",
        password: "superAdmin",
      };
    });

    it("should return a user without password", async () => {
      const res = await service.validate(verifyUserDto);
      expect(res.password).not.toBeDefined();
      expect(res.username).toBe(verifyUserDto.username);
    });
    it("should throw 401", async () => {
      verifyUserDto.password = "badPassword";
      await expect(service.validate(verifyUserDto)).rejects.toThrow(UnauthorizedException);
    });
    it("should throw 403", async () => {
      verifyUserDto.username = "badUsername";
      await expect(service.validate(verifyUserDto)).rejects.toThrow(ForbiddenException);
    });
  });
  describe("login", () => {
    let user: VerifyUserDto;
    beforeEach(() => {
      user = {
        username: "user",
        password: "user",
      };
    });
    it("should return token", async () => {
      const res = await service.login(user);
      expect(res.username).toBeDefined();
      expect(res.access_token).toBeDefined();
    });
  });
  describe("modifySelfPassword", () => {
    let modifiedPassword: string;
    beforeEach(() => {
      modifiedPassword = "modifiedPassword";
    });
    it("should modify himself password", async () => {
      const res = await service.modifyPassword(old._id, modifiedPassword);
      expect(res.username).toBe(old.username);
      expect(res.password).not.toBeDefined();
      const found = await model.findById(oldObjectId);
      expect(verifyPassword(modifiedPassword, found.password)).toBeTruthy();
    });
    it("should throw 400", async () => {
      await expect(service.modifyPassword(badId, modifiedPassword)).rejects.toThrow(BadRequestException);
    });
    it("should throw 404", async () => {
      await model.deleteMany({}).exec();
      await expect(service.modifyPassword(old._id, modifiedPassword)).rejects.toThrow(NotFoundException);
    });
  });
  describe("registry", () => {
    let registryUserDto: RegistryUserDto;
    beforeEach(() => {
      registryUserDto = {
        username: "registry",
        password: "registry",
      } as RegistryUserDto;
    });
    it("should return a user without password", async () => {
      const user = await service.registry(registryUserDto);
      const id = new mongo.ObjectID(user._id);
      expect(user.password).not.toBeDefined();
      const found = await model.findById(id).exec();
      expect(verifyPassword(found.password, registryUserDto.password)).toBeTruthy();
      const count = await model.countDocuments().exec();
      expect(count).toBe(N + 1);
    });
    it("should throw 403", async () => {
      registryUserDto.username = "user";
      await expect(service.registry(registryUserDto)).rejects.toThrow(ForbiddenException);
    });
  });
});
