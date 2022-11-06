const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const shell = require("shelljs");

const log4js = require("./logs");

const SECRET = "**********";

const router = new Router();
router.prefix("/webhooks");

const logger = log4js.getLogger("access");

const handleResponse = (ctx, status, message) => {
  ctx.status = status;
  ctx.body = {
    message,
  };
};

router.get("/", async (ctx) => {
  handleResponse(ctx, 200, "running");
});

router.post("/tutulist", async (ctx) => {
  const header = ctx.header;
  const gitlabToken = header["x-gitlab-token"];

  if (gitlabToken === SECRET && ctx.request.body) {
    const { object_kind, builds } = ctx.request.body;

    if (object_kind === "pipeline" && Array.isArray(builds)) {
      const lastBuild = builds[builds.length - 1];
      if (lastBuild.status === "success") {
        // 返回成功状态码
        handleResponse(ctx, 200, "ok");

        // 开始执行相关 shell
        const { code: loginCode } = shell.exec(
          "docker login --username=15163627992 registry.cn-hangzhou.aliyuncs.com --password-stdin < ./password"
        );
        if (loginCode !== 0) {
          logger.warn("登录 docker 镜像仓库失败");
        }
        logger.info("登录镜像仓库成功");

        const { code: pullCode } = shell.exec(
          "docker pull registry.cn-hangzhou.aliyuncs.com/tutulist/tutulist-web-server:latest"
        );
        if (pullCode !== 0) {
          logger.warn("拉取 docker 镜像失败");
        }
        logger.info("拉取 docker 镜像成功, 开始build");

        const { code } = shell.exec(
          "docker compose up -d --build app --no-deps"
        );
        if (code !== 0) {
          logger.warn("执行 docker compose up失败");
        }
        logger.info("执行 docker compose up成功");
      } else {
        handleResponse(ctx, 200, `当前流水线状态为 ${lastBuild.status}`);
      }
    } else {
      handleResponse(ctx, 500, "非 pipeline 事件");
    }
  } else {
    logger.warn("token 不合法");
    handleResponse(ctx, 401, "token 不合法");
  }
});

const app = new Koa();

app.use(bodyParser());
app.use(log4js.koaLogger(log4js.getLogger("http"), { level: "auto" }));
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("listen 3000 port");
});
