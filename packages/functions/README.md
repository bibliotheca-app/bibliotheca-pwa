## functions

- notifySlack: Slack への通知をする部分に必要なトークンなどを設定する必要がある
  - `slack.token`
  - `slack.notify_slack_webhook_url`: 貸し出しなどを通知する Channel への Webhook URL
- buildBookList: 本の一覧をキャッシュする。環境構築の初回は手動で走らせておく

### Firebase の Environment Configuration

- https://firebase.google.com/docs/functions/config-env

本番環境とテスト環境用にトークンなどを設定しておく必要がある。 Cloud Functions がデプロイされる前に手動で設定しておく必要がある。  
(設定を変更した場合、それを有効にするためには Cloud Functions の再デプロイも必要)

[この issue](https://github.com/firebase/firebase-tools/issues/406) で議論されているように、現状素直に JSON などで設定することができない。　 
ここでは任意のプレフィックスの後ろであれば JSON を受け付けるという特性を活用し、 `fn` の下に `config.{prod,test}.json` の内容を設定するという手法を用いている。

#### 設定の編集

```bash
$ cp config.{example,prod,test}.json
$ vim -p config.{prod,test}.json
```

#### 設定のデプロイ

```bash
$ yarn workspace functions config:prod
$ yarn workspace functions config:test
```
