import { Test, TestingModule } from "@nestjs/testing";
import { PostService } from "./post.service";
import { Connection, Model, mongo } from "mongoose";
import { Post, PostSchema } from "./post.schema";
import { closeMongeConnection, MockMongodbModule } from "../config/mongodb/mock-mongodb.module";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { PostModule } from "./post.module";
import { CreatePostDto } from "./dto/create-post.dto";
import { BadRequestException } from "@nestjs/common";
import { ModifyLinkDto } from "../link/dto/modify-link.dto";
import { ModifyPostDto } from "./dto/modify-post.dto";

describe("PostService", () => {
  let N;
  const badId = "12345";
  let service: PostService;
  let connection: Connection;
  let postModel: Model<Post>;
  let oldPost: Post;
  let oldPostObjectId;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MockMongodbModule({
          connectionName: (Date.now() * Math.random()).toString(16),
          useFindAndModify: false,
        }),
        MongooseModule.forFeature([
          {
            name: Post.name,
            schema: PostSchema,
          },
        ]),
      ],
      providers: [PostService],
    }).compile();
    service = module.get<PostService>(PostService);
    connection = await module.get(getConnectionToken());
    postModel = connection.model(Post.name, PostSchema);
  });

  beforeEach(async () => {
    await postModel.deleteMany({}).exec();
    const posts: CreatePostDto[] = [];
    for (let i = 0; i < N; ++i) {
      const post: CreatePostDto = {
        title: `post #${i}`,
        content: `post #${i} content, post #${i} content,post #${i} content,post #${i} content,post #${i} content,post #${i} content,post #${i} content,post #${i} content,post #${i} content `,
        creationDate: new Date(),
        modifiedDate: new Date(),
      };
      posts.push(post);
    }
    N = posts.length;
    await postModel.insertMany(posts);
    oldPost = (await postModel.find().exec())[0];
    oldPostObjectId = new mongo.ObjectID(oldPost._id);
  });

  afterAll(async () => {
    await connection.close();
    await closeMongeConnection();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("service should return all document", async () => {
      const posts = await service.findAll();
      expect(posts.length).toBe(N);
      expect(posts[0].toObject()).toEqual(oldPost.toObject());
    });
  });
  describe("findOne", () => {
    it("should find a post", async () => {
      const post = await service.findOne(oldPost._id);
      expect(post.toObject()).toEqual(oldPost.toObject());
    });
    it("should throw BadRequestException", async () => {
      await expect(service.findOne(badId)).rejects.toThrow(BadRequestException);
    });
  });
  describe("createOne", () => {
    const createPostDto: CreatePostDto = {
      title: "title",
      content: "content",
    } as CreatePostDto;
    it("should be created", async () => {
      const post = await service.createOne(createPostDto);
      const id = new mongo.ObjectID(post._id);
      const count = await postModel.countDocuments().exec();
      expect(count).toBe(N + 1);
      const found = await postModel.findById(id);
      expect(found.toObject()).toEqual(post.toObject());
    });
  });
  describe("modifyOne", () => {
    it("should modify a post", async () => {
      const newPost: ModifyPostDto = {
        title: "modify title",
        content: "modify content",
      };
      const modifyPost = await service.modifyOne(oldPost._id, newPost);
      expect(oldPost.toObject()).toEqual(modifyPost.toObject());

      const foundLink = await postModel.findById(oldPostObjectId).exec();
      expect(foundLink.title).toEqual(newPost.title);
      expect(foundLink.content).toEqual(newPost.content);

      const count = await postModel.countDocuments().exec();
      expect(count).toBe(N);
    });
    it("should throw BadRequestException", async () => {
      const modifyPostDto: ModifyPostDto = { title: "modify", content: "content" };
      await expect(service.modifyOne(badId, modifyPostDto)).rejects.toThrow(BadRequestException);
    });
  });
  describe("deleteOne", () => {
    it("should delete a post", async () => {
      const deletedPost = await service.deleteOne(oldPost._id);
      const count = await postModel.countDocuments().exec();
      expect(count).toBe(N - 1);
      expect(deletedPost.toObject()).toEqual(oldPost.toObject());
    });
    it("should throw BadRequestException", async () => {
      await expect(service.deleteOne(badId)).rejects.toThrow(BadRequestException);
    });
  });
});
