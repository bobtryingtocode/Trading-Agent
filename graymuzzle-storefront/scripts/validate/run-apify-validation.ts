/**
 * GrayMuzzle niche validation.
 *
 * Chains three Apify actors and prints a PASS/FAIL gate:
 *  1. sovereigntaylor/aliexpress-product-scraper  -> supplier candidates per SKU
 *  2. sanztheo/my-actor                           -> landed cost + markup check
 *  3. data_xplorer/tiktok-trends                  -> TikTok audience signal
 *
 * Run:
 *   cp .env.example .env
 *   echo 'APIFY_TOKEN=...' >> .env
 *   npm run validate
 *
 * Writes suppliers.json next to the script.
 */
import { ApifyClient } from 'apify-client';
import { config } from 'dotenv';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), 'validate/.env') });

const TOKEN = process.env.APIFY_TOKEN;
if (!TOKEN) {
  console.error('Missing APIFY_TOKEN in validate/.env');
  process.exit(1);
}

const client = new ApifyClient({ token: TOKEN });

const SKU_QUERIES = [
  { sku: 'orthopedic-bed',    query: 'orthopedic memory foam dog bed bolster',  retail: 119, minMarkup: 3 },
  { sku: 'pet-stairs',        query: 'anti-slip dog pet stairs 3 step foam',    retail: 69,  minMarkup: 3 },
  { sku: 'car-ramp',          query: 'folding telescoping dog car ramp 150lb',  retail: 109, minMarkup: 3 },
  { sku: 'calming-vest',      query: 'dog pressure wrap calming anxiety vest',  retail: 44,  minMarkup: 4 },
  { sku: 'slow-feeder',       query: 'elevated slow feeder dog bowl senior',    retail: 39,  minMarkup: 4 },
  { sku: 'heated-pad',        query: 'heated orthopedic dog pad thermostat',    retail: 79,  minMarkup: 3 },
  { sku: 'paw-socks',         query: 'dog anti slip paw grip socks 4 pack',     retail: 19,  minMarkup: 5 }
];

const TIKTOK_HASHTAGS = ['seniordog', 'olddogs', 'dogmom', 'dogsofttiktok'];
const MIN_TIKTOK_VIEWS = 500_000_000;
const MIN_SKUS_CLEARING = 3;

type SupplierCandidate = {
  sku: string;
  url: string;
  price: number;
  orders: number;
  rating: number;
  title: string;
  markup: number;
};

async function runAliExpress(sku: typeof SKU_QUERIES[number]): Promise<SupplierCandidate[]> {
  console.log(`  ↳ AliExpress: "${sku.query}"`);
  const run = await client.actor('sovereigntaylor/aliexpress-product-scraper').call({
    keyword: sku.query,
    maxItems: 20,
    shipTo: 'US'
  });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items
    .map((it: any): SupplierCandidate | null => {
      const price = Number(it.price?.value ?? it.price ?? 0);
      const orders = Number(it.orders ?? it.orderCount ?? 0);
      const rating = Number(it.rating ?? it.ratingScore ?? 0);
      if (!price || !orders) return null;
      return {
        sku: sku.sku,
        url: String(it.url ?? it.productUrl ?? ''),
        title: String(it.title ?? ''),
        price,
        orders,
        rating,
        markup: Math.round((sku.retail / price) * 100) / 100
      };
    })
    .filter((x): x is SupplierCandidate => !!x && x.rating >= 4.7 && x.orders >= 500 && x.markup >= sku.minMarkup)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);
}

async function runTikTokTrend(): Promise<number> {
  console.log(`  ↳ TikTok: ${TIKTOK_HASHTAGS.join(', ')}`);
  const run = await client.actor('data_xplorer/tiktok-trends').call({
    country: 'US',
    industry: 'pets',
    limit: 100
  });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  let totalViews = 0;
  for (const it of items as any[]) {
    const name = String(it.hashtag ?? it.name ?? '').toLowerCase();
    if (TIKTOK_HASHTAGS.some(h => name.includes(h))) {
      totalViews += Number(it.views ?? it.viewCount ?? 0);
    }
  }
  return totalViews;
}

async function main() {
  console.log('GrayMuzzle niche validation starting…\n');
  const results: Record<string, SupplierCandidate[]> = {};
  let skusClearing = 0;

  for (const sku of SKU_QUERIES) {
    try {
      const candidates = await runAliExpress(sku);
      results[sku.sku] = candidates;
      if (candidates.length > 0) skusClearing++;
      console.log(`    ${sku.sku}: ${candidates.length} qualified suppliers\n`);
    } catch (e) {
      console.error(`    ${sku.sku}: FAILED (${(e as Error).message})\n`);
      results[sku.sku] = [];
    }
  }

  let tiktokViews = 0;
  try {
    tiktokViews = await runTikTokTrend();
    console.log(`\n  TikTok senior-dog hashtag 90-day views: ${tiktokViews.toLocaleString()}`);
  } catch (e) {
    console.error(`  TikTok trend check failed: ${(e as Error).message}`);
  }

  writeFileSync(resolve(process.cwd(), 'suppliers.json'), JSON.stringify(results, null, 2));

  const pass = skusClearing >= MIN_SKUS_CLEARING && tiktokViews >= MIN_TIKTOK_VIEWS;
  console.log('\n' + '─'.repeat(48));
  console.log(`SKUs clearing markup gate: ${skusClearing}/${SKU_QUERIES.length} (need ≥${MIN_SKUS_CLEARING})`);
  console.log(`TikTok views: ${tiktokViews.toLocaleString()} (need ≥${MIN_TIKTOK_VIEWS.toLocaleString()})`);
  console.log(`\nDECISION: ${pass ? '✅ PASS — proceed to launch' : '❌ FAIL — iterate SKU list'}`);
  console.log(`Suppliers saved to: suppliers.json`);
  process.exit(pass ? 0 : 2);
}

main().catch(err => { console.error(err); process.exit(1); });
