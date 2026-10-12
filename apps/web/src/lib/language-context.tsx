'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'am' | 'om' | 'ti';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  shortLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', shortLabel: 'አማ', flag: '🇪🇹' },
  { code: 'om', label: 'Oromifa', nativeLabel: 'Afaan Oromoo', shortLabel: 'ORO', flag: '🇪🇹' },
  { code: 'ti', label: 'Tigrinya', nativeLabel: 'ትግርኛ', shortLabel: 'ትግ', flag: '🇪🇹' },
];

export interface TranslationDictionary {
  [key: string]: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  // ──────────────────────────── ENGLISH ────────────────────────────
  en: {
    // Navigation
    'nav.search': 'Search',
    'nav.donate': 'Donate',
    'nav.fundraise': 'Fundraise',
    'nav.about': 'About',
    'nav.signIn': 'Sign In',
    'nav.startCampaign': 'Start a campaign',
    'nav.giveMonthly': 'Give monthly',
    'nav.language': 'Language',

    // Dropdowns - Donate
    'nav.browseCampaigns': 'Browse campaigns',
    'nav.browseCampaignsSub': 'Find someone to help today',
    'nav.giveMonthlySub': 'From 10 Br a month',
    'nav.charityOrgs': 'Charity organizations',
    'nav.charityOrgsSub': 'Support registered groups',
    'nav.verifiedPersons': 'Verified persons',
    'nav.verifiedPersonsSub': 'Trusted public figures',

    // Dropdowns - Fundraise
    'nav.startPersonal': 'Start a personal fundraiser',
    'nav.startPersonalSub': 'For medical, education, or emergency',
    'nav.referSomeone': 'Refer someone in need',
    'nav.referSomeoneSub': 'Help a neighbor or family member',
    'nav.registerOrg': 'Register an organization',
    'nav.registerOrgSub': 'For NGOs, churches, mosques, and charities',

    // Dropdowns - About
    'nav.aboutWeGen': 'About Go Fund Me Ethiopia',
    'nav.aboutWeGenSub': 'Our mission and verification model',
    'nav.howItWorks': 'How it works',
    'nav.howItWorksSub': 'From setup to transparent payout',
    'nav.trustSafety': 'Trust & safety',
    'nav.trustSafetySub': 'How we review every single request',
    'nav.pricingFees': 'Pricing & fees',
    'nav.pricingFeesSub': 'Zero platform fees on giving',

    // Hero Section
    'hero.title': 'Connecting hearts, empowering lives.',
    'hero.subtitle': "Ethiopia's first digital charity ecosystem. Share your story, help someone who cannot, support a registered charity, or give monthly, all in one trusted place.",
    'hero.startBtn': 'Start a campaign',
    'hero.monthlyBtn': 'Give monthly',
    'hero.liveNow': 'Live now',
    'hero.dawitTitle': 'Heart surgery for Dawit, age 6',
    'hero.dawitLocation': 'Addis Ababa · Referred by Hope Ethiopia',
    'hero.raisedOf': 'raised of',
    'hero.donateBtn': 'Donate',
    'hero.justNow': 'just now',
    'hero.minAgo': '1 min ago',
    'hero.raisedText': 'raised',
    'hero.goalText': 'goal',

    // Stat Counter
    'stats.raised': 'Raised for causes',
    'stats.campaigns': 'Verified campaigns',
    'stats.donors': 'Donors joined',
    'stats.regions': 'Regional branches',

    // Campaigns Section
    'camp.tag': 'Verified fundraisers',
    'camp.heading': 'Verified campaigns right now',
    'camp.sub': 'Every fundraiser is thoroughly vetted by our team before publishing.',
    'camp.viewAll': 'View all campaigns',
    'camp.verified': 'Verified',
    'camp.by': 'by',
    'camp.raised': 'raised',
    'camp.of': 'of',
    'camp.urgent': 'Urgent',
    'camp.donate': 'Donate',

    // Communities / 4 Ways
    'ways.tag': 'Four ways to raise',
    'ways.heading': 'A platform built for every kind of need',
    'ways.sub': 'Whether you are raising for yourself, helping a neighbor, or running an established charity, we have a clear, verified path for you.',
    'ways.directTitle': 'Direct Seekers',
    'ways.directDesc': 'Individuals facing medical emergencies, disaster relief, or urgent personal hardship with full ID verification.',
    'ways.referralsTitle': 'Referrals',
    'ways.referralsDesc': 'Help someone who cannot access technology, bank accounts, or the internet themselves.',
    'ways.charityTitle': 'Charity Organizations',
    'ways.charityDesc': 'Registered non-profits, orphanages, elder-care homes, and faith-based community organizations.',
    'ways.verifiedTitle': 'Verified Persons',
    'ways.verifiedDesc': 'Community leaders, elders, artists, and public figures organizing grassroots community support.',
    'ways.learnMore': 'Learn more',

    // Monthly Giving
    'monthly.tag': 'Monthly impact',
    'monthly.heading': 'Small amounts change lives when given together.',
    'monthly.sub': 'Join thousands of Ethiopians giving every month to support verified children, medical cases, and vetted charities.',
    'monthly.toggleOrgs': 'Charity Organizations',
    'monthly.togglePersons': 'Verified Persons',
    'monthly.perMonth': 'Br / month',
    'monthly.button': 'Start monthly giving',
    'monthly.impactLabel': 'Your monthly gift provides meals, books, or medication reliably every single month.',

    // Trust & Verification
    'trust.tag': 'Trust & Verification',
    'trust.heading': 'How we keep giving safe and honest',
    'trust.sub': 'Every birr is tracked. Every campaign is reviewed by our local team before receiving a single donation.',
    'trust.idTitle': '100% ID Verified',
    'trust.idDesc': 'National ID, Kebele ID, or Passport required for all organizers.',
    'trust.bankTitle': 'Bank-Direct Payouts',
    'trust.bankDesc': 'Funds are disbursed directly to official hospital, vendor, or recipient bank accounts.',
    'trust.feeTitle': 'Zero Hidden Fees',
    'trust.feeDesc': 'Transparent accounting. 100% of your donation reaches the intended cause.',
    'trust.monitorTitle': 'Community Monitored',
    'trust.monitorDesc': 'Public updates, receipts, and progress reports shared on every milestone.',

    // How It Works / Sticky Story
    'story.tag': 'How it works',
    'story.s1Title': '1. Tell your story',
    'story.s1Desc': 'Set up your campaign in under ten minutes with local ID and story details.',
    'story.s2Title': '2. Share with the world',
    'story.s2Desc': 'Share to Telegram, WhatsApp, TikTok, and Facebook with one tap.',
    'story.s3Title': '3. Receive transparent funding',
    'story.s3Desc': 'Funds transfer directly to verified Ethiopian bank accounts (CBE, Telebirr, Awash).',

    // Final CTA
    'cta.title': 'Join + Donate + Fund = Ethiopia.',
    'cta.sub': 'It takes about ten minutes to set up. We will guide you through each step.',
    'cta.startBtn': 'Start a campaign',
    'cta.monthlyBtn': 'Give monthly',
    'cta.appsComing': 'Mobile apps for App Store and Google Play are coming soon.',

    // Footer
    'footer.about': 'About',
    'footer.fees': 'Fees',
    'footer.help': 'Help',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.copy': '© 2026 Go Fund Me Ethiopia · Follow @GoFundMeEthiopia · #GFE #SupportEthiopia #DigitalCharity',

    // Discover & Search
    'discover.searchPlaceholder': 'Find fundraisers, nonprofits, and people',
    'discover.all': 'All',
    'discover.fundraisers': 'Fundraisers',
    'discover.nonprofits': 'Nonprofits',
    'discover.profiles': 'Profiles',
    'discover.communities': 'Communities',
    'discover.noResults': 'No campaigns found matching your query.',
    'discover.goal': 'Goal',
    'discover.raised': 'Raised',
  },

