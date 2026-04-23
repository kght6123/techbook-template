---
name: fix-techbook-template-cli
description: >-
  techbook-template-cli の不具合修正・機能追加のワークフロー。リポジトリの確認・cloneからブランチ作成、ビルド、ローカルテスト、PR提出、バージョン更新まで一貫して対応する。
---

techbook-template-cli の修正を以下のフェーズで進めてください。

---

## フェーズ1: リポジトリの確認・準備

### リポジトリの場所をユーザーに確認する

作業前に以下を確認する:

1. **techbook-template-cli のローカルパス**
   - すでに clone 済みの場合はそのパスを教えてもらう
   - ない場合は clone 先ディレクトリを確認して以下を実行:
     ```bash
     git clone https://github.com/kght6123/techbook-template-cli {指定されたパス}
     ```

2. **techbook-template のローカルパス**（バージョン更新時に必要）
   - すでに clone 済みの場合はそのパスを教えてもらう
   - ない場合は clone 先ディレクトリを確認して以下を実行:
     ```bash
     git clone https://github.com/kght6123/techbook-template {指定されたパス}
     ```

3. **このプロジェクト（techbook）のローカルパス**（ローカルテスト・バージョン更新時に必要）

### 依存パッケージのインストール

```bash
cd {techbook-template-cli のパス}
npm install
```

---

## フェーズ2: 修正ブランチの作成と実装

### ブランチを main から作成する

```bash
cd {techbook-template-cli のパス}
git checkout main
git pull
git checkout -b fix/問題の内容  # または feat/機能名
```

### 修正を実装する

修正対象は主に `src/` 以下:

| ファイル | 役割 |
|---------|------|
| `src/chapter-template.html` | チャプターカバー・本文レイアウト |
| `src/introduction-template.html` | はじめにページ |
| `src/cover-template.html` | 表紙 |
| `src/colophon-template.html` | 奥付 |
| `src/global.css` | グローバルスタイル |
| `src/split.ts` | split Handlebars ヘルパー |
| `src/index.ts` | エントリーポイント・プロセッサ設定 |
| `src/main.ts` | メイン処理 |

---

## フェーズ3: ビルドとローカルテスト

### ビルドする

```bash
cd {techbook-template-cli のパス}
npm run build
```

ビルド成功の確認: `✔ Build succeeded for techbook-template-cli` が表示されること
（WARNING が出ても dist が生成されていれば成功）

### このプロジェクトの node_modules に反映してローカルテストする

```bash
# ビルド成果物をコピー
cp {techbook-template-cli のパス}/dist/index.mjs \
   {このプロジェクトのパス}/node_modules/techbook-template-cli/dist/index.mjs

# 変更した HTML/CSS テンプレートも都度コピー（変更したファイルのみ）
cp {techbook-template-cli のパス}/src/変更したファイル \
   {このプロジェクトのパス}/node_modules/techbook-template-cli/src/変更したファイル
```

### プレビューで動作確認する

```bash
cd {このプロジェクトのパス}
npm run dev
```

ブラウザで表示を確認して修正内容を検証する。

---

## フェーズ4: コミット・PR提出（techbook-template-cli）

### コミットする

```bash
cd {techbook-template-cli のパス}
git add src/
git commit -m "fix: 問題の概要を簡潔に説明"
# または
git commit -m "feat: 追加機能の概要を簡潔に説明"
```

### push して PR を提出する

```bash
git push -u origin ブランチ名

gh pr create \
  --title "fix: 問題の概要" \
  --body "..."
```

PR の body には以下を含める:
- 問題の概要・再現条件
- 修正内容の説明
- 後方互換性への影響
- テスト手順のチェックリスト

---

## フェーズ5: リリース後のバージョン更新

PR がマージされ新バージョン（例: `v0.15-Release`）がリリースされたら、以下の2箇所を更新する。

### リリースバージョンの確認

```bash
cd {techbook-template-cli のパス}
gh release list --limit 5
```

### このプロジェクトを更新する

`{このプロジェクトのパス}/package.json` の `techbook-template-cli` のバージョンを更新する:

```json
"techbook-template-cli": "github:kght6123/techbook-template-cli#v0.15-Release"
```

その後 `npm install` を実行して `node_modules` を更新する。

### techbook-template を更新して PR 提出する

```bash
cd {techbook-template のパス}
git checkout main && git pull
git checkout -b update/techbook-template-cli-vX.XX
```

`package.json` の `techbook-template-cli` のバージョンを更新:

```json
"techbook-template-cli": "github:kght6123/techbook-template-cli#v0.15-Release"
```

```bash
git add package.json
git commit -m "chore: techbook-template-cli を vX.XX に更新"
git push -u origin update/techbook-template-cli-vX.XX

gh pr create \
  --title "chore: techbook-template-cli を vX.XX に更新" \
  --body "..."
```

---

## 関連リポジトリ

| リポジトリ | GitHub |
|-----------|--------|
| techbook-template-cli | `https://github.com/kght6123/techbook-template-cli` |
| techbook-template | `https://github.com/kght6123/techbook-template` |
