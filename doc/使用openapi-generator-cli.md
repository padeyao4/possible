# 使用openapi生成axios代码

## install

```bash
npm install @openapitools/openapi-generator-cli -g
openapi-generator-cli version
```

## how to use

```bash
openapi-generator-cli generate -i http://127.0.0.1:8080/v3/api-docs -g typescript-axios -o ./src/openapi/
```

## 参考

- [openapi-generator-cli](https://openapi-generator.tech/docs/installation/)