  // ──────────────────────────── AMHARIC (አማርኛ) ────────────────────────────
  am: {
    // Navigation
    'nav.search': 'ፈልግ',
    'nav.donate': 'ይለግሱ',
    'nav.fundraise': 'ገንዘብ ያሰባስቡ',
    'nav.about': 'ስለ እኛ',
    'nav.signIn': 'ይግቡ',
    'nav.startCampaign': 'ዘመቻ ይጀምሩ',
    'nav.giveMonthly': 'ወርሃዊ ድጋፍ',
    'nav.language': 'ቋንቋ',

    // Dropdowns - Donate
    'nav.browseCampaigns': 'ዘመቻዎችን ይመልከቱ',
    'nav.browseCampaignsSub': 'ዛሬ የሚረዱትን ሰው ያግኙ',
    'nav.giveMonthlySub': 'ከ10 ብር ጀምሮ በወር',
    'nav.charityOrgs': 'የበጎ አድራጎት ድርጅቶች',
    'nav.charityOrgsSub': 'የተመዘገቡ ተቋማትን ይደግፉ',
    'nav.verifiedPersons': 'የተረጋገጡ ግለሰቦች',
    'nav.verifiedPersonsSub': 'የታመኑ ህዝባዊ ግለሰቦች',

    // Dropdowns - Fundraise
    'nav.startPersonal': 'የግል የገንዘብ ማሰባሰብ ይጀምሩ',
    'nav.startPersonalSub': 'ለህክምና፣ ትምህርት ወይም ድንገተኛ አደጋ',
    'nav.referSomeone': 'ችግረኛን ይጠቁሙ',
    'nav.referSomeoneSub': 'ጎረቤት ወይም ቤተሰብን ያግዙ',
    'nav.registerOrg': 'ድርጅትዎን ይመዝግቡ',
    'nav.registerOrgSub': 'ለማህበራት፣ ቤተክርስቲያናት፣ መስጊዶች እና በጎ አድራጊዎች',

    // Dropdowns - About
    'nav.aboutWeGen': 'ስለ ጎ ፈንድ ሚ ኢትዮጵያ',
    'nav.aboutWeGenSub': 'ተልዕኳችን እና የማረጋገጫ ስርዓታችን',
    'nav.howItWorks': 'አሰራሩ እንዴት ነው',
    'nav.howItWorksSub': 'ከምዝገባ እስከ ግልጽ ክፍያ',
    'nav.trustSafety': 'እምነት እና ደህንነት',
    'nav.trustSafetySub': 'እያንዳንዱን ጥያቄ እንዴት እንደምናረጋግጥ',
    'nav.pricingFees': 'ክፍያዎች እና ተመኖች',
    'nav.pricingFeesSub': 'በልገሳ ላይ ምንም የአገልግሎት ክፍያ የለም',

    // Hero Section
    'hero.title': 'ልቦችን በማገናኘት፣ ህይወትን እናበለጽጋለን።',
    'hero.subtitle': 'የኢትዮጵያ ቀዳሚው ዲጂታል የበጎ አድራጎት መድረክ። ታሪክዎን ያካፍሉ፣ እርዳታ የሚሹትን ይደግፉ፣ የተመዘገቡ ማህበራትን ያግዙ፣ ወይም ወርሃዊ ድጋፍ ያድርጉ።',
    'hero.startBtn': 'ዘመቻ ይጀምሩ',
    'hero.monthlyBtn': 'ወርሃዊ ድጋፍ',
    'hero.liveNow': 'በቀጥታ በመካሄድ ላይ',
    'hero.dawitTitle': 'የ6 ዓመቱ ዳዊት የልብ ቀዶ ህክምና',
    'hero.dawitLocation': 'አዲስ አበባ · በሆፕ ኢትዮጵያ የተጠቆመ',
    'hero.raisedOf': 'የተሰበሰበው ከ',
    'hero.donateBtn': 'ይለግሱ',
    'hero.justNow': 'አሁን',
    'hero.minAgo': 'ከ1 ደቂቃ በፊት',
    'hero.raisedText': 'የተሰበሰበ',
    'hero.goalText': 'ግብ',

    // Stat Counter
    'stats.raised': 'የተሰበሰበ ድጋፍ',
    'stats.campaigns': 'የተረጋገጡ ዘመቻዎች',
    'stats.donors': 'የተሳተፉ ለጋሾች',
    'stats.regions': 'የክልል ተደራሽነት',

    // Campaigns Section
    'camp.tag': 'የተረጋገጡ ዘመቻዎች',
    'camp.heading': 'በአሁኑ ወቅት በመካሄድ ላይ ያሉ የተረጋገጡ ዘመቻዎች',
    'camp.sub': 'እያንዳንዱ የገንዘብ ማሰባሰብ ከመለጠፉ በፊት በጥልቀት ይረጋገጣል።',
    'camp.viewAll': 'ሁሉንም ዘመቻዎች ይመልከቱ',
    'camp.verified': 'የተረጋገጠ',
    'camp.by': 'በ',
    'camp.raised': 'ተሰብስቧል',
    'camp.of': 'ከ',
    'camp.urgent': 'አስቸኳይ',
    'camp.donate': 'ይለግሱ',

    // Communities / 4 Ways
    'ways.tag': 'አራት የማሰባሰቢያ መንገዶች',
    'ways.heading': 'ለማንኛውም አይነት ፍላጎት የተሰራ አስተማማኝ መድረክ',
    'ways.sub': 'ለራስዎ ቢያሰባስቡ፣ ጎረቤት ቢረዱ፣ ወይም የበጎ አድራጎት ድርጅት ቢያስተዳድሩ፣ ለእርስዎ ግልጽ እና የተረጋገጠ አሰራር አለን።',
    'ways.directTitle': 'ቀጥታ ፈላጊዎች',
    'ways.directDesc': 'የህክምና፣ ድንገተኛ አደጋ፣ ወይም አስቸኳይ የግል ችግር ያለባቸው ግለሰቦች በመታወቂያ ተረጋግጠው።',
    'ways.referralsTitle': 'ጠቋሚዎች',
    'ways.referralsDesc': 'ቴክኖሎጂ፣ የባንክ ሂሳብ ወይም ኢንተርኔት በራሳቸው ማግኘት የማይችሉ ሰዎችን ያግዙ።',
    'ways.charityTitle': 'የበጎ አድራጎት ድርጅቶች',
    'ways.charityDesc': 'የተመዘገቡ ግብረ-ሰናይ ተቋማት፣ የየቲሞች ማሳደጊያዎች፣ የአረጋውያን ማዕከላት እና ማህበራት።',
    'ways.verifiedTitle': 'የተረጋገጡ ግለሰቦች',
    'ways.verifiedDesc': 'የማህበረሰብ መሪዎች፣ አባቶች፣ ከያንያን እና ታዋቂ ሰዎች የሚያስተባብሯቸው የበጎ አድራጎት ስራዎች።',
    'ways.learnMore': 'ተጨማሪ ይመልከቱ',

    // Monthly Giving
    'monthly.tag': 'ወርሃዊ ተጽዕኖ',
    'monthly.heading': 'ጥቃቅን ድጋፎች በአንድ ላይ ሲሰባሰቡ ህይወትን ይለውጣሉ።',
    'monthly.sub': 'በየወሩ ወርሃዊ ድጋፍ በመስጠት የተረጋገጡ ህጻናትን፣ የህክምና ጉዳዮችን እና የበጎ አድራጎት ተቋማትን የሚደግፉ በሺዎች የሚቆጠሩ ኢትዮጵያውያንን ይቀላቀሉ።',
    'monthly.toggleOrgs': 'የበጎ አድራጎት ድርጅቶች',
    'monthly.togglePersons': 'የተረጋገጡ ግለሰቦች',
    'monthly.perMonth': 'ብር / በወር',
    'monthly.button': 'ወርሃዊ ድጋፍ ይጀምሩ',
    'monthly.impactLabel': 'ወርሃዊ ድጋፍዎ በየወሩ ምግብ፣ የትምህርት ቁሳቁስ ወይም መድሃኒት በአስተማማኝ ሁኔታ ያቀርባል።',

    // Trust & Verification
    'trust.tag': 'እምነት እና ማረጋገጫ',
    'trust.heading': 'ልገሳውን ደህንነቱ የተጠበቀ እና ታማኝ የምናደርገው በዚህ መንገድ ነው',
    'trust.sub': 'እያንዳንዱ ብር ክትትል ይደረግበታል፤ እያንዳንዱ ዘመቻ አንድም ልገሳ ሳይቀበል በአካባቢው ቡድናችን ይረጋገጣል።',
    'trust.idTitle': '100% በመታወቂያ የተረጋገጠ',
    'trust.idDesc': 'ለሁሉም አዘጋጆች ብሔራዊ መታወቂያ፣ የቀበሌ መታወቂያ ወይም ፓስፖርት ያስፈልጋል።',
    'trust.bankTitle': 'በቀጥታ ወደ ባንክ ሂሳብ',
    'trust.bankDesc': 'ገንዘብ በቀጥታ ወደ ይፋዊ የሆስፒታል፣ የአቅራቢ ወይም የተረጂ የባንክ ሂሳብ ይተላለፋል።',
    'trust.feeTitle': 'ምንም የተደበቀ ክፍያ የለም',
    'trust.feeDesc': 'ግልጽ የሂሳብ አሰራር፤ የልገሳዎ 100% ሙሉ ለሙሉ ለተዘጋጀለት አላማ ይደርሳል።',
    'trust.monitorTitle': 'በማህበረሰብ የሚከታተል',
    'trust.monitorDesc': 'በየደረጃው ይፋዊ መግለጫዎች፣ ደረሰኞች እና የሂደት ሪፖርቶች ይጋራሉ።',

    // How It Works / Sticky Story
    'story.tag': 'አሰራሩ',
    'story.s1Title': '1. ታሪክዎን ያካፍሉ',
    'story.s1Desc': 'በአስር ደቂቃ ውስጥ በአካባቢ መታወቂያ እና በታሪክዎ ዝርዝር ዘመቻዎን ያዘጋጁ።',
    'story.s2Title': '2. ለዓለም ያካፍሉ',
    'story.s2Desc': 'በአንድ ጠቅታ ወደ ቴሌግራም፣ ዋትስአፕ፣ ቲክቶክ እና ፌስቡክ ያጋሩ።',
    'story.s3Title': '3. ግልጽ የገንዘብ ድጋፍ ይቀበሉ',
    'story.s3Desc': 'ገንዘብ በቀጥታ ወደ ተረጋገጡ የኢትዮጵያ ባንክ ሂሳቦች (ንግድ ባንክ፣ ቴሌብር፣ አዋሽ) ይተላለፋል።',

    // Final CTA
    'cta.title': 'ይቀላቀሉ + ይለግሱ + ያሰባስቡ = ኢትዮጵያ።',
    'cta.sub': 'ለማዘጋጀት አስር ደቂቃ ያህል ይወስዳል። በእያንዳንዱ ደረጃ እንመራዎታለን።',
    'cta.startBtn': 'ዘመቻ ይጀምሩ',
    'cta.monthlyBtn': 'ወርሃዊ ድጋፍ',
    'cta.appsComing': 'የአፕ ስቶር እና ጉግል ፕሌይ የሞባይል መተግበሪያዎች በቅርቡ ይመጣሉ።',

    // Footer
    'footer.about': 'ስለ እኛ',
    'footer.fees': 'ክፍያዎች',
    'footer.help': 'እርዳታ',
    'footer.privacy': 'የግላዊነት ፖሊሲ',
    'footer.terms': 'ውሎች እና ደንቦች',
    'footer.copy': '© 2026 ጎ ፈንድ ሚ ኢትዮጵያ · @GoFundMeEthiopia ይከተሉ · #GFE #ኢትዮጵያ #በጎ_አድራጎት',

    // Discover & Search
    'discover.searchPlaceholder': 'ዘመቻዎችን፣ የበጎ አድራጎት ተቋማትን እና ሰዎችን ይፈልጉ',
    'discover.all': 'ሁሉም',
    'discover.fundraisers': 'ዘመቻዎች',
    'discover.nonprofits': 'የበጎ አድራጎት ተቋማት',
    'discover.profiles': 'መገለጫዎች',
    'discover.communities': 'ማህበረሰቦች',
    'discover.noResults': 'የተፈለገው ዘመቻ አልተገኘም።',
    'discover.goal': 'ግብ',
    'discover.raised': 'የተሰበሰበ',
  },

