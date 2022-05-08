# 设计思路

- 怎么解决图的存储问题
- 好好思考怎么解决绘制问题


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