/**
 * Prints per-SKU PDP copy in GrayMuzzle's brand voice (warm, direct, vet-adjacent),
 * for quick copy-paste into Shopify admin (or as a reference while editing seed-products.ts).
 *
 * Voice rules:
 *   - Second-person, talking to a senior-dog parent.
 *   - Specific over generic ("14 years of morning walks" > "for old dogs").
 *   - No hype. No exclamation points.
 *   - Quantified benefits ("7 inches of foam") beat adjectives ("thick foam").
 *   - Never a health/treatment claim. Keep regulatory-safe.
 */

type Block = { sku: string; hook: string; benefits: string[]; objection: string };

const COPY: Block[] = [
  {
    sku: 'GM-BED-L',
    hook: 'Your Lab has slept in the same bed for nine years. It deserves better than that now.',
    benefits: [
      '7 inches of CertiPUR-US® memory foam — not the 2-inch "orthopedic" layer you see elsewhere',
      'Bolster edge so he can rest his chin (they always want to rest their chin)',
      'Removable cover, machine wash, tumble dry low'
    ],
    objection: 'Dogs take 3–7 days to re-settle into a new bed. That\'s why we ship with a 30-day no-questions return.'
  },
  {
    sku: 'GM-STAIR-3',
    hook: 'The couch used to be a running jump. Now it\'s a hesitation.',
    benefits: [
      'Three 6-inch steps, each wide enough for a full paw plant',
      'Holds 150 lb — big Labs, Goldens, Aussies',
      'Assembles in 10 seconds, no hardware'
    ],
    objection: 'Teach him in under a week: treats on each step for 3 days, then let him self-lead.'
  },
  {
    sku: 'GM-RAMP',
    hook: 'Lifting a 70-lb senior into an SUV is how one of you gets hurt.',
    benefits: [
      'Telescopes 39" → 70" — fits SUVs, trucks, and minivans',
      'Aircraft-grade aluminum, only 10 lb',
      'High-grip tread, folds flat for the trunk'
    ],
    objection: 'Comes with a 30-day return. If your dog refuses the ramp, send it back.'
  },
  {
    sku: 'GM-VEST-M',
    hook: 'Thunder tonight. Vet Tuesday. Fourth of July coming.',
    benefits: [
      'Constant gentle pressure — the swaddle effect, backed by published anxiety research',
      'Velcro adjusts in seconds (no pullover over old ears)',
      'Breathable, machine-washable'
    ],
    objection: 'Works best the third time — put it on for 10 minutes a few afternoons before the storm.'
  },
  {
    sku: 'GM-BOWL',
    hook: 'She\'s bending her neck to eat. You can see it in her spine.',
    benefits: [
      'Elevated to 5" — the height vet techs recommend for dogs 10+ years',
      'Maze pattern slows gulping (reduces bloat risk)',
      'Stainless insert, silicone base, dishwasher-safe'
    ],
    objection: 'Some dogs eat slower, which is the point. Feeding takes 2–3 extra minutes.'
  },
  {
    sku: 'GM-HEAT',
    hook: 'January mornings are harder on arthritic joints than on you.',
    benefits: [
      'Vet-safe 102°F thermostat (same temp as a healthy dog\'s body)',
      'UL-listed, auto shut-off after 8 hours',
      'Goes under his existing bed — no need to replace it'
    ],
    objection: 'Chew-resistant cord wrap, but if your dog is a chewer, tuck the cord under the bed frame.'
  },
  {
    sku: 'GM-CHEW-90',
    hook: 'The supplement aisle at the vet is $60 for 60 days. This is 90 days for $34.',
    benefits: [
      '500 mg glucosamine + 250 mg chondroitin + 150 mg NZ green-lipped mussel per chew',
      'Bacon flavor dogs actually eat',
      'Made in a GMP-certified US facility'
    ],
    objection: 'Not a drug. Not intended to diagnose or treat disease. Consult your vet, especially if on NSAIDs.'
  },
  {
    sku: 'GM-SOCK-M',
    hook: 'He slips on the hardwood now. Watch him brace before he moves.',
    benefits: [
      'Silicone grip pads under a soft cotton sock',
      'Stretch cuffs don\'t cut circulation (check two fingers of slack)',
      '4-pack — they lose one. Always.'
    ],
    objection: 'Takes a week for most dogs to stop trying to pull them off. Go 10 minutes at a time to start.'
  }
];

function render(b: Block): string {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SKU: ${b.sku}

HOOK (first line of PDP)
${b.hook}

BENEFITS (bulleted)
${b.benefits.map(x => '  • ' + x).join('\n')}

OBJECTION HANDLING (below ATC)
${b.objection}
`;
}

console.log('GrayMuzzle Co. — PDP copy deck\n');
COPY.forEach(b => console.log(render(b)));
console.log('\n(Paste into Shopify admin → Products → Description, or update seed-products.ts descriptionHtml.)');
