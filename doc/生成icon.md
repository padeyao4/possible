# 制作icon方法

通过制作svg文件,导入到ps中,选择到处png文件

## 要在 Mac 上为 Tauri 应用配置图标，可以按照以下步骤进行操作

1. 准备图标源文件：确保你有一个 PNG 格式的图标文件，这是 Tauri 所要求的。
2. 打开 Tauri 项目目录：在项目的根目录下找到 `src-tauri` 文件夹。
3. 生成图标：在项目根目录下运行 `npm run tauri icon <file>` 命令，其中 `<file>` 是你的图标文件名（例如 `logo.png`）。这将为你的图标生成全平台所有尺寸的图标文件，并将它们放置在 `src-tauri/icons` 目录下。
4. 修改配置：打开 `src-tauri` 目录下的 `tauri.config.json` 文件，找到 `tauri.bundle` 部分下的 `icon` 配置项。将其修改为你希望的图标路径，例如 `("icons/32x32.png","icons/128x128.png","icons/128x128@2x.png","icons/icon.icns","icons/icon.ico")`。
5. 重新构建应用：运行 `tauri build` 命令重新构建 Tauri 应用，使图标配置生效。

通过以上步骤，你就可以成功地在 Mac 上为 Tauri 应用配置自定义图标了。请确保按照 Tauri 的要求准备图标文件，并根据实际情况修改配置文件中的图标路径。
