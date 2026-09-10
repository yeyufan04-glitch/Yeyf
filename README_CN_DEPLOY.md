# 离线演示与国内静态托管

## 本机预览

```bash
npm install
npm run preview:cn
```

## 生成静态产物

```bash
npm run build:cn
```

生成的 `dist-cn/` 不需要数据库、API Key 或模型服务。将该目录完整上传到腾讯云 COS、阿里云 OSS、华为云 OBS、学校服务器或其他静态网站服务即可。

## 部署时必须保留

- `index.html`
- `assets/`
- `demo-documents/`
- `demo-data/`
- `og.png`
- `favicon.svg`

## 不能误称为已完成的事项

本地返回 200 或生成 ZIP，只证明产物可运行，不证明某个公网域名在中国所有网络环境可访问。真正对外参赛前，应使用不同运营商网络和未登录浏览器测试目标域名。
