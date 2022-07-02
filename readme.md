# 设计思路

- “我的一天” 用来展示每天要处理的任务
- “生活规划” 用来安排一段时间内所有任务
- “项目” 详细任务信息


## 转换为electron应用
在package.json中的"devDependencies"中添加
```
"concurrently": "^7.0.0",
"cross-env": "^7.0.3",
"electron": "^18.0.1",
```

在package.json中的"scripts"中添加
```
"dev": "concurrently \"wait-on http://127.0.0.1:8000/umi.css && yarn electron \" \"cross-env BROWSER=none yarn start \"",
"electron": "electron .",
```