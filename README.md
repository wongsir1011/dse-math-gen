# DSE Math Generator

專業的香港中學文憑考試 (HKDSE) 數學練習題生成器，使用 AI 生成高質量的數學題目、評分參考及 SVG 圖表。

## 功能特點

- 🎯 **多學科支援**: 必修部分、M1 (統計與微積分)、M2 (代數與微積分)
- 📝 **自定義難度**: Section A(1), A(2), B 等級別選擇
- 🎨 **SVG 圖表生成**: 自動生成幾何圖形、坐標系統計表格等
- 🌐 **雙語介面**: 繁體中文 / English 切換
- 🌓 **深色模式**: 支援系統主題及手動切換
- 📋 **評分參考**: 詳細的 marking scheme 及專家點評
- 🖨️ **列印友善**: 專業格式，可直接列印或儲存為 PDF
- 📜 **歷史記錄**: 本地儲存最近 20 條生成記錄

## 快速開始

### 安裝依賴

```bash
npm install
```

### 設定環境變數

建立 `.env` 檔案並設定 OpenRouter API Key：

```env
OPENROUTER_API_KEY=your_api_key_here
PORT=3000
MODEL_ID=google/gemini-2.5-flash
```

### 啟動伺服器

```bash
npm start
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 專案結構

```
dse-math-gen/
├── index.html          # 主頁面
├── style.css           # 樣式表
├── app.js              # 前端應用程式邏輯
├── data.js             # 課程數據及翻譯
├── server.js           # Express 伺服器
├── api/
│   └── generate.js     # Vercel Serverless Function
├── test_api.js         # API 測試腳本
├── package.json        # 專案配置
└── .env                # 環境變數 (需自行建立)
```

## 技術棧

- **前端**: Vanilla JavaScript, KaTeX (數學公式渲染), Lucide Icons
- **後端**: Node.js, Express
- **AI**: OpenRouter API (支援 Gemini, GPT-4, Claude 等模型)
- **部署**: Vercel (Serverless Functions)

## API 端點

### POST /api/generate

生成數學題目

**請求格式:**
```json
{
  "prompt": "Generate a HKDSE math question about..."
}
```

**回應格式:**
```json
{
  "text": "{JSON string of question}",
  "modelUsed": "google/gemini-2.5-flash"
}
```

## 注意事項

1. 需要有效的 OpenRouter API Key 才能使用 AI 生成功能
2. 建議使用 Chrome 或 Firefox 瀏覽器以獲得最佳體驗
3. 直接在瀏覽器打開 HTML 檔案會導致 CORS 錯誤，請使用本地伺服器

## License

MIT

## Author

Andrew (香港兩餸飯關注組版主)
