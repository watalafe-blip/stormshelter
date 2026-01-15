import prodShelter from '@assets/image_1766611001581.png';
import imgProtected from '@assets/Copilot_20251228_211116_1766981162862.png';
import imgRebar from '@assets/generated_images/steel_rebar_cage_structure_for_shelter.png';
import imgFamily from '@assets/stock_images/happy_family_safe_at_5ec97324.jpg';
import imgTornado from '@assets/stock_images/tornado_storm_clouds_e3501d57.jpg';
import imgExcavation from '@assets/generated_images/excavation_pit_for_shelter.png';
import imgDrainTile from '@assets/generated_images/drain_tile_installation.png';
import imgShelterInstall from '@assets/generated_images/ai_enhanced_shelter_install_photo.png';
import imgUnderground from '@assets/generated_images/underground_concrete_shelter_closed_buried_ground.png';
import imgCouple from '@assets/generated_images/couple_at_shelter_manufacturing_facility.png';


export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  image: string;
  description: string;
  isTopPick?: boolean;
  isNew?: boolean;
  inventory: number;
  status: 'active' | 'draft' | 'archived';
  shippingProfileId?: string;
  deposit?: number; // Added for the deposit feature
}

export const categories = [
  { id: 'shelters', name: 'Storm Shelters', image: prodShelter },
];

export const products: Product[] = [
  {
    id: 'shelter-001',
    name: 'Slope Top Underground Concrete Storm Shelter',
    price: 4250.00,
    compareAtPrice: 5499.00,
    deposit: 500.00,
    category: 'shelters',
    image: prodShelter,
    description: 'The ultimate protection for your family. This slope-top underground concrete storm shelter is engineered to withstand EF5 tornadoes. Features a heavy-duty steel door with 3-point locking system, ventilation, and non-slip steps. \n\nIMPORTANT: Price includes unit cost. Shipping is calculated from Missouri. Customer is responsible for unloading and installation.',
    isTopPick: true,
    isNew: true,
    inventory: 5,
    status: 'active'
  }
];

