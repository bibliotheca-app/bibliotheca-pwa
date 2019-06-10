# front

## Blueprints

Following blueprints are available:
- `feature` (run: `yarn g -- [new_feature]`) - create a blueprint for a new feature. Includes: interface, module, example component.

## ビルド

`REACT_APP_FIREBASE_CONFIG` という環境変数に Firebase の API キーなどを持っている JSON を設定しておく

```ts
type FirebaseConfig = {
  apikey: string;
  authdomain: string;
  databaseurl: string;
  projectid: string;
  storagebucket: string;
  messagingsenderid: string;
  appid?: string;
}
```
