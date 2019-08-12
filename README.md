# bibliotheca-pwa

## Description

GSuite のドメイン単位で蔵書を管理するためのウェブアプリ
(TODO: 現状はドメインや Firebase プロジェクトが決め打ちになっている部分を差し替え可能にする)

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

- Node.js 8.x (Cloud Functions for Firebase のため)
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

## Links

- 本番: https://bibliotheca-pwa.firebaseapp.com
- テスト: https://bibliotheca-test.firebaseapp.com
