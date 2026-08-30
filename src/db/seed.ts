import 'dotenv/config';
import { db } from './index';
import { articles, adSettings, adminUsers } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  try {
    await db.insert(adminUsers).values({
      username: 'admin',
      password: hashedPassword,
    });
    console.log('✓ Admin user created (username: admin, password: password123)');
  } catch (error) {
    console.log('Admin user already exists, skipping...');
  }

  // Seed initial articles
  const sampleArticles = [
    {
      title: 'Complete Guide to Canadian Immigration',
      content: `<p>Canada offers various immigration pathways for individuals seeking permanent residence. Understanding these options is crucial for making informed decisions.</p>

<h2>Express Entry System</h2>
<p>The Express Entry system manages applications for three federal economic immigration programs:</p>
<ul>
<li>Federal Skilled Worker Program</li>
<li>Federal Skilled Trades Program</li>
<li>Canadian Experience Class</li>
</ul>

<h2>Provincial Nominee Programs (PNPs)</h2>
<p>Each Canadian province and territory has its own immigration programs targeting specific groups to meet regional labor market needs.</p>

<h2>Key Requirements</h2>
<p>Most immigration programs require applicants to demonstrate:</p>
<ul>
<li>Language proficiency in English or French</li>
<li>Educational credentials</li>
<li>Work experience</li>
<li>Financial stability</li>
</ul>

<p>For detailed information about eligibility and application processes, consult with a licensed immigration consultant or visit the official IRCC website.</p>`,
      category: 'Immigration',
      featured: true,
    },
    {
      title: 'Understanding the Express Entry Points System',
      content: `<p>The Comprehensive Ranking System (CRS) is a points-based system used to assess and score your profile for Express Entry.</p>

<h2>CRS Score Factors</h2>
<p>Your CRS score is calculated based on:</p>
<ul>
<li><strong>Core human capital factors:</strong> Age, education, language skills, and work experience</li>
<li><strong>Spouse or common-law partner factors:</strong> If applicable</li>
<li><strong>Skill transferability factors:</strong> Combinations of education, work experience, and language ability</li>
<li><strong>Additional points:</strong> Provincial nomination, job offer, Canadian education, sibling in Canada</li>
</ul>

<h2>Improving Your Score</h2>
<p>You can increase your CRS score by:</p>
<ul>
<li>Improving language test scores</li>
<li>Gaining additional work experience</li>
<li>Obtaining a higher education degree</li>
<li>Securing a valid job offer</li>
<li>Getting a provincial nomination (adds 600 points)</li>
</ul>`,
      category: 'Express Entry',
      featured: true,
    },
    {
      title: 'Study Permits and Student Visas',
      content: `<p>International students planning to study in Canada need to understand the study permit application process.</p>

<h2>Eligibility Requirements</h2>
<p>To qualify for a study permit, you must:</p>
<ul>
<li>Have an acceptance letter from a Designated Learning Institution (DLI)</li>
<li>Prove you have enough funds to cover tuition and living expenses</li>
<li>Be a law-abiding citizen with no criminal record</li>
<li>Be in good health (medical exam may be required)</li>
<li>Convince an immigration officer that you will leave Canada at the end of your studies</li>
</ul>

<h2>Application Process</h2>
<p>The study permit application involves:</p>
<ol>
<li>Getting accepted to a DLI</li>
<li>Gathering required documents</li>
<li>Applying online or at a visa application center</li>
<li>Providing biometrics</li>
<li>Waiting for processing (varies by country)</li>
</ol>

<h2>Working While Studying</h2>
<p>Most full-time students can work up to 20 hours per week during regular academic sessions and full-time during scheduled breaks.</p>`,
      category: 'Student Visa',
      featured: false,
    },
    {
      title: 'Family Sponsorship Programs',
      content: `<p>Canadian citizens and permanent residents can sponsor family members to become permanent residents of Canada.</p>

<h2>Who Can You Sponsor?</h2>
<p>Eligible family members include:</p>
<ul>
<li>Spouse or common-law partner</li>
<li>Dependent children</li>
<li>Parents and grandparents</li>
<li>Orphaned siblings, nieces, nephews, or grandchildren (under 18)</li>
</ul>

<h2>Sponsor Requirements</h2>
<p>To sponsor a family member, you must:</p>
<ul>
<li>Be at least 18 years old</li>
<li>Be a Canadian citizen or permanent resident</li>
<li>Prove you can financially support the family member</li>
<li>Sign an undertaking promising financial support for 3-20 years (depending on relationship)</li>
</ul>

<h2>Application Timeline</h2>
<p>Processing times vary by relationship type and application volume. Spousal sponsorships typically take 12-18 months, while parent/grandparent sponsorships may take longer.</p>`,
      category: 'Family Sponsorship',
      featured: false,
    },
    {
      title: 'Work Permits: Temporary Foreign Workers',
      content: `<p>Foreign nationals who wish to work temporarily in Canada generally need a work permit.</p>

<h2>Types of Work Permits</h2>
<p>There are two main types:</p>
<ul>
<li><strong>Employer-specific work permit:</strong> Allows you to work for a specific employer in a specific location</li>
<li><strong>Open work permit:</strong> Allows you to work for any employer in Canada (with some exceptions)</li>
</ul>

<h2>Labour Market Impact Assessment (LMIA)</h2>
<p>Most employer-specific work permits require an LMIA, which confirms that:</p>
<ul>
<li>There is a need for a foreign worker</li>
<li>No Canadian worker is available for the job</li>
</ul>

<h2>LMIA-Exempt Categories</h2>
<p>Some work permits don't require an LMIA, including:</p>
<ul>
<li>International agreements (NAFTA/CUSMA)</li>
<li>Intra-company transfers</li>
<li>Canadian interests (significant benefit)</li>
</ul>`,
      category: 'Work Permit',
      featured: true,
    },
    {
      title: 'Provincial Nominee Program (PNP) Overview',
      content: `<p>Provincial Nominee Programs allow Canadian provinces and territories to nominate individuals for permanent residence based on local labor market needs.</p>

<h2>Popular PNP Streams</h2>
<p>Most provinces offer multiple streams targeting different groups:</p>
<ul>
<li><strong>Skilled Worker streams:</strong> For individuals with specific occupational skills</li>
<li><strong>International Graduate streams:</strong> For recent graduates from Canadian institutions</li>
<li><strong>Business/Entrepreneur streams:</strong> For experienced business owners</li>
<li><strong>Semi-skilled Worker streams:</strong> For workers in specific industries</li>
</ul>

<h2>Benefits of PNP Nomination</h2>
<ul>
<li>Adds 600 points to Express Entry CRS score (virtually guarantees an invitation)</li>
<li>Alternative pathway for those who don't qualify for federal programs</li>
<li>Faster processing in some cases</li>
</ul>

<h2>How to Apply</h2>
<p>Application processes vary by province. Some require you to apply directly to the province, while others operate through Express Entry.</p>`,
      category: 'Provincial Nominee',
      featured: false,
    },
  ];

  try {
    for (const article of sampleArticles) {
      await db.insert(articles).values(article);
    }
    console.log(`✓ Created ${sampleArticles.length} sample articles`);
  } catch (error) {
    console.log('Sample articles may already exist, skipping...');
  }

  // Seed ad settings with default codes
  const defaultAds = [
    {
      name: 'popunder',
      code: '<script src="https://pl31077358.profitableratecpmnetwork.com/0c/71/95/0c7195d0bb21832ee8496fe4a1d2c294.js"></script>',
      enabled: true,
    },
    {
      name: 'native_4_1',
      code: '<script async="async" data-cfasync="false" src="https://pl31077359.profitableratecpmnetwork.com/6cda864b2e72b80da3a8f219827273f7/invoke.js"></script>\n<div id="container-6cda864b2e72b80da3a8f219827273f7"></div>',
      enabled: true,
    },
    {
      name: 'native_1_4',
      code: '<script async="async" data-cfasync="false" src="https://pl31077359.profitableratecpmnetwork.com/6cda864b2e72b80da3a8f219827273f7/invoke.js"></script>\n<div id="container-6cda864b2e72b80da3a8f219827273f7"></div>',
      enabled: true,
    },
    {
      name: 'social_bar',
      code: '<script src="https://pl31077360.profitableratecpmnetwork.com/9e/49/3b/9e493b3db6ce527283efc8337e841162.js"></script>',
      enabled: false,
    },
    {
      name: 'banner_468_60',
      code: `<script>
  atOptions = {
    'key' : 'b2693add5bf7fdb6277e5765aa9a123c',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/b2693add5bf7fdb6277e5765aa9a123c/invoke.js"></script>`,
      enabled: true,
    },
    {
      name: 'banner_300_250',
      code: `<script>
  atOptions = {
    'key' : 'babe4d663abf14ee0583e04c74714670',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/babe4d663abf14ee0583e04c74714670/invoke.js"></script>`,
      enabled: true,
    },
    {
      name: 'banner_160_300',
      code: `<script>
  atOptions = {
    'key' : '620adf4b548bfbe69770dc2bb471fce7',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/620adf4b548bfbe69770dc2bb471fce7/invoke.js"></script>`,
      enabled: true,
    },
    {
      name: 'banner_160_600',
      code: `<script>
  atOptions = {
    'key' : '71f3dde0ec2918e17632126416cb4ce8',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/71f3dde0ec2918e17632126416cb4ce8/invoke.js"></script>`,
      enabled: true,
    },
    {
      name: 'smartlink',
      code: '<a href="https://www.profitableratecpmnetwork.com/rmez53tuk?key=bf74ea732804ce0f9d84d77c3d2156bd">Smartlink</a>',
      enabled: false,
    },
    {
      name: 'banner_320_50',
      code: `<script>
  atOptions = {
    'key' : '1b603eccfaf8f75b705683f391b7f5f4',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/1b603eccfaf8f75b705683f391b7f5f4/invoke.js"></script>`,
      enabled: true,
    },
    {
      name: 'banner_728_90',
      code: `<script>
  atOptions = {
    'key' : 'c7f08713563a6abcc2330f9bc9f8f28f',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/c7f08713563a6abcc2330f9bc9f8f28f/invoke.js"></script>`,
      enabled: true,
    },
  ];

  try {
    for (const ad of defaultAds) {
      await db.insert(adSettings).values(ad);
    }
    console.log(`✓ Created ${defaultAds.length} ad settings`);
  } catch (error) {
    console.log('Ad settings may already exist, skipping...');
  }

  console.log('✓ Database seed completed!');
}

seed().catch(console.error);
