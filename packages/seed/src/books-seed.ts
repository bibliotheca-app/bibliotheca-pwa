// todo: share interface
export interface BookBody {
  isbn: string | null;
  title: string;
  borrowedBy: string | null;
  updatedAt: Date;
  createdAt: Date;
}

// prettier-ignore
export const books: BookBody[] = [
  { isbn: '9784798125411', title: 'Scala逆引きレシピ', borrowedBy: 's.uzuki@opt.ne.jp', updatedAt: '2019-05-02T10:02:27.620Z', createdAt: '2019-04-30T10:20:27.292Z' },
  { isbn: '9784621061367', title: '最短経路の本', borrowedBy: null, updatedAt: '2019-04-30T10:20:37.292Z', createdAt: '2019-04-30T10:20:37.292Z' },
  { isbn: '9784798153278', title: 'Akka実践バイブル アクターモデルによる並行・分散システムの実現', borrowedBy: null, updatedAt: '2019-04-30T10:20:30.292Z', createdAt: '2019-04-30T10:20:30.292Z' },
  { isbn: '9784774142043', title: 'Webを支える技術', borrowedBy: null, updatedAt: '2019-04-30T10:20:39.292Z', createdAt: '2019-04-30T10:20:39.292Z' },
  { isbn: '9784897979571', title: 'カンバン', borrowedBy: null, updatedAt: '2019-04-30T10:20:43.292Z', createdAt: '2019-04-30T10:20:43.292Z' },
  { isbn: '9784774193496', title: 'キタミ式イラストIT塾基本情報技術者（平成30年度）', borrowedBy: null, updatedAt: '2019-04-30T10:20:35.292Z', createdAt: '2019-04-30T10:20:35.292Z' },
  { isbn: '9784798125411', title: 'Scala逆引きレシピ', borrowedBy: null, updatedAt: '2019-04-30T10:20:29.292Z', createdAt: '2019-04-30T10:20:29.292Z' },
  { isbn: '9784621061367', title: '最短経路の本', borrowedBy: null, updatedAt: '2019-04-30T10:20:36.292Z', createdAt: '2019-04-30T10:20:36.292Z' },
  { isbn: '9784621045930', title: 'いかにして問題をとくか第11版', borrowedBy: null, updatedAt: '2019-04-30T10:20:25.292Z', createdAt: '2019-04-30T10:20:25.292Z' },
  { isbn: '9784798145037', title: 'Scalaパズル', borrowedBy: null, updatedAt: '2019-04-30T10:20:31.292Z', createdAt: '2019-04-30T10:20:31.292Z' },
  { isbn: '9784274219337', title: '達人プログラマー新装版', borrowedBy: null, updatedAt: '2019-04-30T10:20:42.292Z', createdAt: '2019-04-30T10:20:42.292Z' },
  { isbn: null,            title: 'Androidアプリ設計パターン入門', borrowedBy: null, updatedAt: '2019-05-02T10:01:26.752Z', createdAt: '2019-04-29T15:00:00.000Z' },
  { isbn: '9784862760401', title: 'サーバントリーダーシップ', borrowedBy: null, updatedAt: '2019-04-30T10:20:44.292Z', createdAt: '2019-04-30T10:20:44.292Z' },
  { isbn: '9784798126234', title: 'コンピュータアーキテクチャ第5版', borrowedBy: null, updatedAt: '2019-04-30T10:20:32.292Z', createdAt: '2019-04-30T10:20:32.292Z' },
  { isbn: '9784774156545', title: 'コーディングを支える技術 〜成り立ちから学ぶプログラミング作法', borrowedBy: null, updatedAt: '2019-04-30T10:20:38.292Z', createdAt: '2019-04-30T10:20:38.292Z' },
  { isbn: '9784873115658', title: 'リーダブルコード', borrowedBy: null, updatedAt: '2019-04-30T10:20:41.292Z', createdAt: '2019-04-30T10:20:41.292Z' },
  { isbn: '9784774181240', title: '詳解Apache Spark', borrowedBy: null, updatedAt: '2019-04-30T10:20:28.292Z', createdAt: '2019-04-30T10:20:28.292Z' },
  { isbn: '9784621045930', title: 'いかにして問題をとくか第11版', borrowedBy: null, updatedAt: '2019-04-30T10:20:26.292Z', createdAt: '2019-04-30T10:20:26.292Z' },
  { isbn: '9784822298432', title: 'コンピュータの構成と設計（下）第5版', borrowedBy: null, updatedAt: '2019-04-30T10:20:34.292Z', createdAt: '2019-04-30T10:20:34.292Z' },
  { isbn: '9784798128450', title: 'JavaScript Ninjaの極意 : ライブラリ開発のための知識とコーディング', borrowedBy: 'd.fushimi@opt.ne.jp', updatedAt: '2019-05-02T10:03:16.991Z', createdAt: '2019-04-30T14:23:06.497Z' },
  { isbn: '9784873115658', title: 'リーダブルコード', borrowedBy: null, updatedAt: '2019-04-30T10:20:40.292Z', createdAt: '2019-04-30T10:20:40.292Z' },
  { isbn: '9784822298425', title: 'コンピュータの構成と設計（上）第5版', borrowedBy: 's.uzuki@opt.ne.jp', updatedAt: '2019-05-02T10:02:29.377Z', createdAt: '2019-04-30T10:20:33.292Z' },
  { isbn: '4910058270781', title: 'Software Design 2018/7', borrowedBy: 's.uzuki@opt.ne.jp', updatedAt: '2019-05-02T10:49:40.530Z', createdAt: '2019-04-28T15:00:00.000Z' },
].map(({ isbn, title, borrowedBy, updatedAt, createdAt }) => ({ isbn, title, borrowedBy, updatedAt: new Date(updatedAt), createdAt: new Date(createdAt) }));
