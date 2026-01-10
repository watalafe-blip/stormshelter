// pages/api/google-feed.xml.js
// Google Shopping XML feed (SINGLE product) + state-level shipping rules
// Key fixes:
// 1) Avoid 50 duplicate items with different prices (prevents price mismatch issues).
// 2) Remove shipping_weight (Google limit is 2000 lb; your 12000 lb triggers errors).
// 3) Add shipping_label so you can manage freight rules in Merchant Center if needed.
// 4) Keep image_link + additional_image_link as plain direct image URLs.

export default function handler(req, res) {
  // IMPORTANT: Ideally this should be a real product detail page (not homepage)
  const PRODUCT_LINK = "https://www.homedefendpro.com";

  // Base product information
  const baseProduct = {
    id: "706900",
    title:
      "Underground Concrete Storm Shelter - FEMA 320 / ICC 500 Certified - EF5 Rated Tornado Protection",
    description:
      "FEMA 320 and ICC 500 certified underground concrete storm shelter. EF5 rated protection against extreme winds. Reinforced concrete with steel rebar, built-in ventilation, and easy-access hatch. Capacity 6-8 adults. Manufactured in Grandview, Missouri. Includes 10-year structural warranty. Freight delivery cost varies by state and is provided via shipping attributes.",
    brand: "Home Defend Pro",
    condition: "new",
    availability: "in stock",
    // Use a more specific category if you know it; numeric codes are fine too
    google_product_category: "596",
    product_type: "Home & Garden > Emergency Preparedness > Storm Shelters",

    // Base item price (product only). Shipping is added via <g:shipping> entries.
    price: "4599.00 USD",

    // Use clean, publicly accessible, direct image URLs that return an actual image (not HTML)
    image_link:
      "https://www.homedefendpro.com/Office-SI-Storm-Shelter_(1)_1767252448693.jpg",
    additional_image_link: [
      "https://www.homedefendpro.com/ChatGPT_Image_Dec_31,_2025,_01_02_10_AM_1767253312476.png",
      "https://www.homedefendpro.com/Screenshot_2025-12-28_at_4.24.14_PM_1767252552004.png",
      "https://www.homedefendpro.com/generated_images/lifestyle_backyard_closed_hatch.png",
    ],

    // For custom/unique items: either provide GTIN, OR use brand+mpn and identifier_exists=yes
    mpn: "706900",
    identifier_exists: "yes",

    // Optional, helpful for Merchant Center shipping configuration
    shipping_label: "FREIGHT_OVERSIZE",

    custom_labels: {
      custom_label_0: "FEMA Certified",
      custom_label_1: "EF5 Rated",
      custom_label_2: "Made in USA",
      custom_label_3: "Underground Shelter",
      custom_label_4: "10 Year Warranty",
    },
  };

  // Delivery estimates (example) — cost is distance × $5.20/mile
  // You can freely change the pricing model, but keep it consistent with your site/checkout.
  const stateProducts = [
    { state: "Texas", abbr: "TX", distance: 550 },
    { state: "Oklahoma", abbr: "OK", distance: 150 },
    { state: "Kansas", abbr: "KS", distance: 50 },
    { state: "Missouri", abbr: "MO", distance: 20 },
    { state: "Arkansas", abbr: "AR", distance: 320 },
    { state: "Nebraska", abbr: "NE", distance: 180 },
    { state: "Iowa", abbr: "IA", distance: 200 },
    { state: "Illinois", abbr: "IL", distance: 280 },
    { state: "Tennessee", abbr: "TN", distance: 480 },
    { state: "Mississippi", abbr: "MS", distance: 600 },
    { state: "Alabama", abbr: "AL", distance: 680 },
    { state: "Ohio", abbr: "OH", distance: 620 },
    { state: "Indiana", abbr: "IN", distance: 420 },
    { state: "Kentucky", abbr: "KY", distance: 400 },
    { state: "Louisiana", abbr: "LA", distance: 700 },
    { state: "Michigan", abbr: "MI", distance: 650 },
    { state: "Wisconsin", abbr: "WI", distance: 480 },
    { state: "Minnesota", abbr: "MN", distance: 520 },
    { state: "South Dakota", abbr: "SD", distance: 580 },
    { state: "North Dakota", abbr: "ND", distance: 750 },
    { state: "Wyoming", abbr: "WY", distance: 680 },
    { state: "Colorado", abbr: "CO", distance: 600 },
    { state: "New Mexico", abbr: "NM", distance: 850 },
    { state: "Arizona", abbr: "AZ", distance: 1100 },
    { state: "Utah", abbr: "UT", distance: 950 },
    { state: "Idaho", abbr: "ID", distance: 1300 },
    { state: "Montana", abbr: "MT", distance: 1150 },
    { state: "Nevada", abbr: "NV", distance: 1250 },
    { state: "California", abbr: "CA", distance: 1600 },
    { state: "Oregon", abbr: "OR", distance: 1700 },
    { state: "Washington", abbr: "WA", distance: 1750 },
    { state: "Georgia", abbr: "GA", distance: 820 },
    { state: "Florida", abbr: "FL", distance: 1150 },
    { state: "South Carolina", abbr: "SC", distance: 900 },
    { state: "North Carolina", abbr: "NC", distance: 950 },
    { state: "Virginia", abbr: "VA", distance: 900 },
    { state: "West Virginia", abbr: "WV", distance: 720 },
    { state: "Maryland", abbr: "MD", distance: 1000 },
    { state: "Delaware", abbr: "DE", distance: 1100 },
    { state: "Pennsylvania", abbr: "PA", distance: 950 },
    { state: "New Jersey", abbr: "NJ", distance: 1100 },
    { state: "New York", abbr: "NY", distance: 1150 },
    { state: "Connecticut", abbr: "CT", distance: 1200 },
    { state: "Rhode Island", abbr: "RI", distance: 1250 },
    { state: "Massachusetts", abbr: "MA", distance: 1250 },
    { state: "Vermont", abbr: "VT", distance: 1300 },
    { state: "New Hampshire", abbr: "NH", distance: 1300 },
    { state: "Maine", abbr: "ME", distance: 1450 },
    // If Alaska creates "shipping cost too high" visibility limits, consider excluding it:
    { state: "Alaska", abbr: "AK", distance: 3000 },
  ];

  const BASE_PRICE = 4599.0;
  const RATE_PER_MILE = 5.2;

  function calcShipping(distance) {
    return +(distance * RATE_PER_MILE).toFixed(2);
  }

  function shippingNodesForAllStates() {
    return stateProducts
      .map((s) => {
        const ship = calcShipping(s.distance);
        return `      <g:shipping>
        <g:country>US</g:country>
        <g:region>${escapeXml(s.abbr)}</g:region>
        <g:service>Flatbed Freight Delivery</g:service>
        <g:price>${ship.toFixed(2)} USD</g:price>
      </g:shipping>`;
      })
      .join("\n");
  }

  const additionalImagesXml = baseProduct.additional_image_link
    .map(
      (img) =>
        `<g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`
    )
    .join("\n      ");

  const customLabelsXml = Object.entries(baseProduct.custom_labels)
    .map(([key, value]) => `<g:${key}>${escapeXml(value)}</g:${key}>`)
    .join("\n      ");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Home Defend Pro - Google Shopping Feed</title>
    <link>${escapeXml(PRODUCT_LINK)}</link>
    <description>Underground concrete storm shelters. Freight delivery varies by state.</description>

    <item>
      <g:id>${escapeXml(baseProduct.id)}</g:id>
      <g:title>${escapeXml(baseProduct.title)}</g:title>
      <g:description>${escapeXml(baseProduct.description)}</g:description>
      <g:link>${escapeXml(baseProduct.link || PRODUCT_LINK)}</g:link>
      <g:image_link>${escapeXml(baseProduct.image_link)}</g:image_link>
      ${additionalImagesXml}
      <g:availability>${escapeXml(baseProduct.availability)}</g:availability>
      <g:price>${escapeXml(baseProduct.price)}</g:price>
      <g:brand>${escapeXml(baseProduct.brand)}</g:brand>
      <g:condition>${escapeXml(baseProduct.condition)}</g:condition>
      <g:mpn>${escapeXml(baseProduct.mpn)}</g:mpn>
      <g:identifier_exists>${escapeXml(baseProduct.identifier_exists)}</g:identifier_exists>
      <g:google_product_category>${escapeXml(
        baseProduct.google_product_category
      )}</g:google_product_category>
      <g:product_type>${escapeXml(baseProduct.product_type)}</g:product_type>

      <g:shipping_label>${escapeXml(baseProduct.shipping_label)}</g:shipping_label>

${shippingNodesForAllStates()}

      ${customLabelsXml}
    </item>

  </channel>
</rss>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.status(200).send(xml);
}

// Helper: escape XML special characters
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
