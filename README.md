#  - hono-starter


基于bun，hono，open-api，drizzle-orm，postgres的后台快速启动器（A rapid startup tool for the backend based on hono, open-api, drizzle-orm and postgres）

## 环境要求

- `bun` `1`+
- `docker` `22.x`+ ，
- `postgres` `17`+
- 使用 [`pnpm`](https://pnpm.io/zh/) 包管理器安装项目依赖


## 快速体验

```bash
docker compose --env-file .env --env-file .env.production up -d
```

启动成功后，通过 <http://localhost:3001/reference> 访问。


## 本地开发

- 获取项目代码

```bash
git clone git@github.com:WuZhangTing/hono-starter.git
```

- 安装依赖

```bash
cd hono-starter

pnpm install
```

- 【可选】如果你是新手，还不太会搭建`数据库`，你可以使用 `Docker` 启动指定服务供本地开发时使用, 例如：

- 启动postgres服务
```bash
docker compose --env-file .env --env-file .env.development run -d --service-ports postgres
```

 - 启动（开发环境）

```bash
pnpm dev
```

- 运行启动成功后，通过 <http://localhost:3001/reference> 访问。

- 打包

```bash
pnpm build
```

### 欢迎 Star && PR

**如果项目有帮助到你可以点个 Star 支持下。有更好的实现欢迎 PR。**



### 致谢
本项目基于hono-open-api-starter修改

- [hono-open-api-starter](https://github.com/w3cj/hono-open-api-starter)

### LICENSE

[MIT](LICENSE)