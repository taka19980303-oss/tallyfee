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
    "limit": "250 contacts, 500 sends/month"
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
   "counting": "Counts every contact in your audience — including unsubscribed and non-subscribed contacts — until you archive them. Your bill is based on the PEAK contact total in the billing period.",
   "overage": "Pass your plan limit and Mailchimp auto-charges for add-on contact blocks (for example $22 per 1,000-contact block on Essentials at the 10,000 tier). Sending is never interrupted.",
   "quirks": [
    "Mailchimp’s own pages disagreed on Premium on the check date: $350/mo on the compare-plans page vs $236.52 shown in the pricing calculator view for bands up to 10,000 contacts. The calculator here uses the pricing-page figures."
   ]
  },
  "brevo": {
   "name": "Brevo",
   "model": "send_volume",
   "unit": "emails/month",
   "source": "https://www.brevo.com/pricing/",
   "free": {
    "name": "Free",
    "limit": "300 emails/day, up to 100,000 contacts stored"
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
   "overage": "No per-email overage rate is published. Extra volume is bought as prepaid email credit packs (5,000–1,000,000 emails).",
   "quirks": [
    "Plan names changed: the mid plan is now called Standard (there is no “Business” plan anymore)."
   ]
  },
  "kit": {
   "name": "Kit",
   "model": "contact_tier",
   "unit": "subscribers",
   "source": "https://kit.com/pricing",
   "free": {
    "name": "Newsletter (Free)",
    "limit": "Up to 10,000 subscribers, unlimited sends"
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
   "counting": "Counts unique ACTIVE subscribers only — unsubscribes stop counting. Sends are unlimited on every plan.",
   "overage": "No overage fee. Cross a tier and Kit auto-upgrades you to the next tier. Downgrades are manual: you have to email support after cleaning your list.",
   "quirks": []
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
   "counting": "Accounts created on or after Nov 3, 2025 count ALL contacts toward the limit — active, unsubscribed, bounced and unconfirmed alike. Older accounts count active contacts only.",
   "overage": "$0.005 per email sent over the monthly send limit (10×/10×/12×/15× your contact limit by plan). If overage sends reach 3× the limit, sending is switched off until the next month.",
   "quirks": [
    "At 25,000 contacts the pricing page displayed Starter ($391) costing MORE than Plus ($389) — the calculator keeps that inversion, because it is what the page showed."
   ]
  },
  "mailerlite": {
   "name": "MailerLite",
   "model": "contact_tier",
   "unit": "subscribers",
   "source": "https://www.mailerlite.com/pricing",
   "free": {
    "name": "Free",
    "limit": "Up to 250 active subscribers, 2,500 emails/month"
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
   "overage": "No per-contact fee. Cross your tier and MailerLite auto-upgrades you to the next tier and charges the card (with an in-account warning first).",
   "quirks": [
    "Plans were renamed in June 2026: Comfort was “Growing Business”, Power was “Advanced”."
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
   "counting": "Tiered by contact count; send allowance is 10×/12×/24× your contacts per month by plan.",
   "overage": "$0.002 per email sent over the monthly allowance ($2 per 1,000 sends). Sends are never blocked.",
   "quirks": [
    "No free plan — trial only. Above 50,000 contacts every plan is “Contact Sales”."
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
    "limit": "Up to 2 users, unlimited contacts"
   },
   "counting": "Two seat types: the prices here are Sales Seats. Cheaper Core Seats ($50/mo on Professional, $75 on Enterprise) exist for users who do not need the full sales tools — so your real bill depends on the seat MIX, not just headcount.",
   "overage": "Professional and Enterprise carry a mandatory one-time onboarding fee ($1,500 / $3,500), included in the year-1 totals in the calculator.",
   "quirks": [
    "HubSpot’s own pages disagreed on Starter on the check date: the pricing guide shows $9/seat/mo billed annually, while the official Product & Services Catalog lists a $20/mo list rate per Core Seat. The calculator uses the pricing-page rates."
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
   "overage": "The upsell is add-ons: LeadBooster, Campaigns and Web Visitors are priced separately and are not on the pricing page.",
   "quirks": []
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
    "limit": "Forever free for up to 3 users"
   },
   "annualNote": "Zoho’s USD pricing page confirms annual-billing rates; monthly-billing USD rates and the Ultimate edition’s USD price could not be confirmed on the official page (its Japanese page lists Ultimate at ¥9,200/mo monthly-billed). Ultimate is therefore not in the calculator.",
   "counting": "Per user. Watch the bundle trap: Zoho One’s “All Employee Pricing” requires licensing every employee on payroll (a Flexible User option exists).",
   "overage": "",
   "quirks": []
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
   "overage": "Metered add-ons sit on top: Freddy AI Agent sessions ($49 per 100 sessions after a one-time 500 free) and Branded Documents ($19/user/mo).",
   "quirks": [
    "Monthly prices are from Freshworks’ official pricing-plan document dated Jun 13, 2025; annual prices were read on the live pricing page on the check date."
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
   "overage": "The seat price is not the whole bill: calling and SMS are usage-billed (about $0.02/min outbound), the Call Assistant add-on is $50/mo per account, and extra organizations are $50/mo each.",
   "quirks": []
  }
 }
};
