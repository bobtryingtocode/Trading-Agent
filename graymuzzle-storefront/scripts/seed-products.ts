/**
 * Seeds GrayMuzzle Co.'s 8 launch SKUs into Shopify via Admin GraphQL API.
 *
 * Prereq:
 *   - Create a Shopify custom app in admin, grant write_products scope
 *   - Copy the Admin API access token
 *   - Set env:
 *       SHOPIFY_STORE=graymuzzle.myshopify.com
 *       SHOPIFY_ADMIN_TOKEN=shpat_xxx
 *
 * Run: npm run seed
 */
import { config } from 'dotenv';
import fetch from 'node-fetch';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '.env') });

const STORE = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
if (!STORE || !TOKEN) {
  console.error('Missing SHOPIFY_STORE or SHOPIFY_ADMIN_TOKEN');
  process.exit(1);
}

type Seed = {
  title: string;
  handle: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  options?: { name: string; values: string[] }[];
  variants: { option1?: string; price: string; sku: string; inventoryQuantity?: number }[];
};

const PRODUCTS: Seed[] = [
  {
    title: 'GrayMuzzle Orthopedic Memory-Foam Bolster Bed',
    handle: 'orthopedic-bolster-bed',
    productType: 'Beds',
    tags: ['orthopedic', 'bed', 'arthritis', 'senior'],
    descriptionHtml: `<p>Seven inches of vet-recommended memory foam with a soft-bolster edge so your senior dog can rest his chin, the way he likes.</p>
<ul><li>CertiPUR-US® foam core — no off-gassing</li><li>Removable, machine-washable cover</li><li>Non-slip base (won't slide on hardwood)</li><li>Free US shipping, 30-day returns</li></ul>`,
    options: [{ name: 'Size', values: ['Medium (30"x20")', 'Large (36"x27")', 'X-Large (44"x33")'] }],
    variants: [
      { option1: 'Medium (30"x20")',   price: '99.00',  sku: 'GM-BED-M', inventoryQuantity: 25 },
      { option1: 'Large (36"x27")',    price: '119.00', sku: 'GM-BED-L', inventoryQuantity: 25 },
      { option1: 'X-Large (44"x33")',  price: '149.00', sku: 'GM-BED-XL', inventoryQuantity: 25 }
    ]
  },
  {
    title: 'GrayMuzzle Anti-Slip Pet Stairs (3-Step)',
    handle: 'pet-stairs-3-step',
    productType: 'Mobility',
    tags: ['stairs', 'mobility', 'senior'],
    descriptionHtml: `<p>Dense high-rebound foam with a grippy, machine-washable cover. Sized so small and medium dogs can reach the bed or couch without the hop that hurts their hips.</p><ul><li>Holds up to 150 lb</li><li>Non-slip base and tread</li><li>Assembles in 10 seconds</li></ul>`,
    variants: [{ price: '69.00', sku: 'GM-STAIR-3', inventoryQuantity: 40 }]
  },
  {
    title: 'GrayMuzzle Folding Car Ramp (Telescoping, 150 lb)',
    handle: 'folding-car-ramp',
    productType: 'Mobility',
    tags: ['ramp', 'mobility', 'car', 'senior'],
    descriptionHtml: `<p>Telescopes from 39" to 70" — long enough for SUVs and trucks. High-traction tread, aircraft-grade aluminum frame, folds flat for the trunk.</p><ul><li>Supports 150 lb</li><li>Weighs only 10 lb</li><li>Anti-slip rubber feet</li></ul>`,
    variants: [{ price: '109.00', sku: 'GM-RAMP', inventoryQuantity: 30 }]
  },
  {
    title: 'GrayMuzzle Pressure-Wrap Calming Vest',
    handle: 'calming-vest',
    productType: 'Calm',
    tags: ['calming', 'anxiety', 'thunder', 'senior'],
    descriptionHtml: `<p>Gentle, constant pressure on your dog's torso — the same principle swaddling uses on infants. Cool in thunder, fireworks, and vet visits.</p><ul><li>Four sizes, XS–XL</li><li>Breathable, machine-washable</li><li>Velcro adjust in seconds</li></ul>`,
    options: [{ name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] }],
    variants: [
      { option1: 'XS', price: '39.00', sku: 'GM-VEST-XS', inventoryQuantity: 20 },
      { option1: 'S',  price: '44.00', sku: 'GM-VEST-S',  inventoryQuantity: 20 },
      { option1: 'M',  price: '44.00', sku: 'GM-VEST-M',  inventoryQuantity: 20 },
      { option1: 'L',  price: '49.00', sku: 'GM-VEST-L',  inventoryQuantity: 20 },
      { option1: 'XL', price: '54.00', sku: 'GM-VEST-XL', inventoryQuantity: 20 }
    ]
  },
  {
    title: 'GrayMuzzle Elevated Slow-Feeder Bowl',
    handle: 'elevated-slow-feeder',
    productType: 'Feeding',
    tags: ['feeder', 'slow', 'neck', 'senior'],
    descriptionHtml: `<p>Raised bowl height reduces neck strain on older dogs; the maze pattern slows gulping that causes bloat. Stainless insert, silicone base, dishwasher-safe.</p>`,
    variants: [{ price: '39.00', sku: 'GM-BOWL', inventoryQuantity: 60 }]
  },
  {
    title: 'GrayMuzzle Heated Orthopedic Pad',
    handle: 'heated-orthopedic-pad',
    productType: 'Beds',
    tags: ['heated', 'bed', 'arthritis', 'senior'],
    descriptionHtml: `<p>Low-wattage warming pad with a vet-safe 102°F thermostat and chew-resistant cord wrap. Goes under their existing bed for arthritic joints on cold mornings.</p><ul><li>UL-listed</li><li>Auto shut-off after 8h</li><li>Removable, washable cover</li></ul>`,
    variants: [{ price: '79.00', sku: 'GM-HEAT', inventoryQuantity: 30 }]
  },
  {
    title: 'GrayMuzzle Joint Chews — Glucosamine + Green-Lipped Mussel (90 ct)',
    handle: 'joint-chews',
    productType: 'Supplements',
    tags: ['supplement', 'joint', 'glucosamine', 'senior'],
    descriptionHtml: `<p>Daily soft chew with 500 mg glucosamine, 250 mg chondroitin, and 150 mg New Zealand green-lipped mussel — a gold-standard combo for joint comfort. Bacon flavor dogs actually eat.</p><p><em>Not a drug. Not intended to diagnose or treat disease. Consult your vet.</em></p>`,
    variants: [{ price: '34.00', sku: 'GM-CHEW-90', inventoryQuantity: 100 }]
  },
  {
    title: 'GrayMuzzle Paw-Grip Non-Slip Socks (4-Pack)',
    handle: 'paw-grip-socks',
    productType: 'Mobility',
    tags: ['socks', 'grip', 'hardwood', 'senior'],
    descriptionHtml: `<p>Silicone grip pads under a soft cotton sock. Gives senior dogs traction on hardwood and tile so they stand up with confidence.</p>`,
    options: [{ name: 'Size', values: ['S', 'M', 'L'] }],
    variants: [
      { option1: 'S', price: '19.00', sku: 'GM-SOCK-S', inventoryQuantity: 40 },
      { option1: 'M', price: '19.00', sku: 'GM-SOCK-M', inventoryQuantity: 40 },
      { option1: 'L', price: '19.00', sku: 'GM-SOCK-L', inventoryQuantity: 40 }
    ]
  }
];

