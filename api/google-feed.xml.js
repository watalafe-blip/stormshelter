// pages/api/google-feed.xml.js
// This generates a Google Shopping XML feed for your storm shelter

export default function handler(req, res) {
  // Product data - update these values anytime
  const product = {
    id: '706900',
    title: 'Underground Concrete Storm Shelter - FEMA 320 & ICC 500 Certified - EF5 Rated',
    description: 'FEMA 320 & ICC 500 certified underground concrete storm shelter. EF5 rated, protects against 250+ MPH winds. Made in USA (Missouri). Features reinforced steel rebar construction, built-in ventilation system, and easy-access hatch door with gas strut assist. Capacity for 6-8 adults. Includes 10-year structural warranty.',
    link: 'https://www.homedefendpro.com',
    image_link: 'https://www.homedefendpro.com/Office-SI-Storm-Shelter_(1)_1767252448693.jpg',
    additional_image_link: [
      'https://www.homedefendpro.com/ChatGPT_Image_Dec_31,_2025,_01_02_10_AM_1767253312476.png',
      'https://www.homedefendpro.com/Screenshot_2025-12-28_at_4.24.14_PM_1767252552004.png',
      'https://www.homedefendpro.com/generated_images/lifestyle_backyard_closed_hatch.png'
    ],
    availability: 'in stock',
    price: '4599.00 USD',
    brand: 'Home Defend Pro',
    condition: 'new',
    mpn: '706900',
    google_product_category: '596', // Home & Garden > Emergency Preparedness
    product_type: 'Home & Garden > Emergency Preparedness > Storm Shelters',
    shipping_weight: '12000 lbs',
    shipping_length: '72 in',
    shipping_width: '54 in',
    shipping_height: '78 in',
    item_group_id: '706900',
    
    // Shipping configuration
    shipping: {
      country: 'US',
      service: 'Flatbed Truck Delivery',
      price: 'Calculated at checkout'
    },
    
    // Additional attributes
    custom_labels: {
      custom_label_0: 'FEMA Certified',
      custom_label_1: 'EF5 Rated',
      custom_label_2: 'Made in USA',
      custom_label_3: 'Free Standing',
      custom_label_4: '10 Year Warranty'
    }
  };

  // Generate XML feed
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Home Defend Pro - Storm Shelters</title>
    <link>https://www.homedefendpro.com</link>
    <description>FEMA certified underground concrete storm shelters</description>
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.title)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${escapeXml(product.link)}</g:link>
      <g:image_link>${escapeXml(product.image_link)}</g:image_link>
      ${product.additional_image_link.map(img => `<g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`).join('\n      ')}
      <g:availability>${escapeXml(product.availability)}</g:availability>
      <g:price>${escapeXml(product.price)}</g:price>
      <g:brand>${escapeXml(product.brand)}</g:brand>
      <g:condition>${escapeXml(product.condition)}</g:condition>
      <g:mpn>${escapeXml(product.mpn)}</g:mpn>
      <g:google_product_category>${product.google_product_category}</g:google_product_category>
      <g:product_type>${escapeXml(product.product_type)}</g:product_type>
      <g:shipping_weight>${escapeXml(product.shipping_weight)}</g:shipping_weight>
      <g:shipping_length>${escapeXml(product.shipping_length)}</g:shipping_length>
      <g:shipping_width>${escapeXml(product.shipping_width)}</g:shipping_width>
      <g:shipping_height>${escapeXml(product.shipping_height)}</g:shipping_height>
      <g:item_group_id>${escapeXml(product.item_group_id)}</g:item_group_id>
      <g:shipping>
        <g:country>${product.shipping.country}</g:country>
        <g:service>${escapeXml(product.shipping.service)}</g:service>
        <g:price>${escapeXml(product.shipping.price)}</g:price>
      </g:shipping>
      ${Object.entries(product.custom_labels).map(([key, value]) => 
        `<g:${key}>${escapeXml(value)}</g:${key}>`
      ).join('\n      ')}
      <g:identifier_exists>no</g:identifier_exists>
    </item>
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
