# techbook-template

Remark・Rehypeのカスタムタグとカスタムプラグインで、Re:Viewと同等機能をVivlioStyleで実現するプロジェクト

> [!IMPORTANT]
> 現在、ベータ版的なプロジェクトです。執筆活動にともなって順次、必要な機能や不具合修正などを適用します。
> Issueに何か不具合などあれば記載ください。

## Overview

各ディレクトリ構成の説明と、各ファイルの概要を説明します。

```txt
techbook-template
├── biome.json <-- biome（formatter、lint）の設定ファイル
├── docs <-- Markdownファイルを置くディレクトリ
│   ├── _finally.md <-- おわりにのMarkdownファイル
│   └── _introduction.md <-- はじめにのMarkdownファイル
├── images <-- 画像を置くディレクトリ
│   ├── back-cover.png <-- 裏表紙の画像
│   ├── chat-left-icon.png <-- チャットのキャラ(左)のアイコン
│   ├── chat-right-icon.png <-- チャットのキャラ(右)のアイコン
│   ├── end-cover.png <-- 扉裏表紙の画像
│   ├── front-cover.png <-- 表紙の画像
│   └── start-cover.png <-- 扉表紙の画像
├── techbook.code-workspace <-- VS Codeのワークスペースファイル
├── techbook.config.ts <-- 設定ファイル
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── dist <-- 出力ディレクトリ
├── src
│   ├── appendix-template.html <-- Appendixのテンプレート
│   ├── appendix.ts <-- Appendixカスタムタグのコード
│   ├── breakBefore.ts <-- breakBeforeカスタムタグのコード
│   ├── chapter-template.html <-- 本文のテンプレート
│   ├── chat.ts <-- Chatのカスタムタグのコード
│   ├── codeBlockApplyTitlePlugin.ts <-- コードブロックにタイトルを追加するプラグイン
│   ├── colophon-template.html <-- 奥付けのテンプレート
│   ├── colophon.ts <-- 奥付けを作成するコード
│   ├── constants.ts <-- 定数
│   ├── cover-template.html <-- 表紙や裏表紙のテンプレート
│   ├── cover.ts <-- 表紙や裏表紙を作成するコード
│   ├── docref.ts <-- リファレンスタグのカスタムタグのコード
│   ├── footnote.ts <-- 注釈のカスタムタグのコード
│   ├── generateVivlioStyleConfig.ts <-- vivliostyle.config.cjsを生成するコード
│   ├── global.css <-- グローバルCSS
│   ├── imageApplyAttributesFromTitlePlugin.ts <-- 画像にタイトルや属性を設定するプラグイン
│   ├── imageAttributesToTitlePlugin.ts <-- 画像のaltテキストから画像の属性とタイトルを取得するプラグイン
│   ├── introduction-template.html <-- はじめにのテンプレート
│   ├── introduction.ts <-- はじめにを作成するコード
│   ├── main.ts <-- 各TypeScriptファイルを読み込んでHTMLを生成する
│   ├── mermaidApplyTitlePlugin.ts <-- Mermaidにタイトルを追加するプラグイン
│   ├── profile-template.html <-- プロフィールのテンプレート
│   ├── profile.ts <-- プロフィールを作成するコード
│   ├── split.ts <-- splitカスタムタグのコード
│   ├── switch.ts <-- switch文カスタムタグのコード
│   ├── tableApplyTitlePlugin.ts <-- テーブルにタイトルを追加するプラグイン
│   ├── toc.ts　<-- 目次を作成するコード
│   └── viewer.ts　<-- VivlioStyle Viewerのみを起動するコード
├── tailwind.config.ts
├── tsconfig.json
└── vivliostyle.config.cjs <-- VivlioStyleの設定ファイル（自動生成）
```

## Demo

TODO: 

## Requirement

プロジェクトを実行するために必要な前提条件や依存関係を示します。