const ENDPOINT = `https://${STORE}/admin/api/2025-01/graphql.json`;

async function gql<T = any>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN!
    },
    body: JSON.stringify({ query, variables })
  });
  const json = (await res.json()) as any;
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

const PRODUCT_CREATE = `
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product { id handle title }
      userErrors { field message }
    }
  }`;

async function main() {
  console.log(`Seeding ${PRODUCTS.length} products into ${STORE}…`);
  for (const p of PRODUCTS) {
    const input: any = {
      title: p.title,
      handle: p.handle,
      descriptionHtml: p.descriptionHtml,
      productType: p.productType,
      tags: p.tags,
      vendor: 'GrayMuzzle Co.',
      status: 'DRAFT'
    };
    if (p.options) input.options = p.options.map(o => o.name);
    input.variants = p.variants.map(v => ({
      price: v.price,
      sku: v.sku,
      options: v.option1 ? [v.option1] : undefined,
      inventoryQuantities: v.inventoryQuantity
        ? [{ availableQuantity: v.inventoryQuantity, locationId: 'gid://shopify/Location/PRIMARY' }]
        : undefined
    }));

    try {
      const data = await gql<{ productCreate: { product: { handle: string } | null; userErrors: any[] } }>(
        PRODUCT_CREATE, { input }
      );
      const errs = data.productCreate.userErrors;
      if (errs.length) {
        console.log(`  ⚠ ${p.handle}: ${JSON.stringify(errs)}`);
      } else {
        console.log(`  ✓ ${p.handle}`);
      }
    } catch (e) {
      console.log(`  ✗ ${p.handle}: ${(e as Error).message}`);
    }
  }
  console.log('\nDone. Products are in DRAFT status — review in Shopify admin, then connect to Zendrop for fulfillment before publishing.');
}

main().catch(err => { console.error(err); process.exit(1); });
