# 使用openapi生成axios代码

## install
```angular2html
npm install @openapitools/openapi-generator-cli -g
openapi-generator-cli version
```

## how to use
```bash
openapi-generator-cli generate -i http://127.0.0.1:8080/v3/api-docs -g typescript-axios -o ./src/openapi/
```
