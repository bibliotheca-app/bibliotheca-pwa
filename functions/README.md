## functions

- notifySlack: Slack への通知をする部分で GCP の Cloud Functions 側から無理やり環境変数を食わせている
  - `SLACK_TOKEN`
  - `NOTIFY_SLACK_WEBHOOK_URL`
- buildBookList: 本の一覧をキャッシュする。環境構築の初回は手動で走らせておく
