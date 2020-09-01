# backend 的 nestjs 实现

成都大学计算机学院官网后台

# 所使用技术

- 使用 Nest.js 作为后台框架
- 使用 typescript 作为编码语言
- 使用 Nest.js 封装的 mongoose 提供 ODM 服务
- 使用 Nest.js 封装的 swagger 提供接口信息
- 使用 jwt 验证用户身份
- 使用 docker, docker-compose 提供容器化服务


## 如何开始


### 使用 docker-compose

如果你要直接开始使用,你可以在安装docker,docker-compose之后,使用`docker-compose up -d`启动服务.

### 使用docker 来进行开发 // TODO

数据库以及后台都使用docker打包了,如果想在本地使用数据库,你可以:

```bash
docker run --rm -d -p 27017:27017 hanhan9449/biu-mongodb
```
### 本地开发 or 使用

首先,你需要将数据库模拟数据导入 mongodb 中,然后启动项目即可.

ps. 相关导入脚本在 `./mongodb` 路径

ps. 你可能需要修改部分参数,例如数据库账号密码等,你可以这样做:

在你的目录创建一个名为`.env`的文件
```dotenv
MONGO_HOST=localhost
#MONGO_USER=
#MONGO_PASSWORD=
#MONGO_PORT=27017
#MONGO_DATABASE=

#JWT_SECRET=

```
