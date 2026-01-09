// pages/api/google-feed.xml.js
// Google Shopping XML feed with 50+ state-specific product listings

export default function handler(req, res) {
  // Base product information
  const baseProduct = {
    id: '706900',
    brand: 'Home Defend Pro',
    condition: 'new',
    availability: 'in stock',
    google_product_category: '596',
    product_type: 'Home & Garden > Emergency Preparedness > Storm Shelters',
    shipping_weight: '12000 lbs',
    shipping_length: '72 in',
    shipping_width: '54 in',
    shipping_height: '78 in',
    mpn: '706900',
    link: 'https://www.homedefendpro.com',
    image_link: 'https://www.homedefendpro.com/Office-SI-Storm-Shelter_(1)_1767252448693.jpg',
    additional_image_link: [
      'https://www.homedefendpro.com/ChatGPT_Image_Dec_31,_2025,_01_02_10_AM_1767253312476.png',
      'https://www.homedefendpro.com/Screenshot_2025-12-28_at_4.24.14_PM_1767252552004.png',
      'https://www.homedefendpro.com/generated_images/lifestyle_backyard_closed_hatch.png'
    ],
    custom_labels: {
      custom_label_0: 'FEMA Certified',
      custom_label_1: 'EF5 Rated',
      custom_label_2: 'Made in USA',
      custom_label_3: 'Underground Shelter',
      custom_label_4: '10 Year Warranty'
    }
  };

  // State-specific products with approximate distances from Grandview, MO
  // Distance is approximate to major city in each state
  // Price = Base ($4,599) + Delivery (distance × $5.20/mile)
  const stateProducts = [
    // Tornado Alley & High Priority States
    { state: 'Texas', abbr: 'TX', distance: 550, price: 7459, priority: true },
    { state: 'Oklahoma', abbr: 'OK', distance: 150, price: 5379, priority: true },
    { state: 'Kansas', abbr: 'KS', distance: 50, price: 4859, priority: true },
    { state: 'Missouri', abbr: 'MO', distance: 20, price: 4703, priority: true },
    { state: 'Arkansas', abbr: 'AR', distance: 320, price: 6263, priority: true },
    { state: 'Nebraska', abbr: 'NE', distance: 180, price: 5535, priority: true },
    { state: 'Iowa', abbr: 'IA', distance: 200, price: 5639, priority: true },
    { state: 'Illinois', abbr: 'IL', distance: 280, price: 6055, priority: true },
    { state: 'Tennessee', abbr: 'TN', distance: 480, price: 7095, priority: true },
    { state: 'Mississippi', abbr: 'MS', distance: 600, price: 7719, priority: true },
    { state: 'Alabama', abbr: 'AL', distance: 680, price: 8135, priority: true },
    { state: 'Ohio', abbr: 'OH', distance: 620, price: 7823, priority: true },
    
    // Additional Coverage States
    { state: 'Indiana', abbr: 'IN', distance: 420, price: 6783, priority: false },
    { state: 'Kentucky', abbr: 'KY', distance: 400, price: 6679, priority: false },
    { state: 'Louisiana', abbr: 'LA', distance: 700, price: 8239, priority: false },
    { state: 'Michigan', abbr: 'MI', distance: 650, price: 7979, priority: false },
    { state: 'Wisconsin', abbr: 'WI', distance: 480, price: 7095, priority: false },
    { state: 'Minnesota', abbr: 'MN', distance: 520, price: 7303, priority: false },
    { state: 'South Dakota', abbr: 'SD', distance: 580, price: 7615, priority: false },
    { state: 'North Dakota', abbr: 'ND', distance: 750, price: 8499, priority: false },
    { state: 'Wyoming', abbr: 'WY', distance: 680, price: 8135, priority: false },
    { state: 'Colorado', abbr: 'CO', distance: 600, price: 7719, priority: false },
    { state: 'New Mexico', abbr: 'NM', distance: 850, price: 9019, priority: false },
    { state: 'Arizona', abbr: 'AZ', distance: 1100, price: 10319, priority: false },
    { state: 'Utah', abbr: 'UT', distance: 950, price: 9539, priority: false },
    { state: 'Idaho', abbr: 'ID', distance: 1300, price: 11359, priority: false },
    { state: 'Montana', abbr: 'MT', distance: 1150, price: 10579, priority: false },
    { state: 'Nevada', abbr: 'NV', distance: 1250, price: 11099, priority: false },
    { state: 'California', abbr: 'CA', distance: 1600, price: 12919, priority: false },
    { state: 'Oregon', abbr: 'OR', distance: 1700, price: 13439, priority: false },
    { state: 'Washington', abbr: 'WA', distance: 1750, price: 13699, priority: false },
    { state: 'Georgia', abbr: 'GA', distance: 820, price: 8863, priority: false },
    { state: 'Florida', abbr: 'FL', distance: 1150, price: 10579, priority: false },
    { state: 'South Carolina', abbr: 'SC', distance: 900, price: 9279, priority: false },
    { state: 'North Carolina', abbr: 'NC', distance: 950, price: 9539, priority: false },
    { state: 'Virginia', abbr: 'VA', distance: 900, price: 9279, priority: false },
    { state: 'West Virginia', abbr: 'WV', distance: 720, price: 8343, priority: false },
    { state: 'Maryland', abbr: 'MD', distance: 1000, price: 9799, priority: false },
    { state: 'Delaware', abbr: 'DE', distance: 1100, price: 10319, priority: false },
    { state: 'Pennsylvania', abbr: 'PA', distance: 950, price: 9539, priority: false },
    { state: 'New Jersey', abbr: 'NJ', distance: 1100, price: 10319, priority: false },
    { state: 'New York', abbr: 'NY', distance: 1150, price: 10579, priority: false },
    { state: 'Connecticut', abbr: 'CT', distance: 1200, price: 10839, priority: false },
    { state: 'Rhode Island', abbr: 'RI', distance: 1250, price: 11099, priority: false },
    { state: 'Massachusetts', abbr: 'MA', distance: 1250, price: 11099, priority: false },
    { state: 'Vermont', abbr: 'VT', distance: 1300, price: 11359, priority: false },
    { state: 'New Hampshire', abbr: 'NH', distance: 1300, price: 11359, priority: false },
    { state: 'Maine', abbr: 'ME', distance: 1450, price: 12139, priority: false },
    { state: 'Alaska', abbr: 'AK', distance: 3000, price: 20199, priority: false },
  ];

  // Generate XML items for all states
  const generateProductItem = (stateData, index) => {
    const productId = `706900-${stateData.abbr}`;
    const title = stateData.priority 
      ? `Underground Concrete Storm Shelter ${stateData.state} - FEMA 320 ICC 500 Certified - EF5 Rated Tornado Protection`
      : `Underground Storm Shelter ${stateData.state} - FEMA Certified - EF5 Tornado Protection - Ships from Missouri`;
    
    const description = stateData.priority
      ? `FEMA 320 and ICC 500 certified underground concrete storm shelter for ${stateData.state}. EF5 rated protection against 250 plus MPH winds. Manufactured in Grandview Missouri and professionally delivered to ${stateData.state}. Reinforced steel rebar construction built-in ventilation system easy-access hatch with gas strut assist. Capacity 6-8 adults. Includes 10-year structural warranty. Total price includes shelter 4599 dollars plus delivery to ${stateData.state} approximately ${stateData.distance} miles. Protects families across ${stateData.state} from tornadoes and severe weather.`
      : `Underground concrete storm shelter delivered to ${stateData.state}. FEMA certified EF5-rated protection. Manufactured in Missouri ships nationwide. 6-8 person capacity 10-year warranty. Price includes delivery to ${stateData.state}.`;

    return `    <item>
      <g:id>${escapeXml(productId)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(baseProduct.link)}</g:link>
      <g:image_link>${escapeXml(baseProduct.image_link)}</g:image_link>
      ${baseProduct.additional_image_link.map(img => `<g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`).join('\n      ')}
      <g:availability>${escapeXml(baseProduct.availability)}</g:availability>
      <g:price>${stateData.price}.00 USD</g:price>
      <g:brand>${escapeXml(baseProduct.brand)}</g:brand>
      <g:condition>${escapeXml(baseProduct.condition)}</g:condition>
      <g:mpn>${escapeXml(baseProduct.mpn)}-${stateData.abbr}</g:mpn>
      <g:google_product_category>${baseProduct.google_product_category}</g:google_product_category>
      <g:product_type>${escapeXml(baseProduct.product_type)}</g:product_type>
      <g:shipping_weight>${escapeXml(baseProduct.shipping_weight)}</g:shipping_weight>
      <g:shipping_length>${escapeXml(baseProduct.shipping_length)}</g:shipping_length>
      <g:shipping_width>${escapeXml(baseProduct.shipping_width)}</g:shipping_width>
      <g:shipping_height>${escapeXml(baseProduct.shipping_height)}</g:shipping_height>
      <g:item_group_id>706900</g:item_group_id>
      <g:shipping>
        <g:country>US</g:country>
        <g:region>${stateData.abbr}</g:region>
        <g:service>Flatbed Truck Delivery to ${stateData.state}</g:service>
        <g:price>${(stateData.price - 4599).toFixed(2)} USD</g:price>
      </g:shipping>
      ${Object.entries(baseProduct.custom_labels).map(([key, value]) => 
        `<g:${key}>${escapeXml(value)}</g:${key}>`
      ).join('\n      ')}
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
  };

  // Generate complete XML feed
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Home Defend Pro - Underground Concrete Storm Shelters</title>
    <link>https://www.homedefendpro.com</link>
    <description>FEMA 320 & ICC 500 certified underground concrete storm shelters. EF5-rated protection for families nationwide. Manufactured in Grandview, Missouri. Professional delivery and 10-year warranty included.</description>
${stateProducts.map(generateProductItem).join('\n')}
  </channel>
</rss>`;

  // Set proper headers
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  
  res.status(200).send(xml);
}

// Helper function to escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
