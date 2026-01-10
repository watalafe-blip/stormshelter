// pages/api/google-feed.xml.js
// HYBRID GOOGLE SHOPPING FEED
// - 49 State listings (broad search visibility)
// - 50+ Major city listings (accurate pricing + specific searches)
// - Total: ~100 products for optimal coverage
//
// FIXES APPLIED:
// ✅ Removed shipping_weight (was causing "shipping weight value too high")
// ✅ Set shipping cost to 0.00 (price includes delivery)
// ✅ Fixed image URLs to use actual working URLs
// ✅ Added inventory quantity
// ✅ Removed misleading "FEMA Certified" claims
// ✅ Updated to accurate "Built to FEMA P-320 standards"
// ✅ Corrected capacity to 4-6 person (based on 27 sq ft)

export default function handler(req, res) {
  const BASE_PRICE = 4599.0;
  const RATE_PER_MILE = 5.2;

  // Your actual product landing page
  const PRODUCT_PAGE_BASE = "https://www.homedefendpro.com/storm-shelter";

  const baseProduct = {
    id: "706900",
    brand: "Home Defend Pro",
    condition: "new",
    availability: "in stock",
    google_product_category: "596",
    product_type: "Home & Garden > Emergency Preparedness > Storm Shelters",

    // Dimensions
    shipping_length: "72 in",
    shipping_width: "54 in",
    shipping_height: "78 in",

    mpn: "706900",

    // ✅ FIXED: Using your actual working image URLs
    image_link:
      "https://www.homedefendpro.com/assets/Office-SI-Storm-Shelter_(1)_1767252448693-BgTgNVbv.jpg",
    additional_image_link: [
      "https://www.homedefendpro.com/assets/ChatGPT_Image_Dec_31__2025__01_02_10_AM_1767253312476-DsupG_Wo.png",
      "https://www.homedefendpro.com/assets/lifestyle_backyard_closed_hatch-CB2R1sMa.png",
      "https://www.homedefendpro.com/assets/shelter-blueprint-B5RKgi0K.png",
    ],

    identifier_exists: "no",
    quantity: 10,

    custom_labels: {
      custom_label_0: "FEMA P-320 Compliant",
      custom_label_1: "EF5 Rated",
      custom_label_2: "Made in USA",
      custom_label_3: "Underground Shelter",
      custom_label_4: "10 Year Warranty",
    },
  };

  // 49 STATE LISTINGS (for broad search visibility)
  const stateProducts = [
    { location: "Alabama", abbr: "AL", distance: 680, type: "state" },
    { location: "Arizona", abbr: "AZ", distance: 1100, type: "state" },
    { location: "Arkansas", abbr: "AR", distance: 320, type: "state" },
    { location: "California", abbr: "CA", distance: 1600, type: "state" },
    { location: "Colorado", abbr: "CO", distance: 600, type: "state" },
    { location: "Connecticut", abbr: "CT", distance: 1200, type: "state" },
    { location: "Delaware", abbr: "DE", distance: 1100, type: "state" },
    { location: "District of Columbia", abbr: "DC", distance: 1000, type: "state" },
    { location: "Florida", abbr: "FL", distance: 1150, type: "state" },
    { location: "Georgia", abbr: "GA", distance: 820, type: "state" },
    { location: "Idaho", abbr: "ID", distance: 1300, type: "state" },
    { location: "Illinois", abbr: "IL", distance: 280, type: "state" },
    { location: "Indiana", abbr: "IN", distance: 420, type: "state" },
    { location: "Iowa", abbr: "IA", distance: 200, type: "state" },
    { location: "Kansas", abbr: "KS", distance: 50, type: "state" },
    { location: "Kentucky", abbr: "KY", distance: 400, type: "state" },
    { location: "Louisiana", abbr: "LA", distance: 700, type: "state" },
    { location: "Maine", abbr: "ME", distance: 1450, type: "state" },
    { location: "Maryland", abbr: "MD", distance: 1000, type: "state" },
    { location: "Massachusetts", abbr: "MA", distance: 1250, type: "state" },
    { location: "Michigan", abbr: "MI", distance: 650, type: "state" },
    { location: "Minnesota", abbr: "MN", distance: 520, type: "state" },
    { location: "Mississippi", abbr: "MS", distance: 600, type: "state" },
    { location: "Missouri", abbr: "MO", distance: 20, type: "state" },
    { location: "Montana", abbr: "MT", distance: 1150, type: "state" },
    { location: "Nebraska", abbr: "NE", distance: 180, type: "state" },
    { location: "Nevada", abbr: "NV", distance: 1250, type: "state" },
    { location: "New Hampshire", abbr: "NH", distance: 1300, type: "state" },
    { location: "New Jersey", abbr: "NJ", distance: 1100, type: "state" },
    { location: "New Mexico", abbr: "NM", distance: 850, type: "state" },
    { location: "New York", abbr: "NY", distance: 1150, type: "state" },
    { location: "North Carolina", abbr: "NC", distance: 950, type: "state" },
    { location: "North Dakota", abbr: "ND", distance: 750, type: "state" },
    { location: "Ohio", abbr: "OH", distance: 620, type: "state" },
    { location: "Oklahoma", abbr: "OK", distance: 150, type: "state" },
    { location: "Oregon", abbr: "OR", distance: 1700, type: "state" },
    { location: "Pennsylvania", abbr: "PA", distance: 950, type: "state" },
    { location: "Rhode Island", abbr: "RI", distance: 1250, type: "state" },
    { location: "South Carolina", abbr: "SC", distance: 900, type: "state" },
    { location: "South Dakota", abbr: "SD", distance: 580, type: "state" },
    { location: "Tennessee", abbr: "TN", distance: 480, type: "state" },
    { location: "Texas", abbr: "TX", distance: 550, type: "state" },
    { location: "Utah", abbr: "UT", distance: 950, type: "state" },
    { location: "Vermont", abbr: "VT", distance: 1300, type: "state" },
    { location: "Virginia", abbr: "VA", distance: 900, type: "state" },
    { location: "Washington", abbr: "WA", distance: 1750, type: "state" },
    { location: "West Virginia", abbr: "WV", distance: 720, type: "state" },
    { location: "Wisconsin", abbr: "WI", distance: 480, type: "state" },
    { location: "Wyoming", abbr: "WY", distance: 680, type: "state" },
  ];

  // 50+ MAJOR CITY LISTINGS (accurate pricing + specific searches)
  // Focused on: Tornado Alley, High Risk Areas, High Population Centers
  const cityProducts = [
    // OKLAHOMA (Tornado Alley - High Priority)
    { location: "Oklahoma City", state: "Oklahoma", abbr: "OK", distance: 350, type: "city" },
    { location: "Tulsa", state: "Oklahoma", abbr: "OK", distance: 240, type: "city" },
    { location: "Norman", state: "Oklahoma", abbr: "OK", distance: 360, type: "city" },
    { location: "Edmond", state: "Oklahoma", abbr: "OK", distance: 340, type: "city" },

    // KANSAS (Tornado Alley)
    { location: "Wichita", state: "Kansas", abbr: "KS", distance: 200, type: "city" },
    { location: "Overland Park", state: "Kansas", abbr: "KS", distance: 170, type: "city" },
    { location: "Kansas City", state: "Kansas", abbr: "KS", distance: 150, type: "city" },
    { location: "Topeka", state: "Kansas", abbr: "KS", distance: 100, type: "city" },

    // TEXAS (High Risk + Population)
    { location: "Dallas", state: "Texas", abbr: "TX", distance: 630, type: "city" },
    { location: "Fort Worth", state: "Texas", abbr: "TX", distance: 650, type: "city" },
    { location: "Houston", state: "Texas", abbr: "TX", distance: 850, type: "city" },
    { location: "San Antonio", state: "Texas", abbr: "TX", distance: 950, type: "city" },
    { location: "Austin", state: "Texas", abbr: "TX", distance: 850, type: "city" },
    { location: "Amarillo", state: "Texas", abbr: "TX", distance: 550, type: "city" },
    { location: "Lubbock", state: "Texas", abbr: "TX", distance: 600, type: "city" },

    // MISSOURI (Home State + High Risk)
    { location: "Kansas City", state: "Missouri", abbr: "MO", distance: 150, type: "city" },
    { location: "St. Louis", state: "Missouri", abbr: "MO", distance: 200, type: "city" },
    { location: "Springfield", state: "Missouri", abbr: "MO", distance: 100, type: "city" },
    { location: "Columbia", state: "Missouri", abbr: "MO", distance: 120, type: "city" },
    { location: "Joplin", state: "Missouri", abbr: "MO", distance: 80, type: "city" },

    // ARKANSAS (High Risk)
    { location: "Little Rock", state: "Arkansas", abbr: "AR", distance: 280, type: "city" },
    { location: "Fort Smith", state: "Arkansas", abbr: "AR", distance: 200, type: "city" },
    { location: "Fayetteville", state: "Arkansas", abbr: "AR", distance: 160, type: "city" },

    // TENNESSEE (Dixie Alley)
    { location: "Nashville", state: "Tennessee", abbr: "TN", distance: 480, type: "city" },
    { location: "Memphis", state: "Tennessee", abbr: "TN", distance: 380, type: "city" },
    { location: "Knoxville", state: "Tennessee", abbr: "TN", distance: 650, type: "city" },
    { location: "Chattanooga", state: "Tennessee", abbr: "TN", distance: 580, type: "city" },

    // ALABAMA (Dixie Alley)
    { location: "Birmingham", state: "Alabama", abbr: "AL", distance: 600, type: "city" },
    { location: "Montgomery", state: "Alabama", abbr: "AL", distance: 750, type: "city" },
    { location: "Huntsville", state: "Alabama", abbr: "AL", distance: 520, type: "city" },
    { location: "Mobile", state: "Alabama", abbr: "AL", distance: 820, type: "city" },

    // MISSISSIPPI (Dixie Alley)
    { location: "Jackson", state: "Mississippi", abbr: "MS", distance: 520, type: "city" },
    { location: "Gulfport", state: "Mississippi", abbr: "MS", distance: 750, type: "city" },
    { location: "Hattiesburg", state: "Mississippi", abbr: "MS", distance: 680, type: "city" },

    // LOUISIANA
    { location: "New Orleans", state: "Louisiana", abbr: "LA", distance: 780, type: "city" },
    { location: "Baton Rouge", state: "Louisiana", abbr: "LA", distance: 720, type: "city" },
    { location: "Shreveport", state: "Louisiana", abbr: "LA", distance: 480, type: "city" },

    // GEORGIA
    { location: "Atlanta", state: "Georgia", abbr: "GA", distance: 750, type: "city" },
    { location: "Augusta", state: "Georgia", abbr: "GA", distance: 850, type: "city" },
    { location: "Columbus", state: "Georgia", abbr: "GA", distance: 780, type: "city" },

    // ILLINOIS (High Population)
    { location: "Chicago", state: "Illinois", abbr: "IL", distance: 420, type: "city" },
    { location: "Springfield", state: "Illinois", abbr: "IL", distance: 180, type: "city" },
    { location: "Peoria", state: "Illinois", abbr: "IL", distance: 220, type: "city" },

    // INDIANA
    { location: "Indianapolis", state: "Indiana", abbr: "IN", distance: 450, type: "city" },
    { location: "Fort Wayne", state: "Indiana", abbr: "IN", distance: 580, type: "city" },

    // IOWA
    { location: "Des Moines", state: "Iowa", abbr: "IA", distance: 180, type: "city" },
    { location: "Cedar Rapids", state: "Iowa", abbr: "IA", distance: 250, type: "city" },

    // NEBRASKA
    { location: "Omaha", state: "Nebraska", abbr: "NE", distance: 180, type: "city" },
    { location: "Lincoln", state: "Nebraska", abbr: "NE", distance: 200, type: "city" },

    // OHIO
    { location: "Columbus", state: "Ohio", abbr: "OH", distance: 620, type: "city" },
    { location: "Cincinnati", state: "Ohio", abbr: "OH", distance: 520, type: "city" },

    // NORTH CAROLINA
    { location: "Charlotte", state: "North Carolina", abbr: "NC", distance: 880, type: "city" },
    { location: "Raleigh", state: "North Carolina", abbr: "NC", distance: 950, type: "city" },
  ];

  // Combine all products
  const allProducts = [...stateProducts, ...cityProducts];

  const calcTotalPrice = (distanceMiles) =>
    +(BASE_PRICE + distanceMiles * RATE_PER_MILE).toFixed(2);
  
  const DISCOUNT_AMOUNT = 900.0;
  
  const calcSalePrice = (regularPrice) =>
    +(regularPrice - DISCOUNT_AMOUNT).toFixed(2);

  const buildTitle = (product) => {
    if (product.type === "state") {
      return `Underground Concrete Storm Shelter Delivered to ${product.location} - EF5-Rated Protection - 4-6 Person - FEMA P-320 Compliant`;
    } else {
      // City listing
      return `Underground Concrete Storm Shelter ${product.location} ${product.abbr} - EF5-Rated Protection - 4-6 Person - FEMA P-320 Compliant`;
    }
  };

  const buildDescription = (product) => {
    if (product.type === "state") {
      return `Underground concrete storm shelter delivered to ${product.location}. Built to FEMA P-320 standards for EF5-rated tornado protection. Manufactured in Missouri ships nationwide. 4-6 person capacity with 10-year warranty. Price includes delivery to ${product.location}.`;
    } else {
      // City listing
      return `Underground concrete storm shelter delivered to ${product.location}, ${product.state}. Built to FEMA P-320 standards for EF5-rated tornado protection. Manufactured in Missouri ships nationwide. 4-6 person capacity with 10-year warranty. Price includes delivery to ${product.location}.`;
    }
  };

  const generateProductItem = (product) => {
    const productId = product.type === "state" 
      ? `${baseProduct.id}-${product.abbr}`
      : `${baseProduct.id}-${product.abbr}-${product.location.replace(/\s+/g, '')}`;
    
    const title = buildTitle(product);
    const description = buildDescription(product);

    const totalPrice = calcTotalPrice(product.distance);
    const salePrice = calcSalePrice(totalPrice);
    
    // Sale effective dates - set to your desired promotion period
    const saleStartDate = '2025-01-10T00:00-06:00';
    const saleEndDate = '2025-03-31T23:59-06:00';
    
    const locationParam = product.type === "state"
      ? `state=${encodeURIComponent(product.abbr)}`
      : `city=${encodeURIComponent(product.location)}&state=${encodeURIComponent(product.abbr)}`;
    
    // Use sale price in the URL so website shows discounted price
    const productLink = `${PRODUCT_PAGE_BASE}?${locationParam}&price=${encodeURIComponent(salePrice.toFixed(2))}`;

    return `    <item>
      <g:id>${escapeXml(productId)}</g:id>
      <g:item_group_id>${escapeXml(baseProduct.id)}</g:item_group_id>

      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>

      <g:link>${escapeXml(productLink)}</g:link>

      <g:image_link>${escapeXml(baseProduct.image_link)}</g:image_link>
      ${baseProduct.additional_image_link
        .map(
          (img) =>
            `<g:additional_image_link>${escapeXml(
              img
            )}</g:additional_image_link>`
        )
        .join("\n      ")}

      <g:availability>${escapeXml(baseProduct.availability)}</g:availability>
      <g:price>${totalPrice.toFixed(2)} USD</g:price>
      <g:sale_price>${salePrice.toFixed(2)} USD</g:sale_price>
      <g:sale_price_effective_date>${saleStartDate}/${saleEndDate}</g:sale_price_effective_date>
      
      <g:quantity>${baseProduct.quantity}</g:quantity>

      <g:brand>${escapeXml(baseProduct.brand)}</g:brand>
      <g:condition>${escapeXml(baseProduct.condition)}</g:condition>

      <g:mpn>${escapeXml(baseProduct.mpn)}-${escapeXml(product.abbr)}</g:mpn>
      <g:identifier_exists>${escapeXml(baseProduct.identifier_exists)}</g:identifier_exists>

      <g:google_product_category>${escapeXml(
        baseProduct.google_product_category
      )}</g:google_product_category>
      <g:product_type>${escapeXml(baseProduct.product_type)}</g:product_type>

      <g:shipping_length>${escapeXml(baseProduct.shipping_length)}</g:shipping_length>
      <g:shipping_width>${escapeXml(baseProduct.shipping_width)}</g:shipping_width>
      <g:shipping_height>${escapeXml(baseProduct.shipping_height)}</g:shipping_height>

      <g:shipping>
        <g:country>US</g:country>
        <g:region>${escapeXml(product.abbr)}</g:region>
        <g:service>Delivery Included</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>

      ${Object.entries(baseProduct.custom_labels)
        .map(([key, value]) => `<g:${key}>${escapeXml(value)}</g:${key}>`)
        .join("\n      ")}
    </item>`;
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Home Defend Pro - Storm Shelters by Location</title>
    <link>${escapeXml(PRODUCT_PAGE_BASE)}</link>
    <description>Underground concrete storm shelters delivered nationwide. State and city-specific listings with delivery included in price.</description>
${allProducts.map(generateProductItem).join("\n")}
  </channel>
</rss>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.status(200).send(xml);
}

// Helper function to escape XML special characters
function escapeXml(unsafe) {
  if (unsafe === undefined || unsafe === null) return "";
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
