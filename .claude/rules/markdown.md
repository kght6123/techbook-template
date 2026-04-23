# Markdownコンテンツ執筆ルール

techbook-template での Markdown 執筆に関するルールです。

## ファイル配置・命名

- 章ファイルは `docs/` ディレクトリに配置する
- ファイル名は `{番号}-{内容}.md` 形式（例: `01-introduction.md`, `02-setup.md`）
- `_` 接頭辞（例: `_introduction.md`）は特殊ページ用（はじめに・さいごに等）
- 番号の大きいファイルほど後方の章になる

## frontmatter（任意）

ファイル冒頭に YAML frontmatter を記述できる:

```yaml
---
description: 章の説明文
columns: false   # 2段組か否か（省略時は true）
color:           # アクセントカラーのカスタマイズ（任意）
  primary:
    "500": "var(--tw-blue-500)"
    "400": "var(--tw-blue-400)"
    "200": "var(--tw-blue-200)"
    "50": "var(--tw-blue-50)"
---
```

## ヘッダー構造

- `#`（H1）: ファイル冒頭に **1つだけ** 書く（章タイトル）
- H1 直後の1行: **サブタイトル**として扱われる
- `##`（H2）以降: 通常の節・小節

```markdown
# 章タイトル

これはサブタイトルとして扱われます。

## 節タイトル（本文はここから）

本文内容...
```

## コードブロック

### タイトルの付け方

```markdown
<!-- title: タイトル（スペースあり） -->
\```js
console.log('Hello');
\```

\```js title:タイトル（スペースなし）
console.log('Hello');
\```
```

### 行アノテーション

```js
const a = 1; // [!code highlight]   ← ハイライト
const b = 2; // [!code ++]          ← 追加行（緑）
const c = 3; // [!code --]          ← 削除行（赤）
const d = 4; // [!code error]       ← エラー行
const e = 5; // [!code warning]     ← 警告行
```

### 行番号・範囲指定ハイライト

````markdown
```html {3,6-7}
<div>...</div>
```
````

### 単語ハイライト

````markdown
```js /Hello/
console.log('Hello world');
```
````

または HTML コメント:

````markdown
<!-- title: Hello のみハイライト -->
```js
console.log('Hello world'); <!-- [!code word:Hello] -->
```
````

## 画像

```markdown
![alt text](../images/filename.png)
![alt text,width:200px](../images/filename.png)
![alt text,height:100px](../images/filename.png)
![alt text,width:200px,height:100px](../images/filename.png)
![alt text,className:qrcode](../images/filename.png)
```

- 画像ファイルは `images/` ディレクトリに配置
- Markdown からは `../images/` で参照する

## QRコード

```markdown
<!-- qrcode: https://example.com/ -->
```

## 脚注

3つの記法が使える:

```markdown
<!-- Handlebars 形式（行末に番号付き脚注） -->
Google{{footnote 'https://google.co.jp'}}で検索する。

<!-- Handlebars インライン形式 -->
Google{{footnote-inline 'https://google.co.jp'}}で検索する。

<!-- HTML span 形式 -->
この文章は<span class="footnote">脚注テキスト</span>のテストです。

<!-- Markdown 標準記法 -->
Footnote [^1]
[^1]: 脚注の内容
```

## 改ページ

```markdown
{{page-break}}   ← 改ページ
{{left-break}}   ← 左ページ先頭に移動
{{right-break}}  ← 右ページ先頭に移動
```

## 相互参照（Handlebars）

```markdown
{{chapref 'ファイル名（拡張子なし）'}}
{{headref 'ファイル名' 'ヘッダーテキスト'}}
{{imageref 'ファイル名' 'alt-text'}}
{{coderef 'ファイル名' 'コードタイトル'}}
{{tableref 'ファイル名' 'テーブルキャプション'}}
```

## チャット形式

```markdown
{{chat
  (chat-header 'チャットのタイトル')
  (chat-left 'メッセージ' 'キャラ名L' 'balloon-indigo-200' 'chat-left-icon.png')
  (repeat-chat-left '連続メッセージ' 'balloon-indigo-200')
  (chat-right 'メッセージ' 'キャラ名R' 'balloon-fuchsia-200' 'chat-right-icon.png')
  (repeat-chat-right '連続メッセージ' 'balloon-fuchsia-200')
}}
```

バルーンカラーは TailwindCSS のカラークラス（例: `balloon-indigo-200`, `balloon-fuchsia-200`）

## 付録タグ

```markdown
{{appendix filePath 'anchor-id' 'タイトル'}}
（hidden版）{{appendix-hidden filePath 'anchor-id' 'タイトル'}}
```

## 図表

### Mermaid

```markdown
\```mermaid
flowchart LR
    A[Start] --> B{Decision?}
\```
```

対応する図種: `flowchart`, `sequenceDiagram`, `gantt`, `classDiagram`, `stateDiagram-v2`, `erDiagram`, `pie`

Mermaid コードブロックにもタイトルを付けられる:

```markdown
<!-- title: フローチャートのサンプル -->
\```mermaid
flowchart LR
    A --> B
\```
```

### PlantUML

```markdown
\```plantuml タイトル
class User {
  +String name
}
\```
```

## テーブル

```markdown
<!-- title: テーブルのキャプション -->
| 自動 | 左揃え | 右揃え | 中央揃え |
| - | :- | -: | :-: |
| 1 | 2 | 3 | 4 |
```

## その他の構文

```markdown
~~取り消し線~~      ← 打ち消し線

* [ ] タスクリスト（未完了）
* [x] タスクリスト（完了）

[テキスト](https://example.com)  ← 外部リンク（別タブで開く）
```
