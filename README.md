# Props Lab Event LP

別府・大分エリアで開催する街コン・婚活イベント「Props Lab Event」の公式LP。  
本番URL: <https://event.props-lab.com>

---

## 構成

```
.
├── public/                       Cloudflare Workers の配信ルート
│   ├── index.html                ランディングページ本体
│   ├── 404.html                  404 ページ
│   ├── robots.txt                検索エンジン向け
│   ├── sitemap.xml               サイトマップ
│   ├── _headers                  キャッシュ・セキュリティヘッダ
│   ├── .assetsignore             Workers Static Assets の除外設定
│   └── assets/
│       ├── hero.{webp,jpg}       ヒーロー画像（1600x900）
│       ├── beppu.{webp,jpg}      別府エリア写真
│       ├── oita.{webp,jpg}       大分エリア写真
│       ├── future.{webp,jpg}     今後エリア写真
│       ├── ogp.jpg               OGP用画像（1200x630）
│       ├── favicon.svg           favicon
│       └── originals/            最適化前のオリジナルPNG（バックアップ）
├── scripts/
│   ├── serve.mjs                 ローカル静的サーバ（port 5173）
│   └── optimize-images.mjs       sharp による画像最適化
├── wrangler.jsonc                Cloudflare Workers 設定
├── package.json
└── README.md
```

---

## ローカル開発

```bash
npm install
npm run dev          # http://localhost:5173/
```

依存はなく、`public/index.html` をブラウザで直接開くだけでも動きます（ビルド不要）。

---

## 画像最適化の再実行

`public/assets/originals/` の元画像から再生成します。

```bash
npm run optimize:images
```

WebP + JPG を `public/assets/` に出力します（品質: WebP 76-78、JPG 78-80）。

---

## 本番デプロイ

### 通常運用：GitHub auto-deploy

`main` ブランチに push すれば Cloudflare が自動でビルド・配信します（約2分）。

```bash
git add .
git commit -m "..."
git push origin main
```

リポジトリ: <https://github.com/propslab/propslab-event-lp>

### 手動デプロイ（緊急時のみ）

```bash
npx wrangler login          # 初回のみ
npm run deploy
```

---

## 本番環境

| 項目 | 内容 |
|------|------|
| ホスティング | Cloudflare Workers（Static Assets） |
| 本番URL | https://event.props-lab.com |
| DNS | Cloudflare（NS: `ned.ns.cloudflare.com` / `sarah.ns.cloudflare.com`） — `event` の CNAME 追加 |
| ドメイン登録 | Squarespace Domains（旧 Google Domains から移管済み） |
| 業務メール | Google Workspace `hayama@props-lab.com` |

### ヘッダ・キャッシュ

`public/_headers` に記述（Workers Static Assets が読み取り）：

- `/assets/*` → `Cache-Control: public, max-age=31536000, immutable`（1年）
- 全ページ → `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## カスタマイズメモ

- カラー: `:root` の CSS 変数 (`--navy` / `--orange` / `--beige`) を変更
- 開催予定: `#schedule` セクション内 `.schedule-empty` を `.schedule-list > .schedule-card` に差し替え
- お問い合わせ: 現状 `mailto:hayama@props-lab.com`。フォーム化する場合は `#contact` の `href` を更新
- 構造化データ: `<script type="application/ld+json">` を実情報に合わせて更新

---

## ライセンス

© Props Lab
