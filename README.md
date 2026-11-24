# Fee Calculator Suite ― 本番公開用静的サイト（tallyfee.com）

マーケットプレイス手数料・KDPロイヤルティ・ソフトウェア料金の計算スイート。**https://tallyfee.com で公開中**。計算はすべてクライアント側 JavaScript で完結し、入力は外部送信しない。

- リポジトリ：`taka19980303-oss/tallyfee`（GitHub）。このフォルダの中身を push すると Cloudflare Pages が自動デプロイする。
- 料率・価格はすべて各プラットフォーム／ベンダーの公式ページで確認済みのものだけを実装。確認できないものは推測で入れていない。確認日は各ページに明記。
- 全ページに英日ツインがある（`/ja/` 以下）。ソフトウェアセクションは生成、残りは手書き（後述）。

## 構成一覧（111ページ = sitemap 110 URL + 404）

### マーケットプレイス（手書き、EN/JA）
| パス | 内容 |
|---|---|
| `/` | ポータル：3セクションの入口カード＋比較ウィジェット＋全計算機タイル |
| `/ebay-fee-calculator/` | eBay（段階料率・注文ごと手数料・Top Rated Plus割引・国際手数料・プリセット） |
| `/ebay-profit-calculator/` | eBay逆算（目標利益／目標利益率 → 必要販売価格、往復検算表示付き） |
| `/etsy-fee-calculator/` | Etsy（出品料・取引・決済・規制運営費9か国・Offsite Ads上限） |
| `/poshmark-fee-calculator/` | Poshmark（$15未満$2.95／以上20%） |
| `/mercari-fee-calculator/` | Mercari US（販売手数料10%・決済手数料なし・Buyer Protectionは買い手負担表示） |
| `/amazon-referral-fee-calculator/` | Amazon（カテゴリ別紹介料セレクタ17種・最低$0.30・Media閉店料。紹介料のみ） |
| `/depop-fee-calculator/` | Depop（US/UK切替・販売手数料なし・決済のみ） |
| `/vinted-fee-calculator/` | Vinted（売り手手数料$0・買い手負担分は参考表示） |
| `/whatnot-fee-calculator/` | Whatnot（Standard 8%／Coins 4%＋決済2.9%+$0.30） |
| `/tiktok-shop-fee-calculator/` | TikTok Shop US（カテゴリ群別紹介料率。公式Seller Universityで確認） |
| `/facebook-marketplace-fee-calculator/` | Facebook Marketplace（発送10%・最低$0.80／対面受取は対象外） |
| `/marketplace-fees-compared/` | 8プラットフォーム比較（判定バナー・横棒グラフ・全表・損益分岐）。入力カードが画面外に出るとヘッダー下に追従入力バーが出る |
| `/batch-fee-calculator/` | 一括計算＋CSV出力（数式インジェクション無害化済み） |
| `/ebay-vs-etsy-fees/` | eBay vs Etsy（同一商品の実例をライブ計算） |
| `/fee-changes/` | 料金改定履歴（出典付き）＋ `/feed.xml`（RSS。改定エントリ追加時は手動で追記すること） |
| `/guides/ebay-fees-explained/` `/guides/etsy-fees-explained/` `/guides/mercari-fees-explained/` | ガイド：結論先出し→計算機導線→内訳表→照合できる実例→FAQ→出典・検証日 |

### KDP（手書き、EN/JA）
| パス | 内容 |
|---|---|
| `/kdp/` | KDPハブ |
| `/kdp-cover-calculator/` | 表紙サイズ計算＋300 DPIテンプレートPNGダウンロード |
| `/kdp-print-cost-calculator/` | 印刷コスト計算 |
| `/kdp-royalty-calculator/` | ロイヤルティ計算（印刷本／電子書籍）。電子書籍はストア連動でVAT初期値を自動設定（JP 10%・UK 0%・EU目安7%、上書き可） |
| `/guides/kdp-royalties-explained/` | KDPロイヤルティ解説ガイド |

