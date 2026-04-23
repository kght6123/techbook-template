# 開発・執筆ワークフロールール

## 基本的な執筆フロー

1. `npm run dev` でプレビューを起動する（Chrome が自動で開く）
2. `docs/` 内の Markdown ファイルを編集する
3. プレビューで表示を確認しながら執筆を進める
4. `npm run build` で最終的な PDF を生成する

## 新章を追加するとき

1. `docs/` ディレクトリに新しい `.md` ファイルを作成する
2. ファイル名は `{番号}-{内容}.md` 形式にする（例: `03-advanced.md`）
3. ファイル先頭に H1 ヘッダーを書く（章タイトル）
4. H1 の次の行にサブタイトルを書く（任意）

## TypeScript 設定ファイルを編集するとき

`techbook.config.ts` などを変更した場合:

```sh
npm run check  # Biome でチェック・自動修正
```

## Git 管理

以下のファイル・ディレクトリは Git 管理対象外（.gitignore で除外済み）:

- `node_modules/`
- `dist/` （ビルド出力）
- `vivliostyle.config.cjs` （自動生成）
- `dist/lockfile`, `src/lockfile`
- `*.pdf` （生成 PDF）

コミット対象: `docs/`, `images/`, `techbook.config.ts`, `package.json`, `biome.json`

## 画像ファイルの管理

- 画像は `images/` ディレクトリに配置する
- Markdown からは `../images/ファイル名` で参照する
- 表紙画像: `front-cover.png`, `back-cover.png`, `start-cover.png`, `end-cover.png`
- アイコン画像: `chat-left-icon.png`, `chat-right-icon.png`

## 出力形式

| コマンド | 出力 | 用途 |
|---------|------|------|
| `npm run build` | 通常 PDF | 入稿・配布用 |
| `npm run kdp` | KDP 対応 PDF | Amazon KDP 入稿用 |
| `npm run dev` | ブラウザプレビュー | 執筆・確認用 |

## ページサイズ設定

`techbook.config.ts` の `size` プロパティで設定:

- `"JIS-B5"` - B5判（同人誌・技術書典向け）
- `"105mm 173mm"` - 新書サイズ