  // ──────────────────────────── OROMIFA (Afaan Oromoo) ────────────────────────────
  om: {
    // Navigation
    'nav.search': 'Barbaadi',
    'nav.donate': 'Gumaachi',
    'nav.fundraise': 'Gargaarsa Walitti Qabaa',
    'nav.about': "Waa'ee Keenya",
    'nav.signIn': 'Seeni',
    'nav.startCampaign': 'Duula Jalqabaa',
    'nav.giveMonthly': "Ji'aan Gumaachaa",
    'nav.language': 'Afaan',

    // Dropdowns - Donate
    'nav.browseCampaigns': 'Duulawwan Daawwadhaa',
    'nav.browseCampaignsSub': "Nama har'a gargaartan argadhaa",
    'nav.giveMonthlySub': "Ji'atti Qr 10 irraa kaasee",
    'nav.charityOrgs': 'Dhaabbilee Tola Ooltummaa',
    'nav.charityOrgsSub': "Garee galmaa'an deeggaraa",
    'nav.verifiedPersons': "Namoota Mirkanaa'an",
    'nav.verifiedPersonsSub': 'Namoota beekamoo amanamoo',

    // Dropdowns - Fundraise
    'nav.startPersonal': 'Duula dhuunfaa jalqabaa',
    'nav.startPersonalSub': 'Yaala fayyaa, barnoota, ykn balaa tasaatiif',
    'nav.referSomeone': 'Nama gargaarsa barbaadu agarsiisaa',
    'nav.referSomeoneSub': 'Ollaa ykn maatii keessan gargaaraa',
    'nav.registerOrg': 'Dhaabbata Galmeessaa',
    'nav.registerOrgSub': 'Dhaabbilee miti-mootummaa, manneen amantaa fi tola ooltotaaf',

    // Dropdowns - About
    'nav.aboutWeGen': "Waa'ee Go Fund Me Ethiopia",
    'nav.aboutWeGenSub': 'Ergama keenya fi sirna mirkaneessaa',
    'nav.howItWorks': 'Akkaataa inni hojjetu',
    'nav.howItWorksSub': 'Qophii irraa hanga kaffaltii ifaatti',
    'nav.trustSafety': 'Amanamummaa fi Nageenya',
    'nav.trustSafetySub': 'Gaaffii tokkoon tokkoo akkamitti akka mirkaneessinu',
    'nav.pricingFees': 'Kaffaltii fi Taarifa',
    'nav.pricingFeesSub': 'Gumaacha irratti kaffaltiin dabalataa hin jiru',

    // Hero Section
    'hero.title': 'Onnee walitti fiduun, jireenya dandeessisuu.',
    'hero.subtitle': "Sirna tola ooltummaa dijitaalaa Itoophiyaa isa jalqabaa. Seenaa keessan qoodaa, nama rakkate gargaaraa, dhaabbilee galmaa'an deeggaraa, ykn ji'a ji'aan gumaachaa.",
    'hero.startBtn': 'Duula Jalqabaa',
    'hero.monthlyBtn': "Ji'aan Gumaachaa",
    'hero.liveNow': 'Amma Kallattiin',
    'hero.dawitTitle': 'Baqaqsanii hodhuu onnee Daawwit, waggaa 6',
    'hero.dawitLocation': 'Finfinnee · Hope Ethiopia-n kan agarsiifame',
    'hero.raisedOf': 'keessaa walitti qabame',
    'hero.donateBtn': 'Gumaachi',
    'hero.justNow': 'amma',
    'hero.minAgo': 'daqiiqaa 1 dura',
    'hero.raisedText': 'walitti qabame',
    'hero.goalText': 'kaayyoo',

    // Stat Counter
    'stats.raised': 'Gumaacha Walitti Qabame',
    'stats.campaigns': "Duulawwan Mirkanaa'an",
    'stats.donors': 'Gumaachitoota Hirmaatan',
    'stats.regions': 'Dameelee Naannoo',

    // Campaigns Section
    'camp.tag': "Duulawwan Mirkanaa'an",
    'camp.heading': "Duulawwan yeroo ammaa mirkanaa'an",
    'camp.sub': "Duulli kamiyyuu maxxanfamuun dura garee keenyaan sirriitti sakatta'ama.",
    'camp.viewAll': 'Duulawwan hunda daawwadhaa',
    'camp.verified': "Mirkanaa'e",
    'camp.by': 'kan',
    'camp.raised': 'walitti qabame',
    'camp.of': 'keessaa',
    'camp.urgent': 'Balaa Tasaa',
    'camp.donate': 'Gumaachi',

    // Communities / 4 Ways
    'ways.tag': 'Karaalee gargaarsa sassaabuu 4',
    'ways.heading': 'Sirna fedhii hundumaaf ijaarame',
    'ways.sub': 'Ofii keessaniif yoo walitti qabdan, ollaa yoo gargaartan, ykn dhaabbata tola ooltummaa yoo gaggeessitan, karaa ifa tahe qabna.',
    'ways.directTitle': 'Barbaaddota Kallattii',
    'ways.directDesc': 'Namoota balaa tasaa, yaala fayyaa, ykn rakkoo cimaa qaban kan waraqaa eenyummaatiin mirkanaahan.',
    'ways.referralsTitle': 'Agarsiistota',
    'ways.referralsDesc': 'Namoota teeknooloojii, herrega baankii, ykn interneetii ofiin argachuu hin dandeenye gargaaraa.',
    'ways.charityTitle': 'Dhaabbilee Tola Ooltummaa',
    'ways.charityDesc': 'Dhaabbilee tola ooltummaa galmaahan, manneen ijoollee abbaa maleeyyii, fi kanneen maanguddootaa.',
    'ways.verifiedTitle': "Namoota Mirkanaa'an",
    'ways.verifiedDesc': 'Geggeessitoota hawaasaa, maanguddoota, aartistiifi namoota beekamoo hawaasa qindeessan.',
    'ways.learnMore': 'Dabalata Baruuf',

    // Monthly Giving
    'monthly.tag': "Dhiibbaa Ji'aa",
    'monthly.heading': 'Gumaachi xiqqaan yeroo walitti dhufe jireenya jijjiira.',
    'monthly.sub': "Kumaatama Itoophiyaanota ji'a ji'aan daa'imman, yaala fayyaa fi dhaabbilee deeggaraniin walitti makamaa.",
    'monthly.toggleOrgs': 'Dhaabbilee Tola Ooltummaa',
    'monthly.togglePersons': "Namoota Mirkanaa'an",
    'monthly.perMonth': "Qr / ji'atti",
    'monthly.button': "Gumaacha ji'aa jalqabaa",
    'monthly.impactLabel': "Gumaachi ji'aa keessan nyaata, meeshaalee barnootaa ykn qoricha amanamummaan dhiheessa.",

    // Trust & Verification
    'trust.tag': 'Amanamummaa fi Mirkaneessa',
    'trust.heading': 'Akkamitti gumaacha nageenya qabuufi amanamaa goona',
    'trust.sub': 'Qarsiin tokkoon tokkoo ni hordofama. Duulli kamiyyuu gumaacha tokko osoo hin argatin dura garee keenyaan mirkanaaha.',
    'trust.idTitle': "100% Waraqaa Eenyummaatiin Mirkanaa'e",
    'trust.idDesc': 'Qindeessitoota hundaaf Waraqaa Eenyummaa Biyyooleessaa, Gandaa ykn Paaspoortiin barbaachisaadha.',
    'trust.bankTitle': 'Kaffaltii Kallattii Baankii',
    'trust.bankDesc': 'Maallaqni kallattiin gara herrega baankii hospitaalaa, dhiheessaa, ykn gargaaramaatti darba.',
    'trust.feeTitle': 'Kaffaltii Dhokataa Tokkollee Hin Jiru',
    'trust.feeDesc': 'Herrega ifa tahe. Gumaachi keessan 100% gara kaayyoo barbaadameetti qaqqaba.',
    'trust.monitorTitle': 'Hawaasaan Kan Hordofamu',
    'trust.monitorDesc': 'Sadarkaa hunda irratti odeeffannoo haaraa, nagahee fi gabaasa hojii ifa tahe qoodama.',

    // How It Works / Sticky Story
    'story.tag': 'Akkaataa Hojii',
    'story.s1Title': '1. Seenaa keessan qoodaa',
    'story.s1Desc': 'Daqiiqaa kudhan keessatti waraqaa eenyummaa fi seenaa keessaniin duula qopheessaa.',
    'story.s2Title': '2. Addunyaaf qoodaa',
    'story.s2Desc': 'Qubsuma tokkoon gara Telegiraamii, WhatsApp, TikTok fi Feezbuukiitti qoodaa.',
    'story.s3Title': '3. Gargaarsa ifa tahe fudhadhaa',
    'story.s3Desc': 'Maallaqni kallattiin gara herrega baankota Itoophiyaa mirkanaahaniitti (CBE, Telebirr, Awaash) darba.',

    // Final CTA
    'cta.title': 'Makamaa + Gumaachaa + Walitti Qabaa = Itoophiyaa.',
    'cta.sub': 'Qopheessuuf daqiiqaa 10 qofa fudhata. Sadarkaa hunda irratti isin qajeelchina.',
    'cta.startBtn': 'Duula Jalqabaa',
    'cta.monthlyBtn': "Ji'aan Gumaachaa",
    'cta.appsComing': 'Appilikeeshiniiwwan moobaayilaa App Store fi Google Play dhihootti ni dhihaatu.',

    // Footer
    'footer.about': "Waa'ee Keenya",
    'footer.fees': 'Kaffaltii Tajaajilaa',
    'footer.help': 'Gargaarsa',
    'footer.privacy': 'Iccitii',
    'footer.terms': 'Waliigaltee',
    'footer.copy': '© 2026 Go Fund Me Ethiopia · @GoFundMeEthiopia hordofaa · #GFE #Itoophiyaa #TolaOoltummaa',

    // Discover & Search
    'discover.searchPlaceholder': 'Duulawwan, dhaabbilee fi namoota barbaadaa',
    'discover.all': 'Hunda',
    'discover.fundraisers': 'Duulawwan',
    'discover.nonprofits': 'Dhaabbilee Tola Ooltummaa',
    'discover.profiles': 'Fuulawwan',
    'discover.communities': 'Hawaasota',
    'discover.noResults': 'Duulli barbaaddan hin argamne.',
    'discover.goal': 'Kaayyoo',
    'discover.raised': 'Walitti qabame',
  },

