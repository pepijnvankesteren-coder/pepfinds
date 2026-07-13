/**
 * Keyword-based auto-categorization. Reads a product title (and optional
 * description) and infers a category + a few tags — no manual entry, no
 * external service. Used by the importers (Yupoo / bulk / bookmarklet) to
 * pre-fill drafts, and by the "Detect" button in the admin product form.
 *
 * Deliberately keyword-only: fast, free, deterministic. It recognizes explicit
 * garment words ("hoodie", "cargo pants") and common sneaker model names
 * ("AJ1", "Yeezy", "Dunk"). Tags stay to garment type / colour / material and
 * avoid brand names, in line with the site's product positioning.
 */

/** The fixed category set. */
export const CATEGORIES = [
  "Shoes",
  "Outerwear",
  "Tops",
  "Bottoms",
  "Headwear",
  "Bags",
  "Accessories",
] as const;
export type Category = (typeof CATEGORIES)[number];

// Category rules, in priority order (used to break score ties). Sneaker model
// names help detect Shoes even when the word "shoe" isn't in the title.
const RULES: { category: Category; keywords: string[] }[] = [
  {
    category: "Shoes",
    keywords: [
      "shoe", "shoes", "sneaker", "sneakers", "trainer", "trainers", "footwear",
      "boot", "boots", "cleat", "cleats", "slide", "slides", "sandal", "sandals",
      "loafer", "loafers", "dunk", "dunks", "jordan", "aj1", "aj4", "aj11",
      "af1", "air force", "air max", "airmax", "yeezy", "foam runner",
      "new balance", "samba", "gazelle", "campus", "ozweego",
    ],
  },
  {
    category: "Outerwear",
    keywords: [
      "jacket", "jackets", "coat", "coats", "puffer", "parka", "windbreaker",
      "bomber", "gilet", "down jacket", "raincoat", "trench", "anorak",
      "overcoat",
    ],
  },
  {
    category: "Headwear",
    keywords: [
      "hat", "hats", "cap", "caps", "beanie", "bucket hat", "snapback",
      "balaclava", "durag", "headband",
    ],
  },
  {
    category: "Bags",
    keywords: [
      "bag", "bags", "backpack", "tote", "crossbody", "handbag", "duffle",
      "duffel", "wallet", "purse", "satchel", "sling", "pouch",
    ],
  },
  {
    category: "Bottoms",
    keywords: [
      "pants", "pant", "jeans", "shorts", "trouser", "trousers", "sweatpants",
      "sweatpant", "joggers", "jogger", "cargo", "cargos", "leggings", "skirt",
      "chinos",
    ],
  },
  {
    category: "Tops",
    keywords: [
      "hoodie", "hoody", "hoodies", "tee", "tees", "t-shirt", "tshirt",
      "t shirt", "shirt", "shirts", "sweater", "sweaters", "sweatshirt",
      "crewneck", "jumper", "pullover", "polo", "longsleeve", "long sleeve",
      "tank", "jersey", "cardigan", "knit", "vest",
    ],
  },
  {
    category: "Accessories",
    keywords: [
      "belt", "belts", "sunglasses", "scarf", "gloves", "glove", "socks",
      "sock", "watch", "necklace", "bracelet", "ring", "earring", "earrings",
      "jewelry", "jewellery", "tie", "keychain", "mask", "umbrella",
    ],
  },
];

// Words worth surfacing as tags: garment type + colour + material, no brands.
const TAG_WORDS = [
  // garments
  "hoodie", "tee", "t-shirt", "shirt", "sweater", "sweatshirt", "polo",
  "jacket", "coat", "puffer", "pants", "sweatpants", "trousers", "jeans",
  "shorts", "joggers", "cargo", "cargos", "leggings", "sneaker", "trainers",
  "boot", "sandals", "cap", "hat", "beanie", "bag", "backpack", "tote", "belt",
  "sunglasses", "socks", "scarf", "shoes", "tracksuit", "jersey", "vest",
  // colours
  "black", "white", "grey", "gray", "blue", "navy", "red", "green", "pink",
  "purple", "yellow", "orange", "brown", "beige", "cream", "tan", "olive",
  "khaki", "burgundy", "maroon", "silver", "gold",
  // materials
  "fleece", "denim", "leather", "suede", "cotton", "wool", "knit", "mesh",
  "nylon", "tech", "corduroy", "velour", "satin", "canvas",
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Precompiled `\bkeyword\b` matchers, built once at module load. */
const COMPILED_RULES = RULES.map((rule) => ({
  category: rule.category,
  matchers: rule.keywords.map((kw) => new RegExp(`\\b${escapeRegExp(kw)}\\b`, "i")),
}));
const COMPILED_TAGS = TAG_WORDS.map((word) => ({
  word,
  matcher: new RegExp(`\\b${escapeRegExp(word)}\\b`, "i"),
}));

export interface Categorized {
  /** Best-matching category, or null when nothing recognizable was found. */
  category: Category | null;
  /** Up to a handful of lowercase tags (garment type, colour, material). */
  tags: string[];
}

/**
 * Infer a category + tags from a product title (optionally plus description).
 * Picks the category with the most keyword hits; ties go to the higher-priority
 * category in RULES.
 */
export function categorize(title: string, description = ""): Categorized {
  const text = `${title} ${description}`;

  let category: Category | null = null;
  let bestScore = 0;
  for (const rule of COMPILED_RULES) {
    let score = 0;
    for (const matcher of rule.matchers) if (matcher.test(text)) score += 1;
    if (score > bestScore) {
      bestScore = score;
      category = rule.category;
    }
  }

  const tags: string[] = [];
  for (const { word, matcher } of COMPILED_TAGS) {
    if (matcher.test(text)) {
      const tag = word.toLowerCase();
      if (!tags.includes(tag)) tags.push(tag);
    }
    if (tags.length >= 8) break;
  }

  return { category, tags };
}
