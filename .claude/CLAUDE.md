# techbook-template プロジェクト

techbook-template CLI（VivlioStyle + Markdown）を使った日本語技術書制作プロジェクトです。

## 技術スタック

- **VivlioStyle** - Web標準技術による電子出版・PDF生成
- **Markdown** - コンテンツ記述（Remark/Rehype拡張）
- **Handlebars.js** - カスタムテンプレート構文
- **TypeScript** - 設定ファイル記述
- **Biome** - フォーマッタ・リント
- **Node.js** - ランタイム（Volta でバージョン管理）

## コマンド

```sh
npm run dev    # プレビュー表示（自動リロード、Chrome が起動する）
npm run build  # 本番 PDF 生成
npm run kdp    # KDP（Kindle Direct Publishing）用 PDF 生成
npm run check  # Biome でコードチェック・自動修正
```

## ディレクトリ構造

```
.
├── docs/               # Markdown 章ファイル群（コンテンツ）
├── images/             # 画像ファイル群
├── dist/               # ビルド出力（Git 管理外、自動生成）
├── techbook.config.ts  # 本のメタデータ設定（タイトル・著者・サイズなど）
├── biome.json          # Biome 設定
└── .claude/
    ├── CLAUDE.md       # このファイル
    ├── rules/          # 執筆・開発ルール
    └── skills/         # カスタムスキル
```

## 重要なルール

詳細は `.claude/rules/` 内のファイルを参照してください。

- **Markdownコンテンツ執筆ルール**: `.claude/rules/markdown.md`
- **開発・執筆ワークフロー**: `.claude/rules/workflow.md`

## techbook.config.ts の主な設定項目

| 項目 | 説明 |
|------|------|
| `size` | `"JIS-B5"` または `"105mm 173mm"`（新書） |
| `title` | 本のタイトル |
| `author` | 著者名 |
| `editions` | 版情報（発行日・バージョン） |
| `cover` | 表紙画像ファイル名 |
| `appendix` | 付録ページを有効にするか |
