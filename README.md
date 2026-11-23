# Fee Calculator Suite ― 本番公開用静的サイト

マーケットプレイス手数料・利益計算スイートの本番公開用一式。Muse artifact（slug: `shou-shu-liao-li-yi-ji-suan-suito`、v9）の検証済み実装を、設計書（`seo-content-design-fee-suite-2026-11-18.md`）のURL構成で個別ページに分割移植したもの。計算はすべてクライアント側 JavaScript で完結し、入力は外部送信しない。

- サイト名は暫定で **「Fee Calculator Suite」**。ドメイン確定後にブランド名を差し替える前提（差し替え箇所は後述）。
- 料率はすべて 2026-11-18 に各プラットフォーム公式ページで確認済みのものだけを実装。確認できないものは推測で入れていない。

## 構成一覧

| パス | 内容 |
|---|---|
| `/` | ハブ：全計算機タイル（比較デフォルトでの手取り表示）＋比較ウィジェット＋ガイド導線 |
| `/ebay-fee-calculator/` | eBay（段階料率・注文ごと手数料・Top Rated Plus割引・国際手数料・プリセット） |
| `/ebay-profit-calculator/` | eBay逆算（目標利益／目標利益率 → 必要販売価格、往復検算表示付き） |
| `/etsy-fee-calculator/` | Etsy（出品料・取引・決済・規制運営費9か国・Offsite Ads上限） |
| `/poshmark-fee-calculator/` | Poshmark（$15未満$2.95／以上20%） |
| `/mercari-fee-calculator/` | Mercari US（販売手数料10%・決済手数料なし・Buyer Protectionは買い手負担表示） |
| `/amazon-referral-fee-calculator/` | Amazon（カテゴリ別紹介料セレクタ17種・最低$0.30・Media閉店料。紹介料のみ） |
| `/depop-fee-calculator/` | Depop（US/UK切替・販売手数料なし・決済のみ） |
| `/vinted-fee-calculator/` | Vinted（売り手手数料$0・買い手負担分は参考表示） |
| `/whatnot-fee-calculator/` | Whatnot（Standard 8%／Coins 4%＋決済2.9%+$0.30） |
| `/marketplace-fees-compared/` | 8プラットフォーム比較（判定バナー・横棒グラフ・全表・損益分岐） |
| `/ebay-vs-etsy-fees/` | eBay vs Etsy（同一商品の実例をライブ計算） |
| `/guides/ebay-fees-explained/` | ガイド：結論先出し→計算機導線→内訳表→照合できる実例→FAQ→出典・検証日 |
| `/guides/etsy-fees-explained/` | ガイド（同上） |
| `/guides/mercari-fees-explained/` | ガイド（同上、2025年手数料復活の経緯付き） |
| `/fee-changes/` | 料金改定履歴（8件・出典付き、現行artifactから移植） |
| `/assets/engines.js` | 計算エンジン（純関数。Node で単体テスト可能） |
| `/assets/calc.js` | DOM配線（入力→結果描画・構成比バー・結果コピー・比較・逆算） |
| `/assets/style.css` | 共通スタイル（白基調。結果パネルのみ濃色） |
| `robots.txt` / `sitemap.xml` / `404.html` / `favicon.svg` | 共通ファイル |

各計算機ページの共通仕様：初期値プリセットで開いた瞬間に結果表示／判定ラベル＋根拠1文／構成比バー（利益・手数料・原価）／検証日バッジ（Rates verified: November 18, 2026＋公式出典リンク）／詳細設定は折りたたみ／結果コピー機能／損益分岐価格／「入力はブラウザ外に出ない」明記。追従要素は置いていない（モバイルで内容を隠さないため）。

## デプロイ前：ドメインの一括置換（必須）

ドメイン未確定のため、canonical・sitemap・robots 内のドメインはプレースホルダ `https://tallyfee.com` に統一してある。ドメイン確定後、リポジトリ直下で一括置換すること：

```bash
# 例：feeradar.com を取得した場合
grep -rl "tallyfee.com" . | xargs sed -i 's/YOURDOMAIN\.example/feeradar.com/g'
```

置換対象は各ページの `<link rel="canonical">`、`sitemap.xml`、`robots.txt` の3種。置換漏れ確認：