// Helper to keep the slider working without errors, though we might not use it or will update it
export const heroSlides = [
  {
    id: 1,
    image: prodShelter,
    title: "When the Storm Comes, Will You Be Ready?",
    subtitle: "Protecting families one shelter at a time. FEMA-rated underground concrete storm shelters built to save lives.",
    cta: "Protect Your Family Now"
  }
];

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Ultimate Guide to Storm Shelter Safety',
    slug: 'ultimate-guide-storm-shelter-safety',
    date: '2024-07-15',
    author: 'Home Defend Pro Team',
    image: imgProtected,
    excerpt: 'Learn everything you need to know about choosing, installing, and maintaining a storm shelter to keep your family safe.',
    content: `
      <p>When severe weather strikes, having a safe place to go is paramount. A well-chosen and properly installed storm shelter can be the difference between life and death. This guide will walk you through the essential aspects of storm shelter safety.</p>
      <h3>Choosing the Right Shelter</h3>
      <p>Consider factors like capacity, material (concrete, steel, fiberglass), and certification (FEMA P-320, ICC 500). Concrete shelters, like those from Home Defend Pro, offer superior protection against EF5 tornadoes.</p>
      <h3>Installation Best Practices</h3>
      <p>Proper installation is crucial. Ensure your site is excavated correctly, drainage is adequate, and the shelter is set on a stable base. Always follow manufacturer guidelines and consider professional assistance for excavation and placement.</p>
      <h3>Maintenance Tips</h3>
      <p>Regularly inspect your shelter for any signs of wear, water intrusion, or damage. Keep the interior clean and stocked with emergency supplies. Test the door and ventilation systems periodically to ensure they are functioning correctly.</p>
      <p>By following these guidelines, you can ensure your storm shelter provides reliable protection for years to come.</p>
    `,
  },
  {
    id: 'blog-2',
    title: 'Why Concrete Shelters Offer Superior Protection',
    slug: 'why-concrete-shelters-superior-protection',
    date: '2024-07-10',
    author: 'Dr. Emily R. Storm',
    image: imgRebar,
    excerpt: 'Discover the engineering and material science behind why concrete is the best choice for tornado protection.',
    content: `
      <p>In the face of extreme weather, the material composition of your storm shelter is critical. Concrete, particularly reinforced concrete, stands out as the superior choice for tornado protection due to its inherent strength and durability.</p>
      <h3>Unmatched Structural Integrity</h3>
      <p>Concrete shelters are typically constructed with high-strength concrete (e.g., 5,000 PSI) and reinforced with steel rebar. This combination creates a monolithic structure that can withstand immense impact forces from flying debris, a common and deadly threat during tornadoes.</p>
      <h3>Resistance to Wind and Pressure</h3>
      <p>Unlike lighter materials, the sheer mass and rigidity of concrete provide exceptional resistance to the extreme wind pressures and suction forces generated by EF5 tornadoes. This minimizes the risk of structural failure and displacement.</p>
      <h3>Longevity and Low Maintenance</h3>
      <p>Concrete is naturally resistant to rot, rust, and pests, ensuring a long lifespan with minimal maintenance. This makes it a reliable, long-term investment in your family's safety.</p>
      <p>Choosing a concrete shelter means investing in proven, robust protection that will stand the test of time and nature's fury.</p>
    `,
  },
  {
    id: 'blog-3',
    title: 'Preparing Your Family for Tornado Season',
    slug: 'preparing-family-tornado-season',
    date: '2024-07-05',
    author: 'Sarah & James Johnson',
    image: imgFamily,
    excerpt: 'Essential tips and checklists to ensure your family is ready when tornado warnings are issued.',
    content: `
      <p>Tornado season can bring anxiety, but with proper preparation, your family can face it with confidence. Here’s how to get ready:</p>
      <h3>Develop a Family Plan</h3>
      <p>Discuss with your family where to go during a tornado warning (your storm shelter!), how to get there quickly, and what to do if separated. Practice your plan regularly.</p>
      <h3>Emergency Kit Essentials</h3>
      <p>Assemble a kit with water, non-perishable food, a first-aid kit, flashlights, batteries, a weather radio, and any necessary medications. Keep it easily accessible in your shelter.</p>
      <h3>Stay Informed</h3>
      <p>Monitor local weather alerts through NOAA Weather Radio, local news, or weather apps. Understand the difference between a tornado watch and a tornado warning.</p>
      <p>Being prepared reduces panic and increases safety. A storm shelter is your ultimate safe haven, but a well-rehearsed plan ensures you can utilize it effectively.</p>
    `,
  },
  {
    id: 'blog-4',
    title: 'Understanding Tornado Ratings: EF0 to EF5',
    slug: 'understanding-tornado-ratings',
    date: '2024-06-28',
    author: 'Meteorology Today',
    image: imgTornado,
    excerpt: 'A detailed look at the Enhanced Fujita Scale and what each rating means for structural damage and safety.',
    content: `
      <p>The Enhanced Fujita (EF) Scale is used to assign a tornado a "rating" based on estimated wind speeds and related damage. Understanding this scale helps in appreciating the level of protection a robust storm shelter provides.</p>
      <h3>The EF Scale Explained</h3>
      <ul>
        <li><strong>EF0 (65-85 mph):</strong> Light damage, peeling surface off roofs, some tree branches broken.</li>
        <li><strong>EF1 (86-110 mph):</strong> Moderate damage, roofs severely stripped, mobile homes overturned.</li>
        <li><strong>EF2 (111-135 mph):</strong> Considerable damage, roofs torn off well-constructed houses, large trees snapped.</li>
        <li><strong>EF3 (136-165 mph):</strong> Severe damage, entire stories of well-constructed houses destroyed, trains overturned.</li>
        <li><strong>EF4 (166-200 mph):</strong> Devastating damage, well-constructed and whole frame houses leveled.</li>
        <li><strong>EF5 (201+ mph):</strong> Incredible damage, strong frame houses swept clean off foundations, automobile-sized missiles fly through the air.</li>
      </ul>
      <p>Home Defend Pro shelters are designed and tested to withstand EF5 conditions, offering the highest level of protection against the most violent tornadoes.</p>
    `,
  },
  {
    id: 'blog-5',
    title: 'The Installation Process: What to Expect',
    slug: 'installation-process-what-to-expect',
    date: '2024-06-20',
    author: 'Home Defend Pro Team',
    image: imgExcavation,
    excerpt: 'A step-by-step overview of how our underground storm shelters are installed, from excavation to backfill.',
    content: `
      <p>Installing an underground storm shelter is a significant project that requires careful planning and execution. Here’s a general overview of what to expect with a Home Defend Pro shelter installation:</p>
      <h3>1. Site Preparation and Excavation</h3>
      <p>The first step involves excavating a pit to the precise dimensions required for your shelter. This typically involves digging to a depth of about 49 inches, with specific length and width requirements. It's crucial to ensure the site is clear of underground utilities.</p>
      <h3>2. Drainage System Installation</h3>
      <p>Proper drainage is essential to prevent water accumulation around your shelter. A drain tile system is installed around the base of the excavation to divert water away, ensuring a dry and safe environment within the shelter.</p>
      <h3>3. Shelter Placement</h3>
      <p>Once the pit is ready and a gravel base is laid, our specialized flatbed truck with a crane will carefully lower the concrete storm shelter into the excavation. Precision is key to ensure the shelter is level and correctly positioned.</p>
      <h3>4. Backfilling and Grading</h3>
      <p>After the shelter is set, the excavated soil is backfilled around the unit. The ground is then graded to ensure water flows away from the shelter's entrance, preventing erosion and water intrusion.</p>
      <p>While Home Defend Pro handles the delivery and placement, customers are responsible for the excavation and backfilling. We provide detailed specifications to assist your chosen contractor.</p>
    `,
  },
  {
    id: 'blog-6',
    title: 'FEMA Certification: What It Means for Your Safety',
    slug: 'fema-certification-safety',
    date: '2024-06-15',
    author: 'Government Safety Standards',
    image: imgUnderground,
    excerpt: 'Understand the rigorous standards and testing behind FEMA P-320 and ICC 500 certifications for storm shelters.',
    content: `
      <p>When investing in a storm shelter, FEMA certification is a critical indicator of its ability to protect. The FEMA P-320 and ICC 500 standards are benchmarks for safety and structural integrity.</p>
      <h3>FEMA P-320 Guidelines</h3>
      <p>FEMA P-320, "Taking Shelter from the Storm: Building a Safe Room Inside Your Home," provides guidance for constructing safe rooms and storm shelters. It outlines design criteria, construction methods, and materials necessary to resist extreme wind and debris impacts.</p>
      <h3>ICC 500 Standard</h3>
      <p>The International Code Council (ICC) 500 standard, "Standard for the Design and Construction of Storm Shelters," is a comprehensive code that specifies minimum requirements for the design, construction, and installation of storm shelters. It covers everything from structural loads to ventilation and accessibility.</p>
      <h3>Why Certification Matters</h3>
      <p>Shelters that meet these certifications have undergone rigorous testing, often including impact tests with 15-lb 2x4 lumber shot at high speeds. This ensures they can withstand the forces of an EF5 tornado, providing verifiable peace of mind.</p>
      <p>Home Defend Pro shelters are proudly FEMA P-320 and ICC 500 certified, meaning they meet the highest standards for protecting lives.</p>
    `,
  },
  {
    id: 'blog-7',
    title: 'The Financial Benefits of a Storm Shelter',
    slug: 'financial-benefits-storm-shelter',
    date: '2024-06-01',
    author: 'Financial Planning Expert',
    image: imgCouple,
    excerpt: 'Beyond safety, discover how a storm shelter can be a smart investment for your property and insurance.',
    content: `
      <p>While the primary benefit of a storm shelter is undeniable safety, there are also significant financial advantages to consider when adding one to your property.</p>
      <h3>Increased Property Value</h3>
      <p>A permanent, FEMA-certified storm shelter is a valuable home improvement. It enhances the safety features of your property, making it more attractive to potential buyers, especially in tornado-prone regions. This can lead to a higher resale value for your home.</p>
      <h3>Potential Insurance Savings</h3>
      <p>Many insurance providers offer discounts on homeowner's insurance premiums for properties equipped with certified storm shelters or safe rooms. By reducing the risk of injury or loss during a storm, you may qualify for lower rates. It's always best to check with your insurance agent for specific details.</p>
      <h3>Protection of Assets</h3>
      <p>In the event of a devastating storm, a shelter protects not only your family but also valuable documents and small personal items stored within. This indirect protection can save you from significant financial loss and the emotional toll of losing irreplaceable belongings.</p>
      <p>A storm shelter is an investment in peace of mind, but it's also a tangible asset that can yield financial returns and provide long-term value.</p>
    `,
  },
  {
    id: 'blog-8',
    title: 'Site Preparation: What Your Contractor Needs to Know',
    slug: 'site-preparation-contractor-guide',
    date: '2024-05-25',
    author: 'Home Defend Pro Engineering',
    image: imgDrainTile,
    excerpt: 'Detailed instructions and considerations for your excavation contractor to ensure a smooth storm shelter installation.',
    content: `
      <p>For a successful storm shelter installation, clear communication and precise site preparation are key. Here’s what your excavation contractor needs to know:</p>
      <h3>Excavation Dimensions</h3>
      <p>Provide your contractor with the exact dimensions for the pit, including length, width, and depth. Emphasize the need for a level base and straight walls to ensure proper fit and stability of the shelter.</p>
      <h3>Utility Locates</h3>
      <p>Stress the importance of calling 811 (or your local utility locate service) well in advance to mark all underground utilities. This prevents costly and dangerous accidents during excavation.</p>
      <h3>Drainage Requirements</h3>
      <p>Explain the need for a robust drainage system, such as a perimeter drain tile, to manage groundwater around the shelter. Proper drainage is crucial for the long-term integrity and dryness of the unit.</p>
      <h3>Access for Delivery Truck</h3>
      <p>Inform the contractor about the size and weight of the delivery truck and crane. Ensure there is a clear, stable path with adequate overhead clearance to the installation site. The excavation should be within the crane's reach.</p>
      <p>By providing these details, you empower your contractor to prepare the site efficiently and correctly, leading to a seamless shelter delivery and placement.</p>
    `,
  },
  {
    id: 'blog-9',
    title: 'Beyond Tornadoes: Other Uses for Your Underground Shelter',
    slug: 'beyond-tornadoes-other-uses',
    date: '2024-05-18',
    author: 'Survivalist Monthly',
    image: imgShelterInstall,
    excerpt: 'Explore the versatility of your underground concrete shelter for purposes beyond just tornado protection.',
    content: `
      <p>While primarily designed for tornado protection, an underground concrete shelter offers a surprising range of additional uses, making it a versatile asset for any homeowner.</p>
      <h3>Safe Room for Other Emergencies</h3>
      <p>Your shelter can serve as a safe room during other emergencies, such as home invasions or severe thunderstorms with high winds and hail. It provides a secure, reinforced space for your family.</p>
      <h3>Secure Storage</h3>
      <p>The stable, underground environment is ideal for storing valuable documents, family heirlooms, firearms, or emergency supplies. Its robust construction offers protection against theft and environmental damage.</p>
      <h3>Temperature-Controlled Storage</h3>
      <p>Underground shelters maintain a relatively stable temperature year-round, making them suitable for storing sensitive items like wine, canned goods, or even certain electronics that benefit from consistent conditions.</p>
      <p>Investing in a Home Defend Pro shelter means acquiring a multi-functional space that enhances your property's security and utility in numerous ways.</p>
    `,
  },
  {
    id: 'blog-10',
    title: 'The History of Storm Shelters: From Basements to Modern Bunkers',
    slug: 'history-of-storm-shelters',
    date: '2024-05-10',
    author: 'Historical Society of Tornado Alley',
    image: imgTornado,
    excerpt: 'Trace the evolution of storm protection, from early cellar designs to today\'s advanced, FEMA-certified concrete shelters.',
    content: `
      <p>The quest for safety from severe weather has a long and fascinating history, evolving from simple underground cellars to the sophisticated, certified storm shelters of today.</p>
      <h3>Early Beginnings: Root Cellars and Basements</h3>
      <p>For centuries, people in tornado-prone areas sought refuge in basements, root cellars, or natural depressions. These provided some protection but were often vulnerable to collapse, flooding, or direct impact.</p>
      <h3>Mid-20th Century Advancements</h3>
      <p>As meteorological science advanced and tornado awareness grew, purpose-built storm cellars became more common. These were often separate structures, still basic but designed specifically for shelter.</p>
      <h3>Modern Era: Engineering and Certification</h3>
      <p>The late 20th and early 21st centuries brought significant advancements. Engineering principles, material science, and real-world tornado events led to the development of rigorous standards like FEMA P-320 and ICC 500. This era saw the rise of highly engineered, reinforced concrete shelters designed to withstand EF5 forces.</p>
      <p>Today, companies like Home Defend Pro continue this legacy, building on decades of knowledge to provide the most reliable and effective storm protection available.</p>
    `,
  },
];