# bibliotheca-pwa

## Description

GSuite のドメイン単位で蔵書を管理するためのウェブアプリ (TODO: 現状はドメインや Firebase プロジェクトが決め打ちになって
いる部分を差し替え可能にする)

- TypeScript
- React
  - Typeless
  - navi
- lerna
- Firebase
  - Auth
  - Hosting
  - Functions
  - Firestore

## Requirements

- Node.js 14.x (Cloud Functions for Firebase のため)
- yarn

## Development

Firebase プロジェクトを切り替えできるように `.firebaserc.example` を参考に `.firebaserc` を作成する

```bash
$ cp .firebaserc{.example,}
```

どのパッケージで開発する場合も、プロジェクトルートで `yarn tsc-w` を実行すること  
(TypeScript でコンパイルが通るかどうかをチェックできる)

フロントエンドの動作を確認しつつ確認するには以下のようにコマンドを実行(型チェックが走らない)

```bash
$ yarn workspace front start
```

## Project の切り替え

```bash
$ firebase use test
$ firebase use prod
```

## デプロイ(test 環境)

```bash
$ yarn build
$ yarn deploy
```

## 初期構築

### gcloud コマンドのインストール & 認証

```bash
gcloud auth login
gcloud auth application-default login
```

### リポジトリの依存解決&firebase 認証&firebase 系設定の構築

```bash
cd path/to/bibliotheca-pwa
yarn install
yarn firebase login
cp .firebaserc{.example,}
cp .envrc{.example,}
cp firebase-config.json{.example,}
cp firestore.rules{.example,}
cp packages/functions/config.{example,test}.json
cp packages/functions/config.{example,prod}.json
# 各種設定ファイルを各自の環境に合わせて更新する
```

以下の手順で取得した認証情報を firebase-config.json に保存する

- firebase コンソールを開く
- 「プロジェクトの設定」画面を開く
- 「マイアプリ」までスクロールし、「Firebase SDK snippet」のラジオボタンの「構成」を選択
- 以下のような js のスニペットが取得できるので、これを元に firebase-config.json を編集する

```
const firebaseConfig = {
  apiKey: "XXXXX",
  authDomain: "XXXXX.firebaseapp.com",
  databaseURL: "https://XXXXX.firebaseio.com",
  projectId: "XXXXX",
  storageBucket: "XXXXX.appspot.com",
  messagingSenderId: "XXXXX",
  appId: "XXXXX"
};
```

### 立ち上げる

```bash
source .envrc
cd packages/front/
yarn start
```

### direnv の設定（optional, recomended）

.envrc を自動的に source してくれる CLI ツール  
ref. https://github.com/direnv/direnv

上記手順で作成した `.envrc` を自動で source してくれるので便利です
