# bibliotheca-pwa

## Requirements

- Node.js 8.x (Cloud Functions for Firebase のため)

## Development

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

## デプロイ

```bash
$ yarn build
$ yarn deploy
```

## Links

- 本番: https://bibliotheca-pwa.firebaseapp.com
- テスト: https://bibliotheca-test.firebaseapp.com
