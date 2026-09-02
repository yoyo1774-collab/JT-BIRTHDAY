# LOVE SIGNAL // 0917

Pochacco-inspired Cassette Futurism 私人紀念網站。密碼預設為 `0917`。

## 啟動

```bash
pnpm install
pnpm dev
```

## 替換內容

- 所有文字、生日密碼、照片清單：`src/content.ts`
- 照片放在 `public/photos/`，檔名需與 `src/content.ts` 相同
- 最後彩蛋主照片：`public/photos/final.jpg`
- Pochacco 素材與 Cassette Futurism 生成圖：`public/pochacco/`
- Neo-Tokyo 紅色機車主視覺：`public/pochacco/neo-tokyo-rider.png`

照片不存在時，網站會自動顯示卡帶風格佔位卡。正式發布前，建議壓縮照片、移除 EXIF 定位資訊，並確認角色圖片及素材授權。