### ソフトウェア料金（生成、EN/JA 各28ページ）
`/software/` 以下は **`~/workspace/tallyfee-saas-build/gen.py` が単一ソースで生成**する。データは `~/workspace/tallyfee-saas-data/` → `convert.py` → `assets/saas-data.js`。メール配信（6ツール）／CRM（5ツール＋monday地域価格）の料金ページ・比較・vs・計算機2本・best系・ガイド。手で編集しないこと（gen.py を直して再生成する）。

### 共通
`/about/`（検証方法・運営）、`/disclosure/`（広告・アフィリエイト開示。文案は法務監査の確定稿で、冒頭バナー＋CTA直近ラベルの有効化手順つき）、`/privacy/`（プライバシーポリシー）— いずれも英日、`robots.txt` / `sitemap.xml` / `404.html` / `favicon.svg` / favicon一式、`_redirects`（推測URL→実URLの301）。

### アセット
| ファイル | 内容 |
|---|---|
| `/assets/engines.js` | マーケットプレイス計算エンジン（純関数。Node で単体テスト可能） |
| `/assets/calc.js` | DOM配線（入力→結果描画・構成比バー・結果コピー・比較・逆算・追従入力バー） |
| `/assets/kdp.js` | KDP計算エンジン＋配線（料率表はデータテーブル構造） |
| `/assets/pricing.js` + `/assets/saas-data.js` | ソフトウェア料金エンジン＋データ（計算機ページのみ読込） |
| `/assets/batch.js` / `/assets/nav.js` | 一括計算／タッチ用ドロップダウン |
| `/assets/events.js` | 計測の受け口：外部リンクのクリックと計算完了をメモリ内キュー（`window.__tallyfeeEvents`）に記録するだけの第一者レイヤ。送信なし・クッキーなし。Cloudflare Web Analytics のビーコンはファイル冒頭の定数 `CLOUDFLARE_WEB_ANALYTICS_TOKEN` にトークンを貼ったときだけ読み込まれる（現在は空＝無効） |
| `/assets/style.css` | 共通スタイル（白基調。結果パネルのみ濃色） |

各計算機ページの共通仕様：初期値プリセットで開いた瞬間に結果表示／判定ラベル＋根拠1文／構成比バー／検証日バッジ＋公式出典リンク／詳細設定は折りたたみ／結果コピー機能／損益分岐価格／入力の永続化（URLパラメータ優先、次に localStorage `tf-calc:<path>`。共有リンクで再現可能）／「入力はブラウザ外に出ない」明記。フッターには手数料の免責に加えて税金注記（結果は税引前である旨）を併記。

## キャッシュとアセットトークン（重要）

Cloudflare は style.css 等を max-age 14400（4時間）でキャッシュするため、**全アセットURLに `?v=<トークン>` を付けている**。現在のトークンは **`jpcalc20261124`**。CSS/JS を1文字でも変えたら、トークンを新しい値に全ページ＋gen.py テンプレートで一括置換すること（漏れると古いJS/CSSが訪問者のキャッシュに残る。過去に実際に踏んだ事故パターン）。

```bash
grep -rho '?v=[a-zA-Z0-9]*' . | sort | uniq -c   # 1種類だけになっていること
```

## デプロイ手順

1. このフォルダで変更し、下記の監査・テストを全部通す
2. `github push-files` でリポジトリ `taka19980303-oss/tallyfee`（main）へ push → Cloudflare Pages が自動デプロイ
3. ライブで代表ページ（トップ・eBay計算機・比較・KDPロイヤルティ・/software/ 1ページ）を確認

## 監査・テスト（`~/workspace/tallyfee-saas-build/`）