- macOS Sonoma / Ventura が動くMac
- Chromeブラウザをインストール済み（[インストール方法](https://support.google.com/chrome/answer/95346?hl=ja#zippy=%2Cmac)）
- Node.jsをインストール済み（[インストール方法](https://nodejs.org/en/download)）
- VS Codeをインストール済み（[インストール方法](https://code.visualstudio.com/download)）
- 使用フォント（[M PLUS Rounded 1c](https://fonts.google.com/specimen/M+PLUS+Rounded+1c)）

Appleシリコン版Macや、Intel版Macの場で動作確認しています。スペック的に余裕がない`MacBook (Retina, 12-inch, 2017)`などの低スペックなMacBookでは動作が遅い場合があります。（最近話題のCeleron N100シリーズのほぼ半分のベンチマークスコアなので当然な気もします。）

なるべくスペックに余裕があるマシンでの実行をオススメします。

また、Windows・Linuxに固有の機能はないので動作するとは思いますが動作確認はできていません、もし動かない場合はIssueを立てていただければ対応いたします。

## Install and Usage

プロジェクトのインストール方法と使い方を説明します。

### プロジェクトを作成する

1. https://github.com/kght6123/techbook-template をブラウザで開いて、`Use this template`ボタンをクリックし、`Create a new repository`を選択して、新しいリポジトリを作成してください。

2. 次にリポジトリをクローンして、VS Codeを開きメニューの「ファイル」→「ファイルでワークスペースを開く」からクローンしたフォルダー内の`techbook.code-workspace`を開いてください。

### 設定ファイルを変更する

`techbook.config.ts`を開いて、`title`や`author`などの情報を変更してください。

```ts
export default {
  size: "JIS-B5", // B5判と"105mm 173mm"（新書）サイズのみ対応
  title: "(本のタイトル)",
  author: "(著者名)",
  publisher: "(サークル名)",
  printer: "(印刷所名)",
  editions: [
    {
      name: "初版発行",
      datetime: "2024-05-21",
      datetimeView: "2024年5月21日",
      version: "v1.0.0",
    },
  ],
  profiles: [
    {
      position: "(役職など)",
      name: "(名前)",
      description: `自己紹介文を書く<br />
brタグで改行ができます。`,
      image: "../images/(プロファイル画像を置いて指定する).png",
    },
  ],
  cover: {
    // TODO: 表紙画像が必要な場合は置いて指定してください
    // front: "front-cover.png",
    // back: "back-cover.png",
    // start: "start-cover.png",
    // end: "end-cover.png",
  },
  copyright: "(コピーライトを書く)",
};
```

### プロジェクトをビルドする

下記のnpmコマンドを実行すると、プロジェクトのプレビューやビルドができます。

```sh
npm i # 依存関係をインストール
npx playwright-core install --with-deps chromium # Chromiumブラウザをインストール（PDF出力向け）
npm run dev # 開発モードでプレビュー（Ctrl＋Cで停止）
npm run build # 本番モードでビルド（PDF出力）
```

`npm run dev`を実行すると、Chromeブラウザが立ち上がってプレビューが表示されます。プレビューが表示されない場合は一度Ctrl＋Cで停止して再度実行してください。

それでも表示されない場合は、`3000`や`3001`などのポートが他のアプリケーションで使用されていないか確認してください。

### Markdownファイルの配置

docsディレクトリにMarkdownファイルを配置してください。

- Markdownファイルは1ファイル＝1章になります
- Markdownファイルの並び順が章の順番になるので、ファイル名の先頭に連番を入れる方がオススメです。
- frontmatterを設定することで、章ごとの設定を変更できます。

```md
---
description:
  VivlioStyleについて、利用しているツールやサービスを中心に解説します。
color:
  primary:
    "500": "var(--tw-rose-500)"
    "400": "var(--tw-rose-400)"
    "200": "var(--tw-rose-200)"
    "50": "var(--tw-rose-50)"
columns: true
---

# VivlioStyleとは？

VivlioStyleとは、Web標準技術によって、電子出版やWeb出版を実現するためのオープンソースの組版システムです。

主なツールやサービスとしては次の3つがあります。
```

注意点としては、必ず`#`で始まるH1ヘッダーを1つだけ書くようにしてください。このH1ヘッダーはタイトルとして扱われます。

### 画像ファイルについて

スクリーンショット画像など、その他必要な画像はimagesフォルダーに配置してください。表紙や裏表紙、チャットのアイコン画像などはあらかじめ、ダミーの画像ファイルが格納されています。

```txt
├── images
│   ├── back-cover.png <-- 裏表紙の画像
│   ├── chat-left-icon.png <-- チャットのキャラ(左)のアイコン
│   ├── chat-right-icon.png <-- チャットのキャラ(右)のアイコン
│   ├── end-cover.png <-- 扉裏表紙の画像
│   ├── front-cover.png <-- 表紙の画像
│   └── start-cover.png <-- 扉表紙の画像
```

ダミーの画像ファイルは自分の画像に上書きしてください。


## Contribution

プロジェクトに貢献する方法を記載します。

1. フォークする
2. フィーチャーブランチを作成する (git checkout -b feature/NewFeature)
3. 変更をコミットする (git commit -am 'Add new feature')
4. プッシュする (git push origin feature/NewFeature)
5. プルリクエストを作成する

## Licence

MITライセンスの下で公開されています。詳細については LICENSE ファイルを参照してください。

## Author

プロジェクトの著者やメインの貢献者の情報を記載します。

- kght6123

## References

[docs/99-1_samples.md](./docs/99-1_samples.md)を参照してください。

## Print

プリント出力のための設定や注意事項を記載します。

- 後日、KDPへの対応を予定しています。

## Note

このプロジェクトに関する追加の注意事項や補足情報を記載します。

### VivlioStyle Viewerの実行について

「VivlioStyle Viewer」はHTMLやMarkdownを読み込んで組版結果をプレビューします。

VivlioStyle Viewerを利用するには以下の方法があります：

1. VivlioStyle Viewerをインストールして、Node.jsから実行します。
2. VivlioStyle CLIを使って実行します。
3. VivlioStyleのサイトで公開されている`vivliostyle-viewer-*.zip`をダウンロードして実行します。

VivlioStyle CLIを使わずに、`npm install @vivliostyle/viewer`でインストールし、Webサーバー（今回は「h3」を利用）を設定して利用しています。

### ブラウザを自動リロードする

プレビューのためにBrowsersyncを利用して、MarkdownやCSSの更新時にブラウザを自動リロードさせることができます。

次のコマンドを実行すると、Chromeブラウザが開き組版のプレビューが表示されます。

```sh
npx browser-sync start --proxy 'localhost:3000' --files="dist/lockfile" --startPath="/index.html#src=/dist/publication.json&bookMode=true&renderAllPages=true&style=/dist/global.css" --browser "google chrome"
```

このコマンドはSafariなどの他のブラウザでも可能ですが、今回はPDFの出力結果との互換性なども考慮してChromeブラウザを利用しています。

また、`npm run dev:sync`で容易に呼び出しを可能としています。

## ToDo

- [ ] デモサイトの作成をする
- [ ] 変更されたファイルのみを上書き更新をする
- [ ] Handlebarsで実装されたカスタムタグをRehype/Remarkプラグインとして実装する（Markdownとしての互換性の向上）
- [ ] 書面デザインをWCAG2.1（とくにコントラスト面）への対応

## ChangeLog

- v0.1 4/26 プロジェクト作成
- v0.2 7/10 Windowsで起動しない問題を修正 #7、Mermaid生成の内部処理を公式のものに変更