  // ──────────────────────────── TIGRINYA (ትግርኛ) ────────────────────────────
  ti: {
    // Navigation
    'nav.search': 'ድለይ',
    'nav.donate': 'ለግሱ',
    'nav.fundraise': 'ሓገዝ ኣክቡ',
    'nav.about': 'ብዛዕባና',
    'nav.signIn': 'እተዉ',
    'nav.startCampaign': 'ዘመቻ ጀምሩ',
    'nav.giveMonthly': 'ናይ ወርሒ ሓገዝ',
    'nav.language': 'ቋንቋ',

    // Dropdowns - Donate
    'nav.browseCampaigns': 'ዘመቻታት ርኣዩ',
    'nav.browseCampaignsSub': 'ሎሚ ትሕግዝዎ ሰብ ርኸቡ',
    'nav.giveMonthlySub': 'ካብ 10 ቅርሺ ጀሚሩ ኣብ ወርሒ',
    'nav.charityOrgs': 'ናይ ግብረ-ሰናይ ትካላት',
    'nav.charityOrgsSub': 'ዝተመዝገቡ ትካላት ደግፉ',
    'nav.verifiedPersons': 'ዝተረጋገጹ ውልቀሰባት',
    'nav.verifiedPersonsSub': 'ዝተኣመኑ ህዝባውያን ሰባት',

    // Dropdowns - Fundraise
    'nav.startPersonal': 'ናይ ውልቂ ምእካብ ሓገዝ ጀምሩ',
    'nav.startPersonalSub': 'ንሕክምና፣ ትምህርቲ ወይ ህጹጽ ሓደጋ',
    'nav.referSomeone': 'ሓገዝ ዘድልዮ ሰብ ጠቁሙ',
    'nav.referSomeoneSub': 'ጎረቤት ወይ ቤተሰብ ሓግዙ',
    'nav.registerOrg': 'ትካልኩም መዝግቡ',
    'nav.registerOrgSub': 'ንማሕበራት፣ ቤተክርስቲያን፣ መስጊዳት ከምኡ’ውን ገበርቲ ሰናይ',

    // Dropdowns - About
    'nav.aboutWeGen': 'ብዛዕባ ጎ ፈንድ ሚ ኢትዮጵያ',
    'nav.aboutWeGenSub': 'ዕላማናን ስርዓት ምርግጋጽናን',
    'nav.howItWorks': 'ብኸመይ ይሰርሕ',
    'nav.howItWorksSub': 'ካብ ምዝገባ ክሳብ ግሉጽ ክፍሊት',
    'nav.trustSafety': 'እምነትን ድሕንነትን',
    'nav.trustSafetySub': 'ነፍሲ ወከፍ ሕቶ ብኸመይ ከምነረጋግጽ',
    'nav.pricingFees': 'ክፍሊትን ታሪፍን',
    'nav.pricingFeesSub': 'ኣብ ልገሳ ናጻ ናይ መድረኽ ክፍሊት',

    // Hero Section
    'hero.title': 'ልብታት ብምትእስሳር፣ ህይወት ነበርኽ።',
    'hero.subtitle': 'ናይ ኢትዮጵያ ቀዳማይ ዲጂታል መድረኽ ግብረ-ሰናይ። ታሪኽኩም ኣካፍሉ፣ ሓገዝ ንዝደልዩ ሓግዙ፣ ዝተመዝገቡ ማሕበራት ደግፉ፣ ወይ ድማ ወርሓዊ ሓገዝ ግበሩ።',
    'hero.startBtn': 'ዘመቻ ጀምሩ',
    'hero.monthlyBtn': 'ናይ ወርሒ ሓገዝ',
    'hero.liveNow': 'ቀጥታ ይካየድ ኣሎ',
    'hero.dawitTitle': 'ናይ 6 ዓመት ዳዊት ናይ ልቢ መጥባሕቲ',
    'hero.dawitLocation': 'ኣዲስ ኣበባ · ብሆፕ ኢትዮጵያ ዝተጠቆመ',
    'hero.raisedOf': 'ካብ ዝተኣከበ',
    'hero.donateBtn': 'ለግሱ',
    'hero.justNow': 'ሕጂ',
    'hero.minAgo': 'ቅድሚ 1 ደቒቕ',
    'hero.raisedText': 'ዝተኣከበ',
    'hero.goalText': 'ሸቶ',

    // Stat Counter
    'stats.raised': 'ዝተኣከበ ሓገዝ',
    'stats.campaigns': 'ዝተረጋገጹ ዘመቻታት',
    'stats.donors': 'ዝተሳተፉ ለገስቲ',
    'stats.regions': 'ናይ ክልላት ተበጻሕነት',

    // Campaigns Section
    'camp.tag': 'ዝተረጋገጹ ዘመቻታት',
    'camp.heading': 'ሐዚ ዝካየዱ ዘለዉ ዝተረጋገጹ ዘመቻታት',
    'camp.sub': 'ዝኾነ ይኹን ዘመቻ ቅድሚ ምውጽኡ ብጥንቃቐ ይረጋገጽ።',
    'camp.viewAll': 'ኩሎም ዘመቻታት ርኣዩ',
    'camp.verified': 'ዝተረጋገጸ',
    'camp.by': 'ብ',
    'camp.raised': 'ተኣኪቡ',
    'camp.of': 'ካብ',
    'camp.urgent': 'ህጹጽ',
    'camp.donate': 'ለግሱ',

    // Communities / 4 Ways
    'ways.tag': 'ኣርባዕተ መገድታት ምእካብ',
    'ways.heading': 'ንኹሉ ዓይነት ድሌት ዝተዳለወ መድረኽ',
    'ways.sub': 'ንባዕልኹም ትእክቡ፣ ንጎረቤት ትሕግዙ፣ ወይ ትካል ግብረ-ሰናይ ተመሓድሩ፣ ግሉጽን ዝተረጋገጸን መንገዲ ኣሎና።',
    'ways.directTitle': 'ቀጥታ ደለይቲ',
    'ways.directDesc': 'ናይ ሕክምና፣ ህጹጽ ሓደጋ፣ ወይ ከቢድ ጸገም ዘለዎም ውልቀሰባት ብመታወቂያ ተረጋጊጾም።',
    'ways.referralsTitle': 'ጠቆምቲ',
    'ways.referralsDesc': 'ቴክኖሎጂ፣ ሕሳብ ባንኪ ወይ ኢንተርኔት ባዕሎም ክረኽቡ ዘይክእሉ ሰባት ሓግዙ።',
    'ways.charityTitle': 'ናይ ግብረ-ሰናይ ትካላት',
    'ways.charityDesc': 'ዝተመዝገቡ ትካላት ግብረ-ሰናይ፣ መዕቆቢ ዘኽታማት፣ መዕቆቢ ዓበይቲ ዓድን ማሕበራትን።',
    'ways.verifiedTitle': 'ዝተረጋገጹ ውልቀሰባት',
    'ways.verifiedDesc': 'መራሕቲ ማሕበረሰብ፣ ዓበይቲ ዓዲ፣ ስነ-ጥበበኛታትን ህዝባውያን ሰባትን ዘተሓባብርዎም ስራሕቲ።',
    'ways.learnMore': 'ተወሳኺ ፍለጡ',

    // Monthly Giving
    'monthly.tag': 'ወርሓዊ ጽልዋ',
    'monthly.heading': 'ንኣሽቱ ሓገዛት ብሓባር እንተተኣኪቦም ህይወት ይልውጡ።',
    'monthly.sub': 'ኣብ ነፍሲ ወከፍ ወርሒ ሓገዝ ብምሃብ ዝተረጋገጹ ቆልዑ፣ ሕክምናን ትካላትን ዝድግፉ ኣሽሓት ኢትዮጵያውያን ተጸንበሩ።',
    'monthly.toggleOrgs': 'ናይ ግብረ-ሰናይ ትካላት',
    'monthly.togglePersons': 'ዝተረጋገጹ ውልቀሰባት',
    'monthly.perMonth': 'ቅርሺ / ኣብ ወርሒ',
    'monthly.button': 'ወርሓዊ ሓገዝ ጀምሩ',
    'monthly.impactLabel': 'ወርሓዊ ሓገዝኩም ኣብ ነፍሲ ወከፍ ወርሒ ምግቢ፣ ናይ ትምህርቲ ኣቑሑት ወይ መድሃኒት ብእሙን መገዲ የቕርብ።',

    // Trust & Verification
    'trust.tag': 'እምነትን ምርግጋጽን',
    'trust.heading': 'ልገሳ ድሕንነቱ ዝተሓለወን እሙንን ብኸመይ ንገብሮ',
    'trust.sub': 'ነፍሲ ወከፍ ቅርሺ ይከታተል፤ ዝኾነ ዘመቻ ሓንቲ ልገሳ ከይተቐበለ ብቐረባ ጉጅለና ይረጋገጽ።',
    'trust.idTitle': '100% ብመታወቂያ ዝተረጋገጸ',
    'trust.idDesc': 'ንኹሎም ኣዳለውቲ ሃገራዊ መታወቂያ፣ ናይ ቀበሌ መታወቂያ ወይ ፓስፖርት የድሊ።',
    'trust.bankTitle': 'ቀጥታ ናብ ሕሳብ ባንኪ ዝኽፈል',
    'trust.bankDesc': 'ገንዘብ ቀጥታ ናብ ወግዓዊ ሕሳብ ባንኪ ሆስፒታል፣ መቕረቢ ወይ ተረባሒ ይውዕል።',
    'trust.feeTitle': 'ምንም ሕቡእ ክፍሊት የለን',
    'trust.feeDesc': 'ግሉጽ ኣሰራርሓ ሕሳብ፤ ናይ ልገሳኹም 100% ንዝተሓሰበሉ ዕላማ ይበጽሕ።',
    'trust.monitorTitle': 'ብማሕበረሰብ ዝከታተል',
    'trust.monitorDesc': 'ኣብ ነፍሲ ወከፍ ብርኪ ወግዓዊ ሓበሬታታት፣ ቅብሊት ደረሰኝን ጸብጻብን ይቐርብ።',

    // How It Works / Sticky Story
    'story.tag': 'ኣሰራርሓ',
    'story.s1Title': '1. ታሪኽኩም ኣካፍሉ',
    'story.s1Desc': 'ኣብ ውሽጢ ዓሰርተ ደቒቕ ብመታወቂያኹምን ብዝርዝር ታሪኽኩምን ዘመቻኹም ኣዳልዉ።',
    'story.s2Title': '2. ንዓለም ኣካፍሉ',
    'story.s2Desc': 'ብሓንቲ ጠውቂ ናብ ቴሌግራም፣ ዋትስኣፕ፣ ቲክቶክን ፌስቡክን ኣካፍሉ።',
    'story.s3Title': '3. ግሉጽ ናይ ገንዘብ ሓገዝ ተቐበሉ',
    'story.s3Desc': 'ገንዘብ ቀጥታ ናብ ዝተረጋገጹ ናይ ባንኪ ሕሳባት ኢትዮጵያ (ንግዲ ባንክ፣ ቴሌብር፣ ኣዋሽ) ይዘዋወር።',

    // Final CTA
    'cta.title': 'ተጸንበሩ + ለግሱ + ኣክቡ = ኢትዮጵያ።',
    'cta.sub': 'ንምድላው ዓሰርተ ደቒቕ ጥራይ ይወስድ። ኣብ ነፍሲ ወከፍ ብርኪ ክንምርሓኩም ኢና።',
    'cta.startBtn': 'ዘመቻ ጀምሩ',
    'cta.monthlyBtn': 'ናይ ወርሒ ሓገዝ',
    'cta.appsComing': 'ናይ ሞባይል ኣፕሊኬሽናት ኣፕ ስቶርን ጉግል ፕሌይን ድሕሪ ሓጺር እዋን ክቐርቡ እዮም።',

    // Footer
    'footer.about': 'ብዛዕባና',
    'footer.fees': 'ክፍሊታት',
    'footer.help': 'ሓገዝ',
    'footer.privacy': 'ናይ ብሕትውና ፖሊሲ',
    'footer.terms': 'ውዕላትን ደንብታትን',
    'footer.copy': '© 2026 ጎ ፈንድ ሚ ኢትዮጵያ · @GoFundMeEthiopia ተኸታተሉ · #GFE #ኢትዮጵያ #ግብረ_ሰናይ',

    // Discover & Search
    'discover.searchPlaceholder': 'ዘመቻታት፣ ትካላት ግብረ-ሰናይን ሰባትን ድለዩ',
    'discover.all': 'ኩሎም',
    'discover.fundraisers': 'ዘመቻታት',
    'discover.nonprofits': 'ናይ ግብረ-ሰናይ ትካላት',
    'discover.profiles': 'መግለጺታት',
    'discover.communities': 'ማሕበረሰባት',
    'discover.noResults': 'ዝተደለየ ዘመቻ ኣይተረኽበን።',
    'discover.goal': 'ሸቶ',
    'discover.raised': 'ዝተኣከበ',
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  languages: LANGUAGES,
});

const STORAGE_KEY = 'wegen_app_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && (saved === 'en' || saved === 'am' || saved === 'om' || saved === 'ti')) {
        setLanguageState(saved);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = saved;
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
      }
      window.dispatchEvent(new CustomEvent('wegen_language_change', { detail: newLang }));
    } catch {
      // ignore storage errors
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    const enDict = translations.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