```bash
grep -rn "YOURDOMAIN" .   # 何も出なければOK
```

サイト名を変える場合は、追加で `Fee Calculator Suite` / `FeeCalculatorSuite`（ヘッダーのブランド表記）と各ページの `<title>` 末尾・404/README を置換する。

## Cloudflare Pages デプロイ手順

1. Cloudflare ダッシュボード → Workers & Pages → Create → Pages → **Upload assets**（直接アップロード方式が最速。Git連携でも可）
2. プロジェクト名を入力し、このフォルダ（`fee-suite-prod`）の中身一式をアップロード
   - ビルド設定：Framework preset = None、Build command = なし、Build output directory = `/`（ルート）
3. デプロイ完了後、`https://<project>.pages.dev` で表示確認（全計算機が初期値で計算済み表示されること）
4. Custom domains → Set up a custom domain → 取得したドメインを入力
   - ドメインを Cloudflare Registrar で取得済みなら DNS は自動設定される
   - apex（`example.com`）と `www` の両方を向ける場合は、`www` 側に apex へのリダイレクト（Redirect Rules）も設定する
5. HTTPS は自動（Always Use HTTPS を有効化推奨）

## Search Console 登録と sitemap 送信

1. Google Search Console → プロパティを追加 → **ドメインプロパティ**（`example.com`）
2. 所有権確認は DNS の TXT レコード（Cloudflare DNS に追加。Search Console の画面に表示される値を貼るだけ）
3. 確認後、左メニュー「サイトマップ」に `sitemap.xml` を送信
4. 「URL検査」で `/` と `/ebay-fee-calculator/` を開き、「インデックス登録をリクエスト」
5. 数日後、カバレッジで16 URL 全件がインデックスされたか確認

運用ルール（設計書より）：料率は月1回公式ページで再確認し、変更があれば計算機・履歴・該当記事を同時更新。**検証日は実際に再確認したときだけ更新する**（日付だけの付け替えはしない）。

## 未移植・未確認事項

- **一括計算（Batch）とCSV出力**：現行 artifact にはあるが、設計書の Phase 1 URL 構成に含まれないため本番一式には未移植。Phase 2（使い方記事とセット）で `/batch-fee-calculator/` 等として追加する想定。
- **Facebook Marketplace / TikTok Shop**：公式ページで単一の標準料率を一次確認できないため未実装（推測で入れない方針）。サイト内でも「確認できないため提供しない」旨を明記済み。公式に単一料率が公開されたら追加する。
- **Pro 予告セクション**：artifact にはあるが、申込フォームのない予告は本番ページには置かなかった。Pro 実装時に結果文脈内へ追加する。
- **結果の共有リンク**：未実装（Copy result のみ）。共有リンクは埋め込み先URLに依存するため、ドメイン確定後に必要なら追加。
- **アクセス解析・計算イベント計測**：未設置。ドメイン確定後に Cloudflare Web Analytics（無料・プライバシー配慮）等の追加を推奨。
- **お問い合わせ・運営者ページ**：設計書で「ブログ側と共通化可」とされていたため未作成。
- **Amazon のカテゴリ**：現行 artifact のセレクタ（17カテゴリ）をそのまま移植。それ以外のカテゴリは未収録（公式ページで確認のうえ追加すること）。
- **Depop Australia**（2.6% + A$0.30）：計算対象外。ページ内に構造のみ注記。
- **Whatnot のティア制**（Standard 以外）：未モデル化。Standard 前提をページ内に明記済み。
- **eBay 国際手数料のボリューム割引ティア**（日本／Rest of APAC）：未モデル化。ページ内に明記済み。
- **eBay のカテゴリ別料率**：本計算機は「most categories（Store なし）」前提。Books/Music 等の 15.3% カテゴリはページ内で注記のみ。

## テスト結果（2026-11-18 構築時）

`assets/engines.js` を Node で読み込み、検算済みの期待値と照合 ― **20件全件パス**。

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
20 passed, 0 failed
```

加えて：両 JS ファイルの構文チェック（`node --check`）通過、全12ページについて calc.js が参照する要素IDの存在チェック通過、HTMLタグバランスチェック通過。再テストは `node` で engines.js を require し、上記の入力・期待値を再実行すればよい。
