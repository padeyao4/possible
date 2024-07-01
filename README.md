# Possible

## 介绍

这是一个使用 Vue + Vite + Electron 开发的目标管理软件，可以通过可视化的方式来管理任务。
软件界面参考了微软的 Todo List 软件，并加入了一些新功能

- 使用带有时间轴的画布来显示任务，可以清晰地显示任务之间的关联关系。
- 任务可以发布在公共空间,任何人都可以通过关注来查看和参与任务。(待实现)
- 软件会每天筛选出当天需要执行的任务，显示在每日任务中。

**演示地址**

[https://padeyao4.github.io/possible/](https://padeyao4.github.io/possible/)

**软件截图**

todo

## 安装与使用

1. 克隆项目到本地：

   ```
   git clone https://github.com/padeyao4/possible.git
   ```

2. 安装依赖：

   ```
   pnpm install
   ```

3. 运行项目：

   ```
   pnpm dev
   ```

4. 打包项目：

   ```
   pnpm electron
   ```
   
   打包完成后，会在 `release` 目录下生成可执行文件。
   
   
**欢迎大家使用和反馈！**