| ツール | 内容 |
|---|---|
| `audit_links.py` | 全ページのリンク・ID・構造監査（107ページ 0件が合格） |
| `audit2.py` | アンカー・資産・sitemap↔ファイル双射・`_redirects` 対象（TOTAL: 0 が合格。コメント行は読み飛ばす） |
| `test-engine.js` | ソフトウェア料金エンジン（pricing.js）の回帰テスト 20件 |
| `test-engines.js` | **マーケットプレイスエンジン（engines.js）の回帰テスト 20件**。下記の期待値を実行可能な形で照合する |
| `gen.py` | ソフトウェアセクション生成（2026-11-23 にバイトコードから復元・検証済み。経緯は同フォルダの `GEN_PY_RECOVERY.md`）。CTAコンポーネント（`vendor_cta()`）と開示バナー枠（`disclosure_banner()`）もここが単一ソース |
| `smoke-check.js` | 本番スモークチェック：ライブの engines.js を取得して期待値20件を再実行＋主要ページの料率表記（13.6%等）と想定外リダイレクトを照合する改ざん探知機。push直後と日次で実行 |
| `pre-push-check.py` | push前のファイル一覧ゲート：0バイト・残置ファイル（*.new等）・許可外拡張子があれば失敗する |
| `convert.py` / `transform_nav.py` | データ変換／手書きページのヘッダー一括置換（完全一致置換。置換漏れは監査で検出） |

### engines.js 期待値20件（test-engines.js が実行）

構築時（2026-11-18）に検算済みの期待値。料率改定時はこの表とテストを先に更新し、エンジンと照合する。

```
PASS eBay $100+$10 fees = 15.36
PASS eBay $100+$10 profit = 46.64
PASS eBay $8,000 FVF (fvf1+fvf2) = 1031.75
PASS Etsy $100 total fees = 9.95
PASS Mercari $50+$5 fee = 5.5
PASS Mercari $50+$5 profit = 24.5
PASS Depop US $35 fees = 1.61
PASS Etsy $100+$8tax processing = 3.49
PASS eBay TRP total fees = 13.86
PASS eBay TRP profit = 48.14
PASS eBay intl(JP) total fees = 16.85
PASS eBay intl(JP) profit = 45.15
PASS Compare eBay profit = 21.12
PASS Compare Etsy profit = 23.32
PASS Compare Poshmark profit = 14
PASS Amazon Everything Else $55 fee = 8.25
PASS Amazon Clothing $30 fee = 5.1
PASS Amazon Jewelry $300 fee = 52.5
PASS Reverse price for $50 target = 103.89
PASS Reverse round-trip profit = 50
```

2026-11-23 再実行：test-engines.js 20/20、test-engine.js 20/20、audit_links 0件、audit2 TOTAL: 0。

## 運用ルール

- 料率は月1回公式ページで再確認し、変更があれば計算機・履歴・該当記事・feed.xml を同時更新。**検証日は実際に再確認したときだけ更新する**（日付だけの付け替えはしない）。
- 収益化の有効化手順（アフィリエイト開始時）：①ベンダーリンクをアフィリエイトURLに差し替え ②同じ変更で開示バナーとCTA直近ラベルの `data-active="false"` を `"true"` に反転（`/software/` は gen.py の `disclosure_banner()` / `vendor_cta()` と events.js の動的CTA、本文ページは各ページ冒頭のバナー枠）③`smoke-check.js` にアフィリエイトhrefの許可リスト照合を追加。**②を欠いたリンク差し替えはステマ規制違反になるので絶対に分けない。**
- 料率改定の手順：①engines.js（または kdp.js の表／saas-data）→ ②該当ページ本文・実例・JSON-LD（EN/JA）→ ③calc.js のラベル・検証日文字列 → ④fee-changes＋feed.xml → ⑤テスト・監査 → ⑥トークン差し替え → push。

## 既知の制限（ページ内に明記済みのもの）

- **Amazon のカテゴリ**：セレクタ収録は17カテゴリ。それ以外は未収録（公式ページで確認のうえ追加すること）。
- **Depop Australia**（2.6% + A$0.30）：計算対象外。ページ内に構造のみ注記。
- **Whatnot のティア制**（Standard 以外）：未モデル化。Standard 前提をページ内に明記済み。
- **eBay 国際手数料のボリューム割引ティア**（日本／Rest of APAC）：未モデル化。ページ内に明記済み。
- **eBay のカテゴリ別料率**：本計算機は「most categories（Store なし）」前提。Books/Music 等の 15.3% カテゴリはページ内で注記のみ。
- **アクセス解析**：受け口（`assets/events.js`）のみ設置済み。キューはブラウザのメモリ内で完結し外部送信しない。Cloudflare Web Analytics のビーコントークンは未設定（運営者がダッシュボードで取得し `events.js` の定数に貼ると有効化）。
