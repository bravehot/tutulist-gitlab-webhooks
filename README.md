# tutulist gitlab webhooks

### 用途

当服务端代码通过 `gitlab` 流水线运行成功后，会将构建出的镜像上传至阿里云私有镜像仓库。同时我们在 `gitlab webhooks` 中配置的 `pipelines` 事件也会触发。

此项目会监听 `gitlab webhooks` 的 `pipelines` 事件，当事件触发时会从阿里云私有镜像仓库中拉取最新镜像，拉取成功后并通过 `docker compose` 进行重新构建。

更多详细信息，请见语雀文档 [后端部署-Gitlab CI/CD 篇](https://www.yuque.com/aiyouwai/tutulist/sgqui8)；
