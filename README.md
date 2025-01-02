# Possible

## 介绍

这是一个使用 Vue + Vite 开发的目标管理软件，可以通过可视化的方式来管理任务。
软件界面参考了微软的 Todo List 软件，并加入了一些新功能

- 使用带有时间轴的画布来显示任务，可以清晰地显示任务之间的关联关系。
- 任务可以发布在公共空间,任何人都可以通过关注来查看和参与任务。(待实现)
- 软件会每天筛选出当天需要执行的任务，显示在每日任务中。

### 主要特性

- 时间轴视图：使用可视化时间轴展示任务，清晰显示任务关联和进度
- 智能任务管理：自动筛选当天待办任务，帮助您专注于重要事项
- GitHub 账号登录：一键使用 GitHub 账号登录，无需额外注册
- 实时数据同步：数据实时保存到云端，多设备访问无忧

## 地址

[https://liangpi.site](https://possible.liangpi.site)

## 软件截图

![登录界面](screenshots/login.png)
![主界面](screenshots/main.png)
![任务编辑](screenshots/task.png)

## 安装与使用

1. 克隆项目到本地：

   ```bash
   git clone https://github.com/padeyao4/possible.git
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 运行项目：

   ```bash
   npm run dev
   ```

4. 打包项目：

   ```bash
   npm run build
   ```

   打包完成后，会在 `dist` 目录下生成部署文件。

   ## 技术栈

   - Vue 3 + TypeScript - 前端框架
   - Vite - 构建工具
   - Element Plus - UI组件库
   - Tailwind CSS - 样式框架
   - GitHub Actions - CI/CD

   ## 开发环境要求

   - Node.js >= 18
   - npm >= 9.0

   ## 反馈

   欢迎大家使用和反馈！
