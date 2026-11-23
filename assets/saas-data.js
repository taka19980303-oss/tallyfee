/* SaaS pricing data — every figure confirmed on the vendor’s official pricing page, checked 2026-11-23. See ~/workspace/tallyfee-saas-data/ for sources. */
window.SAAS_DATA = {
 "checked": "2026-11-23",
 "email": {
  "mailchimp": {
   "name": "Mailchimp",
   "model": "contact_tier",
   "unit": "contacts",
   "source": "https://mailchimp.com/pricing/marketing/",
   "free": {
    "name": "Free",
    "limit": "250 contacts, 500 sends/month",
    "limit_ja": "連絡先250件、月500通まで"
   },
   "plans": [
    {
     "name": "Essentials",
     "tiers": [
      {
       "upTo": 500,
       "monthly": 13
      },
      {
       "upTo": 1500,
       "monthly": 15.56
      },
      {
       "upTo": 2500,
       "monthly": 23.65
      },
      {
       "upTo": 5000,
       "monthly": 39.21
      },
      {
       "upTo": 10000,
       "monthly": 59.13
      },
      {
       "upTo": 25000,
       "monthly": 149.38
      },
      {
       "upTo": 50000,
       "monthly": 205.4
      }
     ]
    },
    {
     "name": "Standard",
     "tiers": [
      {
       "upTo": 500,
       "monthly": 20
      },
      {
       "upTo": 1500,
       "monthly": 26.76
      },
      {
       "upTo": 2500,
       "monthly": 39.21
      },
      {
       "upTo": 5000,
       "monthly": 59.13
      },
      {
       "upTo": 10000,
       "monthly": 80.91
      },
      {
       "upTo": 25000,
       "monthly": 174.28
      },
      {
       "upTo": 50000,
       "monthly": 236.52
      }
     ]
    },
    {
     "name": "Premium",
     "tiers": [
      {
       "upTo": 1500,
       "monthly": 236.52
      },
      {
       "upTo": 2500,
       "monthly": 236.52
      },
      {
       "upTo": 5000,
       "monthly": 236.52
      },
      {
       "upTo": 10000,
       "monthly": 236.52
      },
      {
       "upTo": 25000,
       "monthly": 354.78
      },
      {
       "upTo": 50000,
       "monthly": 473.04
      }
     ]
    }
   ],
   "annualNote": "Mailchimp publishes no public annual rate card for these plans; monthly billing is the comparable figure.",
   "annualNote_ja": "Mailchimpはこれらのプランの年額料金表を公開していません。比較の基準は月額課金です。",
   "counting": "Counts every contact in your audience — including unsubscribed and non-subscribed contacts — until you archive them. Your bill is based on the PEAK contact total in the billing period.",
   "counting_ja": "オーディエンス内のすべての連絡先を数えます — 配信停止済み・未購読の連絡先も、アーカイブするまでは含まれます。請求は、請求期間中の連絡先数のピーク（最大値）が基準です。",
   "overage": "Pass your plan limit and Mailchimp auto-charges for add-on contact blocks (for example $22 per 1,000-contact block on Essentials at the 10,000 tier). Sending is never interrupted.",
   "overage_ja": "プランの上限を超えると、追加の連絡先ブロックが自動で課金されます（例：10,000件の段階ではEssentialsで1,000件ブロックあたり$22）。配信が止まることはありません。",
   "quirks": [
    "Mailchimp’s own pages disagreed on Premium on the check date: $350/mo on the compare-plans page vs $236.52 shown in the pricing calculator view for bands up to 10,000 contacts. The calculator here uses the pricing-page figures."
   ],
   "quirks_ja": [
    "確認日時点でMailchimp自身のページ間でPremiumの価格が食い違っていました：プラン比較ページでは月額$350、料金計算ビューの10,000件までの帯では$236.52。ここの計算機は料金ページ側の数字を使っています。"
   ]
  },
  "brevo": {
   "name": "Brevo",
   "model": "send_volume",
   "unit": "emails/month",
   "source": "https://www.brevo.com/pricing/",
   "free": {
    "name": "Free",
    "limit": "300 emails/day, up to 100,000 contacts stored",
    "limit_ja": "1日300通、連絡先は最大100,000件まで保存"
   },
   "plans": [
    {
     "name": "Starter",
     "tiers": [
      {
       "upTo": 5000,
       "monthly": 9.0,
       "annual": 8.08
      },
      {
       "upTo": 20000,
       "monthly": 32.0,
       "annual": 28.75
      },
      {
       "upTo": 30000,
       "monthly": 39.0,
       "annual": 35.08
      },
      {
       "upTo": 50000,
       "monthly": 56.0,
       "annual": 50.42
      },
      {
       "upTo": 60000,
       "monthly": 65.0,
       "annual": 58.5
      },
      {
       "upTo": 100000,
       "monthly": 82.0,
       "annual": 73.75
      }
     ]
    },
    {
     "name": "Standard",
     "tiers": [
      {
       "upTo": 5000,
       "monthly": 18.0,
       "annual": 16.17
      },
      {
       "upTo": 20000,
       "monthly": 69.0,
       "annual": 62.08
      },
      {
       "upTo": 30000,
       "monthly": 79.0,
       "annual": 71.08
      },
      {
       "upTo": 50000,
       "monthly": 97.0,
       "annual": 87.25
      },
      {
       "upTo": 100000,
       "monthly": 139.0,
       "annual": 125.08
      }
     ]
    },
    {
     "name": "Professional",
     "tiers": [
      {
       "upTo": 150000,
       "monthly": 499,
       "annual": 449.08,
       "fromTier": true
      }
     ]
    }
   ],
   "counting": "Brevo is the outlier: it bills on monthly SEND VOLUME, not list size. Every tier shown includes storage for up to 500,000 contacts.",
   "counting_ja": "Brevoは例外で、リストの大きさではなく月間の送信数で課金します。表示されている全プランに、最大500,000件の連絡先保存が含まれます。",
   "overage": "No per-email overage rate is published. Extra volume is bought as prepaid email credit packs (5,000–1,000,000 emails).",
   "overage_ja": "1通あたりの超過料金は公開されていません。追加の送信量はプリペイドのメールクレジットパック（5,000〜1,000,000通）で購入します。",
   "quirks": [
    "Plan names changed: the mid plan is now called Standard (there is no “Business” plan anymore)."
   ],
   "quirks_ja": [
    "プラン名が変わりました：中位プランは現在Standardで、「Business」プランはもうありません。"
   ]
  },
  "kit": {
   "name": "Kit",
   "model": "contact_tier",
   "unit": "subscribers",
   "source": "https://kit.com/pricing",
   "free": {
    "name": "Newsletter (Free)",
    "limit": "Up to 10,000 subscribers, unlimited sends",
    "limit_ja": "購読者10,000件まで、送信無制限"
   },
   "plans": [
    {
     "name": "Creator",
     "tiers": [
      {
       "upTo": 1000,
       "monthly": 39,
       "annual": 32.37
      },
      {
       "upTo": 3000,
       "monthly": 59,
       "annual": 48.97
      },
      {
       "upTo": 5000,
       "monthly": 89,
       "annual": 73.87
      },
      {
       "upTo": 8000,
       "monthly": 119,
       "annual": 98.77
      },
      {
       "upTo": 10000,
       "monthly": 139,
       "annual": 115.37
      },
      {
       "upTo": 15000,
       "monthly": 169,
       "annual": 140.27
      },
      {
       "upTo": 20000,
       "monthly": 189,
       "annual": 156.87
      },
      {
       "upTo": 25000,
       "monthly": 199,
       "annual": 165.17
      },
      {
       "upTo": 35000,
       "monthly": 259,
       "annual": 214.97
      },
      {
       "upTo": 45000,
       "monthly": 319,
       "annual": 264.77
      },
      {
       "upTo": 55000,
       "monthly": 379,
       "annual": 314.57
      }
     ]
    },
    {
     "name": "Pro",
     "tiers": [
      {
       "upTo": 1000,
       "monthly": 79,
       "annual": 65.57
      },
      {
       "upTo": 3000,
       "monthly": 99,
       "annual": 82.17
      },
      {
       "upTo": 5000,
       "monthly": 139,
       "annual": 115.37
      },
      {
       "upTo": 8000,
       "monthly": 169,
       "annual": 140.27
      },
      {
       "upTo": 10000,
       "monthly": 189,
       "annual": 156.87
      },
      {
       "upTo": 15000,
       "monthly": 249,
       "annual": 206.67
      },
      {
       "upTo": 20000,
       "monthly": 269,
       "annual": 223.27
      },
      {
       "upTo": 25000,
       "monthly": 279,
       "annual": 231.57
      },
      {
       "upTo": 35000,
       "monthly": 363,
       "annual": 301.29
      },
      {
       "upTo": 45000,
       "monthly": 440,
       "annual": 365.2
      },
      {
       "upTo": 55000,
       "monthly": 519,
       "annual": 430.77
      }
     ]
    }
   ],
   "annualNote": "Annual billing is 17% off the monthly prices (confirmed on the pricing page at 1,000 and 55,000 subscribers).",
   "annualNote_ja": "年額課金は月額の17%引きです（料金ページで購読者1,000件と55,000件の時点で確認）。",
   "counting": "Counts unique ACTIVE subscribers only — unsubscribes stop counting. Sends are unlimited on every plan.",
   "counting_ja": "有効な購読者だけを一意に数えます — 配信停止した人は数えません。全プランで送信は無制限です。",
   "overage": "No overage fee. Cross a tier and Kit auto-upgrades you to the next tier. Downgrades are manual: you have to email support after cleaning your list.",
   "overage_ja": "超過料金はありません。段階を超えると自動で次の段階にアップグレードされます。ダウングレードは手動で、リストを整理したあとサポートへメールが必要です。",
   "quirks": [],
   "quirks_ja": []
  },
  "activecampaign": {
   "name": "ActiveCampaign",
   "model": "contact_tier",
   "unit": "contacts",
   "annualOnly": true,
   "source": "https://www.activecampaign.com/pricing",
   "free": null,
   "plans": [
    {
     "name": "Starter",
     "tiers": [
      {
       "upTo": 1000,
       "annual": 15
      },
      {
       "upTo": 2500,
       "annual": 39
      },
      {
       "upTo": 5000,
       "annual": 79
      },
      {
       "upTo": 10000,
       "annual": 149
      },
      {
       "upTo": 25000,
       "annual": 391
      }
     ]
    },
    {
     "name": "Plus",
     "tiers": [
      {
       "upTo": 1000,
       "annual": 49
      },
      {
       "upTo": 2500,
       "annual": 95
      },
      {
       "upTo": 5000,
       "annual": 145
      },
      {
       "upTo": 10000,
       "annual": 189
      },
      {
       "upTo": 25000,
       "annual": 389
      },
      {
       "upTo": 50000,
       "annual": 609
      }
     ]
    },
    {
     "name": "Pro",
     "tiers": [
      {
       "upTo": 1000,
       "annual": 79
      },
      {
       "upTo": 2500,
       "annual": 149
      },
      {
       "upTo": 5000,
       "annual": 205
      },
      {
       "upTo": 10000,
       "annual": 375
      },
      {
       "upTo": 25000,
       "annual": 629
      },
      {
       "upTo": 50000,
       "annual": 969
      }
     ]
    },
    {
     "name": "Enterprise",
     "tiers": [
      {
       "upTo": 1000,
       "annual": 145
      },
      {
       "upTo": 2500,
       "annual": 255
      },
      {
       "upTo": 5000,
       "annual": 375
      },
      {
       "upTo": 10000,
       "annual": 589
      },
      {
       "upTo": 25000,
       "annual": 879
      },
      {
       "upTo": 50000,
       "annual": 1169
      }
     ]
    }
   ],
   "annualNote": "The pricing page shows annual-billing prices only. Monthly-billing prices are not published there (Starter monthly is $19 at 1,000 contacts per ActiveCampaign’s official blog).",
   "annualNote_ja": "料金ページは年額課金の価格のみ表示しています。月額課金の価格は同ページでは公開されていません（1,000件でのStarter月額$19はActiveCampaign公式ブログによる）。",
   "counting": "Accounts created on or after Nov 3, 2025 count ALL contacts toward the limit — active, unsubscribed, bounced and unconfirmed alike. Older accounts count active contacts only.",
   "counting_ja": "2025年11月3日以降に作られたアカウントは、有効・配信停止・バウンス・未確認を含むすべての連絡先が上限にカウントされます。それより前のアカウントは有効な連絡先のみです。",
   "overage": "$0.005 per email sent over the monthly send limit (10×/10×/12×/15× your contact limit by plan). If overage sends reach 3× the limit, sending is switched off until the next month.",
   "overage_ja": "月間送信上限を超えた分は1通あたり$0.005（上限はプランにより連絡先数の10倍/10倍/12倍/15倍）。超過送信が上限の3倍に達すると、翌月まで送信が停止します。",
   "quirks": [
    "At 25,000 contacts the pricing page displayed Starter ($391) costing MORE than Plus ($389) — the calculator keeps that inversion, because it is what the page showed."
   ],
   "quirks_ja": [
    "25,000件の時点で、料金ページではStarter（$391）がPlus（$389）より高く表示されていました — ページの表示どおり、この逆転を計算機にも残しています。"
   ]
  },
  "mailerlite": {
   "name": "MailerLite",
   "model": "contact_tier",
   "unit": "subscribers",
   "source": "https://www.mailerlite.com/pricing",
   "free": {
    "name": "Free",
    "limit": "Up to 250 active subscribers, 2,500 emails/month",
    "limit_ja": "有効な購読者250件まで、月2,500通"
   },
   "plans": [
    {
     "name": "Comfort",
     "tiers": [
      {
       "upTo": 500,
       "monthly": 12,
       "annual": 10.8
      },
      {
       "upTo": 1000,
       "monthly": 19,
       "annual": 17.1
      },
      {
       "upTo": 2500,
       "monthly": 33,
       "annual": 29.7
      },
      {
       "upTo": 5000,
       "monthly": 49,
       "annual": 44.1
      },
      {
       "upTo": 8000,
       "monthly": 69,
       "annual": 62.1
      },
      {
       "upTo": 10000,
       "monthly": 89,
       "annual": 80.1
      },
      {
       "upTo": 15000,
       "monthly": 129,
       "annual": 116.1
      },
      {
       "upTo": 20000,
       "monthly": 159,
       "annual": 143.1
      },
      {
       "upTo": 25000,
       "monthly": 179,
       "annual": 161.1
      },
      {
       "upTo": 30000,
       "monthly": 229,
       "annual": 206.1
      },
      {
       "upTo": 35000,
       "monthly": 249,
       "annual": 224.1
      },
      {
       "upTo": 40000,
       "monthly": 269,
       "annual": 242.1
      },
      {
       "upTo": 45000,
       "monthly": 289,
       "annual": 260.1
      },
      {
       "upTo": 50000,
       "monthly": 319,
       "annual": 287.1
      },
      {
       "upTo": 60000,
       "monthly": 359,
       "annual": 323.1
      },
      {
       "upTo": 70000,
       "monthly": 379,
       "annual": 341.1
      },
      {
       "upTo": 80000,
       "monthly": 399,
       "annual": 359.1
      },
      {
       "upTo": 90000,
       "monthly": 419,
       "annual": 377.1
      },
      {
       "upTo": 100000,
       "monthly": 439,
       "annual": 395.1
      },
      {
       "upTo": 110000,
       "monthly": 489,
       "annual": 440.1
      },
      {
       "upTo": 120000,
       "monthly": 529,
       "annual": 476.1
      },
      {
       "upTo": 130000,
       "monthly": 559,
       "annual": 503.1
      },
      {
       "upTo": 140000,
       "monthly": 589,
       "annual": 530.1
      },
      {
       "upTo": 150000,
       "monthly": 619,
       "annual": 557.1
      },
      {
       "upTo": 160000,
       "monthly": 659,
       "annual": 593.1
      },
      {
       "upTo": 170000,
       "monthly": 699,
       "annual": 629.1
      },
      {
       "upTo": 180000,
       "monthly": 739,
       "annual": 665.1
      },
      {
       "upTo": 190000,
       "monthly": 779,
       "annual": 701.1
      },
      {
       "upTo": 200000,
       "monthly": 819,
       "annual": 737.1
      }
     ]
    },
    {
     "name": "Power",
     "tiers": [
      {
       "upTo": 500,
       "monthly": 25,
       "annual": 22.5
      },
      {
       "upTo": 1000,
       "monthly": 39,
       "annual": 35.1
      },
      {
       "upTo": 2500,
       "monthly": 49,
       "annual": 44.1
      },
      {
       "upTo": 5000,
       "monthly": 69,
       "annual": 62.1
      },
      {
       "upTo": 8000,
       "monthly": 99,
       "annual": 89.1
      },
      {
       "upTo": 10000,
       "monthly": 129,
       "annual": 116.1
      },
      {
       "upTo": 15000,
       "monthly": 179,
       "annual": 161.1
      },
      {
       "upTo": 20000,
       "monthly": 219,
       "annual": 197.1
      },
      {
       "upTo": 25000,
       "monthly": 239,
       "annual": 215.1
      },
      {
       "upTo": 30000,
       "monthly": 279,
       "annual": 251.1
      },
      {
       "upTo": 35000,
       "monthly": 309,
       "annual": 278.1
      },
      {
       "upTo": 40000,
       "monthly": 329,
       "annual": 296.1
      },
      {
       "upTo": 45000,
       "monthly": 359,
       "annual": 323.1
      },
      {
       "upTo": 50000,
       "monthly": 389,
       "annual": 350.1
      },
      {
       "upTo": 60000,
       "monthly": 419,
       "annual": 377.1
      },
      {
       "upTo": 70000,
       "monthly": 439,
       "annual": 395.1
      },
      {
       "upTo": 80000,
       "monthly": 459,
       "annual": 413.1
      },
      {
       "upTo": 90000,
       "monthly": 469,
       "annual": 422.1
      },
      {
       "upTo": 100000,
       "monthly": 489,
       "annual": 440.1
      },
      {
       "upTo": 110000,
       "monthly": 599,
       "annual": 539.1
      },
      {
       "upTo": 120000,
       "monthly": 649,
       "annual": 584.1
      },
      {
       "upTo": 130000,
       "monthly": 689,
       "annual": 620.1
      },
      {
       "upTo": 140000,
       "monthly": 719,
       "annual": 647.1
      },
      {
       "upTo": 150000,
       "monthly": 759,
       "annual": 683.1
      },
      {
       "upTo": 160000,
       "monthly": 829,
       "annual": 746.1
      },
      {
       "upTo": 170000,
       "monthly": 899,
       "annual": 809.1
      },
      {
       "upTo": 180000,
       "monthly": 959,
       "annual": 863.1
      },
      {
       "upTo": 190000,
       "monthly": 1029,
       "annual": 926.1
      },
      {
       "upTo": 200000,
       "monthly": 1119,
       "annual": 1007.1
      }
     ]
    }
   ],
   "counting": "Counts ACTIVE subscribers only — but cumulatively within a billing cycle: an address that was active at any point in the cycle counts, even if you delete it later.",
   "counting_ja": "有効な購読者のみを数えます — ただし請求サイクル内の累積です：サイクル中に一度でも有効だったアドレスは、あとで削除してもカウントされます。",
   "overage": "No per-contact fee. Cross your tier and MailerLite auto-upgrades you to the next tier and charges the card (with an in-account warning first).",
   "overage_ja": "連絡先ごとの料金はありません。段階を超えると次の段階へ自動アップグレードされ、カードに請求されます（まずアカウント内に警告が出ます）。",
   "quirks": [
    "Plans were renamed in June 2026: Comfort was “Growing Business”, Power was “Advanced”."
   ],
   "quirks_ja": [
    "プラン名は2026年6月に変更されました：Comfortは旧「Growing Business」、Powerは旧「Advanced」です。"
   ]
  },
  "constantcontact": {
   "name": "Constant Contact",
   "model": "contact_tier",
   "unit": "contacts",
   "source": "https://www.constantcontact.com/pricing",
   "free": null,
   "plans": [
    {
     "name": "Lite",
     "tiers": [
      {
       "upTo": 500,
       "monthly": 12,
       "annual": 10.2
      },
      {
       "upTo": 1000,
       "monthly": 30,
       "annual": 25.5
      },
      {
       "upTo": 2500,
       "monthly": 50,
       "annual": 42.5
      },
      {
       "upTo": 5000,
       "monthly": 80,
       "annual": 68.0
      },
      {
       "upTo": 10000,
       "monthly": 130,
       "annual": 110.5
      },
      {
       "upTo": 25000,
       "monthly": 280,
       "annual": 238.0
      },
      {
       "upTo": 50000,
       "monthly": 430,
       "annual": 365.5
      }
     ]
    },
    {
     "name": "Standard",
     "tiers": [
      {
       "upTo": 500,
       "monthly": 35,
       "annual": 29.75
      },
      {
       "upTo": 1000,
       "monthly": 55,
       "annual": 46.75
      },
      {
       "upTo": 2500,
       "monthly": 75,
       "annual": 63.75
      },
      {
       "upTo": 5000,
       "monthly": 110,
       "annual": 93.5
      },
      {
       "upTo": 10000,
       "monthly": 160,
       "annual": 136.0
      },
      {
       "upTo": 25000,
       "monthly": 310,
       "annual": 263.5
      },
      {
       "upTo": 50000,
       "monthly": 460,
       "annual": 391.0
      }
     ]
    },
    {
     "name": "Premium",
     "tiers": [
      {
       "upTo": 500,
       "monthly": 80,
       "annual": 68.0
      },
      {
       "upTo": 1000,
       "monthly": 110,
       "annual": 93.5
      },
      {
       "upTo": 2500,
       "monthly": 150,
       "annual": 127.5
      },
      {
       "upTo": 5000,
       "monthly": 200,
       "annual": 170.0
      },
      {
       "upTo": 10000,
       "monthly": 275,
       "annual": 233.75
      },
      {
       "upTo": 25000,
       "monthly": 425,
       "annual": 361.25
      },
      {
       "upTo": 50000,
       "monthly": 575,
       "annual": 488.75
      }
     ]
    }
   ],
   "annualNote": "Annual figures apply the published prepay discount of up to 15% (the 0–500 tier confirms exactly 15%: $12 → $10.20).",
   "annualNote_ja": "年額の数字は、公開されている前払い割引（最大15%）を適用したものです（0〜500件の段階でちょうど15%：$12 → $10.20 で確認）。",
   "counting": "Tiered by contact count; send allowance is 10×/12×/24× your contacts per month by plan.",
   "counting_ja": "連絡先数で段階が決まります。送信上限はプランにより連絡先数の月間10倍/12倍/24倍です。",
   "overage": "$0.002 per email sent over the monthly allowance ($2 per 1,000 sends). Sends are never blocked.",
   "overage_ja": "月間上限を超えた送信は1通あたり$0.002（1,000通あたり$2）。送信がブロックされることはありません。",
   "quirks": [
    "No free plan — trial only. Above 50,000 contacts every plan is “Contact Sales”."
   ],
   "quirks_ja": [
    "無料プランはなく、トライアルのみ。連絡先50,000件超は全プラン「Contact Sales」（要問い合わせ）です。"
   ]
  }
 },
 "crm": {
  "hubspot": {
   "name": "HubSpot Sales Hub",
   "model": "per_seat",
   "source": "https://www.hubspot.com/pricing/sales",
   "plans": [
    {
     "name": "Starter",
     "monthly": 15,
     "annual": 9
    },
    {
     "name": "Professional",
     "monthly": 100,
     "annual": 90,
     "onboarding": 1500
    },
    {
     "name": "Enterprise",
     "monthly": null,
     "annual": 150,
     "onboarding": 3500,
     "annualOnly": true
    }
   ],
   "free": {
    "name": "Free CRM",
    "limit": "Up to 2 users, unlimited contacts",
    "limit_ja": "ユーザー2人まで、連絡先無制限"
   },
   "counting": "Two seat types: the prices here are Sales Seats. Cheaper Core Seats ($50/mo on Professional, $75 on Enterprise) exist for users who do not need the full sales tools — so your real bill depends on the seat MIX, not just headcount.",
   "counting_ja": "席には2種類あります：ここでの価格はSales Seatsです。営業ツール一式が不要なユーザー向けに安いCore Seats（Professionalで月$50、Enterpriseで月$75）があり、実際の請求は人数ではなく席の組み合わせで決まります。",
   "overage": "Professional and Enterprise carry a mandatory one-time onboarding fee ($1,500 / $3,500), included in the year-1 totals in the calculator.",
   "overage_ja": "ProfessionalとEnterpriseには必須の初期導入費用（$1,500 / $3,500）が一度だけかかります。計算機の初年度合計には含まれています。",
   "quirks": [
    "HubSpot’s own pages disagreed on Starter on the check date: the pricing guide shows $9/seat/mo billed annually, while the official Product & Services Catalog lists a $20/mo list rate per Core Seat. The calculator uses the pricing-page rates."
   ],
   "quirks_ja": [
    "確認日時点でHubSpot自身のページ間でStarterの価格が食い違っていました：料金ガイドでは年額課金で席あたり月$9、公式のProduct & Services CatalogではCore Seatの定価が月$20。計算機は料金ページ側の料率を使っています。"
   ]
  },
  "pipedrive": {
   "name": "Pipedrive",
   "model": "per_seat",
   "source": "https://www.pipedrive.com/en/pricing",
   "plans": [
    {
     "name": "Lite",
     "monthly": 24,
     "annual": 14
    },
    {
     "name": "Growth",
     "monthly": 49,
     "annual": 39
    },
    {
     "name": "Premium",
     "monthly": 79,
     "annual": 59
    },
    {
     "name": "Ultimate",
     "monthly": 99,
     "annual": 79
    }
   ],
   "free": null,
   "counting": "Straight per-seat pricing, VAT excluded. No seat minimum was shown on the pricing page.",
   "counting_ja": "シンプルな席課金で、価格はVAT別。料金ページに最低席数の表示はありませんでした。",
   "overage": "The upsell is add-ons: LeadBooster, Campaigns and Web Visitors are priced separately and are not on the pricing page.",
   "overage_ja": "アップセルはアドオンです：LeadBooster、Campaigns、Web Visitorsは別料金で、料金ページには載っていません。",
   "quirks": [],
   "quirks_ja": []
  },
  "zoho": {
   "name": "Zoho CRM",
   "model": "per_seat",
   "source": "https://www.zoho.com/crm/pricing.html",
   "plans": [
    {
     "name": "Standard",
     "monthly": null,
     "annual": 14
    },
    {
     "name": "Professional",
     "monthly": null,
     "annual": 23
    },
    {
     "name": "Enterprise",
     "monthly": null,
     "annual": 40
    }
   ],
   "free": {
    "name": "Free",
    "limit": "Forever free for up to 3 users",
    "limit_ja": "ユーザー3人まで永久無料"
   },
   "annualNote": "Zoho’s USD pricing page confirms annual-billing rates; monthly-billing USD rates and the Ultimate edition’s USD price could not be confirmed on the official page (its Japanese page lists Ultimate at ¥9,200/mo monthly-billed). Ultimate is therefore not in the calculator.",
   "annualNote_ja": "Zohoの米ドル料金ページで確認できるのは年額課金の料率です。月額課金の米ドル料率とUltimate版の米ドル価格は公式ページで確認できませんでした（日本語ページではUltimateは月額課金で月¥9,200）。そのためUltimateは計算機に入れていません。",
   "counting": "Per user. Watch the bundle trap: Zoho One’s “All Employee Pricing” requires licensing every employee on payroll (a Flexible User option exists).",
   "counting_ja": "ユーザー単位の課金。バンドルの罠に注意：Zoho Oneの「All Employee Pricing」は給与対象の全従業員分のライセンスが必要です（Flexible Userオプションもあります）。",
   "overage": "",
   "overage_ja": "",
   "quirks": [],
   "quirks_ja": []
  },
  "freshsales": {
   "name": "Freshsales",
   "model": "per_seat",
   "source": "https://www.freshworks.com/crm/pricing/",
   "plans": [
    {
     "name": "Growth",
     "monthly": 11,
     "annual": 9
    },
    {
     "name": "Pro",
     "monthly": 47,
     "annual": 39
    },
    {
     "name": "Enterprise",
     "monthly": 71,
     "annual": 59
    }
   ],
   "free": null,
   "counting": "Per user. No free plan on the current pricing page — 21-day trial only.",
   "counting_ja": "ユーザー単位の課金。現在の料金ページに無料プランはなく、21日間のトライアルのみです。",
   "overage": "Metered add-ons sit on top: Freddy AI Agent sessions ($49 per 100 sessions after a one-time 500 free) and Branded Documents ($19/user/mo).",
   "overage_ja": "従量制のアドオンが上乗せされます：Freddy AI Agentのセッション（初回500回無料のあと100セッションあたり$49）とBranded Documents（ユーザーあたり月$19）。",
   "quirks": [
    "Monthly prices are from Freshworks’ official pricing-plan document dated Jun 13, 2025; annual prices were read on the live pricing page on the check date."
   ],
   "quirks_ja": [
    "月額価格はFreshworks公式の料金プラン文書（2025年6月13日付）によるものです。年額価格は確認日にライブの料金ページで読みました。"
   ]
  },
  "close": {
   "name": "Close",
   "model": "per_seat",
   "source": "https://close.com/pricing",
   "plans": [
    {
     "name": "Solo",
     "monthly": 19,
     "annual": 9,
     "maxSeats": 1
    },
    {
     "name": "Essentials",
     "monthly": 49,
     "annual": 35
    },
    {
     "name": "Growth",
     "monthly": 109,
     "annual": 99
    },
    {
     "name": "Scale",
     "monthly": 149,
     "annual": 139
    }
   ],
   "free": null,
   "counting": "Per user. Solo is restricted to a single user and 10,000 leads.",
   "counting_ja": "ユーザー単位の課金。Soloは1ユーザー・リード10,000件までに制限されます。",
   "overage": "The seat price is not the whole bill: calling and SMS are usage-billed (about $0.02/min outbound), the Call Assistant add-on is $50/mo per account, and extra organizations are $50/mo each.",
   "overage_ja": "席料金が請求の全てではありません：通話とSMSは従量課金（発信は約$0.02/分）で、Call Assistantアドオンはアカウントあたり月$50、追加の組織は1つ月$50です。",
   "quirks": [],
   "quirks_ja": []
  }
 }
};
