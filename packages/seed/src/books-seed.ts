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
  { isbn: '9784798125411', title: 'Scala逆引きレシピ', borrowedBy: 's.uzuki@opt.ne.jp' },
  { isbn: '9784621061367', title: '最短経路の本', borrowedBy: null },
  { isbn: '9784798153278', title: 'Akka実践バイブル アクターモデルによる並行・分散システムの実現', borrowedBy: null },
  { isbn: '9784774142043', title: 'Webを支える技術', borrowedBy: null },
  { isbn: '9784897979571', title: 'カンバン', borrowedBy: null },
  { isbn: '9784774193496', title: 'キタミ式イラストIT塾基本情報技術者（平成30年度）', borrowedBy: null },
  { isbn: '9784798125411', title: 'Scala逆引きレシピ', borrowedBy: null },
  { isbn: '9784621061367', title: '最短経路の本', borrowedBy: null },
  { isbn: '9784621045930', title: 'いかにして問題をとくか第11版', borrowedBy: null },
  { isbn: '9784798145037', title: 'Scalaパズル', borrowedBy: null },
  { isbn: '9784274219337', title: '達人プログラマー新装版', borrowedBy: null },
  { isbn: null, title: 'Androidアプリ設計パターン入門', borrowedBy: null },
  { isbn: '9784862760401', title: 'サーバントリーダーシップ', borrowedBy: null },
  { isbn: '9784798126234', title: 'コンピュータアーキテクチャ第5版', borrowedBy: null },
  { isbn: '9784774156545', title: 'コーディングを支える技術 〜成り立ちから学ぶプログラミング作法', borrowedBy: null },
  { isbn: '9784873115658', title: 'リーダブルコード', borrowedBy: null },
  { isbn: '9784774181240', title: '詳解Apache Spark', borrowedBy: null },
  { isbn: '9784621045930', title: 'いかにして問題をとくか第11版', borrowedBy: null },
  { isbn: '9784822298432', title: 'コンピュータの構成と設計（下）第5版', borrowedBy: null },
  { isbn: '9784798128450', title: 'JavaScript Ninjaの極意 : ライブラリ開発のための知識とコーディング', borrowedBy: 'd.fushimi@opt.ne.jp' },
  { isbn: '9784873115658', title: 'リーダブルコード', borrowedBy: null },
  { isbn: '9784822298425', title: 'コンピュータの構成と設計（上）第5版', borrowedBy: 's.uzuki@opt.ne.jp' },
  { isbn: '4910058270781', title: 'Software Design 2018/7', borrowedBy: 's.uzuki@opt.ne.jp' },
].map(({ isbn, title, borrowedBy }) => ({ isbn, title, borrowedBy, updatedAt: new Date(), createdAt: new Date() }));
