# GrayMuzzle Co. — Shopify Storefront

> *"Comfort for the dogs who raised us."*

Turnkey dropshipping store for senior-dog wellness products, operated as a DBA of **Revvy LLC**. Target: **$20k/yr net profit** on ~$68k revenue, ~800 orders.

---

## One-evening go-live checklist

1. **Domain** — buy `graymuzzle.co` on Cloudflare Registrar (≈$12/yr). Set WHOIS to Revvy LLC.
2. **Shopify** — sign up at [shopify.com](https://www.shopify.com) on the **Basic** plan ($39/mo). Business name = `Revvy LLC`, DBA = `GrayMuzzle Co.`, EIN (not SSN).
3. **Install Shopify CLI** locally:
   ```bash
   npm i -g @shopify/cli @shopify/theme
   shopify login --store graymuzzle.myshopify.com
   ```
4. **Push theme**:
   ```bash
   cd graymuzzle-storefront
   shopify theme push --development    # preview, not live
   shopify theme push --live           # when ready
   ```
5. **Install apps from Shopify App Store**:
   - **Zendrop** (dropship fulfillment, Pro plan $49/mo)
   - **Klaviyo** (email, free until 250 subs)
   - **Shopify Inbox** (free)
6. **Seed products**:
   ```bash
   cd scripts
   cp .env.example .env                # fill SHOPIFY_* vars
   npm install
   npm run seed                        # creates 8 SKUs
   ```
7. **Validate niche with Apify** (costs <$1):
   ```bash
   # in scripts/ with APIFY_TOKEN set
   npm run validate
   ```
   Expect PASS gate. If FAIL, review `suppliers.json` and iterate SKU list.
8. **DBA filing** — file a fictitious-name registration for *GrayMuzzle Co.* under Revvy LLC in the LLC's home state. Links:
   - Delaware: [corp.delaware.gov](https://corp.delaware.gov/)
   - Wyoming: [wyobiz.wyo.gov](https://wyobiz.wyo.gov/)
   - Texas: [sos.state.tx.us](https://www.sos.state.tx.us/corp/assumednameindex.shtml)
   - California: [sos.ca.gov/business-programs/business-entities/name-availability](https://www.sos.ca.gov/business-programs/business-entities/name-availability)
   - Florida: [sunbiz.org](https://dos.myflorida.com/sunbiz/)
   - (Most states $10–50, one form.)
9. **Custom domain** — in Shopify admin: Settings → Domains → Connect existing → `graymuzzle.co`.
10. **Go live** — flip store to active, test a $1 order via Shopify Bogus Gateway, then launch first TikTok.

---

## What's in the repo

| Path | Purpose |
|---|---|
| `layout/theme.liquid` | Base HTML shell, meta, OG tags, schema, Klaviyo embed |
| `sections/` | Homepage hero, featured collection, trust row, testimonials, FAQ, header, footer |
| `snippets/` | Product card, price, **sticky mobile ATC**, cart drawer, JSON-LD |
| `templates/` | Online Store 2.0 JSON templates (product, collection, cart, index, blog, article, page) |
| `templates/page.terms.liquid` | Terms of Service (Revvy LLC, `{{LLC_STATE}}` token) |
| `templates/page.privacy.liquid` | Privacy Policy (CCPA/GDPR-aware) |
| `assets/theme.css` | Utility-first CSS, mobile-first, warm-grey + terracotta palette |
| `assets/theme.js` | Cart drawer, sticky ATC, AJAX add-to-cart |
| `config/settings_schema.json` | Theme customizer options |
| `config/settings_data.json` | GrayMuzzle brand defaults |
| `scripts/validate/run-apify-validation.ts` | Chains 3 Apify actors, prints PASS/FAIL gate |
| `scripts/seed-products.ts` | Seeds 8 SKUs into Shopify via Admin API |
| `scripts/generate-copy.ts` | Drafts PDP copy per SKU in brand voice |
| `.github/workflows/deploy.yml` | Push theme on merge to main |

---

## Before going live: find-and-replace tokens

Run once:
```bash
# Replace placeholder state with your LLC's state of formation
grep -rl '{{LLC_STATE}}' . | xargs sed -i '' 's/{{LLC_STATE}}/Delaware/g'   # or your state
```

Tokens:
- `{{LLC_STATE}}` — Revvy LLC state of formation (governing law in ToS)
- `{{SHOPIFY_STORE_URL}}` — `graymuzzle.myshopify.com` (set in GH Actions secrets)
- `{{KLAVIYO_PUBLIC_KEY}}` — set in Shopify theme customizer

---

## Product catalog (8 launch SKUs)

| SKU | Retail | Zendrop COGS | Margin | Supplier archetype |
|---|---|---|---|---|
| Orthopedic memory-foam bolster bed (M/L/XL) | $119 | $27 | 77% | Zendrop US |
| Anti-slip pet stairs (3-step foam) | $69 | $18 | 74% | Zendrop US |
| Folding car ramp (telescoping, 150 lb) | $109 | $32 | 71% | Spocket US |
| Pressure-wrap calming vest | $44 | $9 | 80% | Zendrop CN |
| Elevated slow-feeder bowl | $39 | $8 | 79% | Zendrop US |
| Heated orthopedic pad (thermostat) | $79 | $19 | 76% | Spocket US |
| Glucosamine + green-lipped-mussel chew (90ct) | $34 | $11 | 68% | MakersNutrition (white-label, add month 3) |
| Paw-grip non-slip socks (4-pack) | $19 | $3 | 84% | Zendrop CN |

Mix-weighted AOV ≈ **$85**, blended margin **~62%**, ROAS target **3.3**, net/order **~$25**, orders/yr for $20k: **~800**.

---

## Marketing playbook (90-day sprint)

**Primary channel: TikTok organic.** 1 video/day, 60 days, UGC-style. Hooks that work:
- "Signs your senior dog is silently suffering"
- "Why your vet won't tell you about this"
- "My 14-year-old Lab's glow-up after 30 days"
- "Stop buying puppy beds for senior dogs"

**Monthly trend refresh:** run `npm run validate` — pulls fresh TikTok Creative Center trends from `data_xplorer/tiktok-trends` and ranks sounds by 7-day growth.

**Paid (Meta):** start day 31 once organic baseline established.
- $20/day lookalike (1%) of site visitors
- $10/day cart-abandoner retargeting
- Creative: UGC clips from TikTok, reframed vertical 9:16 with captions

**Email (Klaviyo flows to build first):**
1. Welcome series (3 emails, 10% off code in email #2)
2. Abandoned cart (3 emails, 45min / 24h / 72h)
3. Post-purchase education ("How to introduce a new bed to a senior dog")
4. Win-back (90 days no purchase)

**SEO:** 12 blog articles included in `templates/article.json`. Target keywords:
- "when is a dog considered senior" (KD 12)
- "signs of pain in older dogs" (KD 18)
- "best bed for arthritic dog" (KD 22)
- "how to help old dog climb stairs" (KD 9)
- etc.

---

## Unit economics sanity check

```
Revenue per order          $85
- COGS (supplier+ship)    -$29   (34%)
- Ad spend                -$25   (30%)
- Platform fees (3%)      -$3
- Email/app stack         -$2    ($100/mo ÷ 50 orders)
- Misc (returns, CS)      -$1
---------------------------------
Net per order             ~$25
```

**Break-even: 40 orders/mo** (covers Shopify + Zendrop subs).
**$20k/yr net: 67 orders/mo** (realistic by month 5–6 with discipline).

---

## Verification (end-to-end test)

1. `npm --prefix scripts run validate` → PASS gate prints, `suppliers.json` written
2. `shopify theme push --development` → preview loads on *.myshopify.com with GrayMuzzle branding
3. Lighthouse audit (Chrome DevTools) on preview → Performance ≥ 85, SEO ≥ 95, Accessibility ≥ 90
4. `npm --prefix scripts run seed` → 8 products appear in Shopify admin
5. Shopify Bogus Gateway checkout → order flows to Zendrop sandbox
6. TikTok test post → measure 3-day engagement before paid spend

---

## Legal

GrayMuzzle Co. is a brand of **Revvy LLC**. All storefront operations, payment processing, supplier contracts, and domain ownership run under Revvy LLC's EIN. See `templates/page.terms.liquid` and `templates/page.privacy.liquid` (auto-published to `/pages/terms-of-service` and `/pages/privacy-policy`).
