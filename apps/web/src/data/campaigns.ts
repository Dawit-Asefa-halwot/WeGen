export interface Campaign {
  id: string;
  title: string;
  city: string;
  goalEtb: number;
  raisedEtb: number;
  percent: number;
  daysLive: number;
  type: 'person' | 'organization';
  photoKey: string;
  organizationName?: string;
}

export const CAMPAIGN_DATA: Campaign[] = [
  {
    id: 'c1',
    title: 'Cataract surgery for W/ro Almaz',
    city: 'Bahir Dar',
    goalEtb: 250000,
    raisedEtb: 210000,
    percent: 84,
    daysLive: 21,
    type: 'person',
    photoKey: 'almaz',
  },
  {
    id: 'c2',
    title: "School fees for Sara's first year at university",
    city: 'Hawassa',
    goalEtb: 120000,
    raisedEtb: 37200,
    percent: 31,
    daysLive: 17,
    type: 'person',
    photoKey: 'sara',
  },
  {
    id: 'c3',
    title: 'Clean water for three Gurage villages',
    city: 'Wolkite, Gurage Zone',
    goalEtb: 900000,
    raisedEtb: 720000,
    percent: 80,
    daysLive: 45,
    type: 'organization',
    photoKey: 'water',
    organizationName: 'Gurage Development Assoc.',
  },
  {
    id: 'c4',
    title: 'Heart surgery for Dawit, age 6',
    city: 'Addis Ababa',
    goalEtb: 650000,
    raisedEtb: 402000,
    percent: 62,
    daysLive: 30,
    type: 'person',
    photoKey: 'dawit',
  },
  {
    id: 'c5',
    title: 'A wheelchair for Tigist, age 12',
    city: 'Dire Dawa',
    goalEtb: 85000,
    raisedEtb: 6500,
    percent: 8,
    daysLive: 3,
    type: 'person',
    photoKey: 'tigist',
  },
  {
    id: 'c6',
    title: 'Textbooks for 200 students at Hope School',
    city: 'Mekelle',
    goalEtb: 160000,
    raisedEtb: 14000,
    percent: 9,
    daysLive: 5,
    type: 'organization',
    photoKey: 'school',
    organizationName: 'Hope Ethiopia',
  },
  {
    id: 'c7',
    title: 'Dialysis treatment for Ato Abebe',
    city: 'Gondar',
    goalEtb: 200000,
    raisedEtb: 38000,
    percent: 19,
    daysLive: 26,
    type: 'person',
    photoKey: 'abebe',
  },
  {
    id: 'c8',
    title: "New roof for a children's home",
    city: 'Adama',
    goalEtb: 240000,
    raisedEtb: 190000,
    percent: 79,
    daysLive: 33,
    type: 'organization',
    photoKey: 'roof',
    organizationName: 'Adama Children Home',
  },
  {
    id: 'c9',
    title: 'A prosthetic leg for Biruk',
    city: 'Jimma',
    goalEtb: 110000,
    raisedEtb: 42000,
    percent: 38,
    daysLive: 24,
    type: 'person',
    photoKey: 'biruk',
  },
];

export const HERO_SLIDES = [
  {
    id: 1,
    amharic: 'አብረን',
    english: 'Fundraising for Ethiopia you can trust.',
    lead: 'Share your story with a video, documents and a few words. We verify every campaign, so donors give with confidence and help reaches the right person.',
    buttons: [
      { text: 'Start a campaign', type: 'dark', href: '/dashboard/campaigns/new' },
      { text: 'Browse campaigns', type: 'outline', href: '#campaigns' },
    ],
    card: {
      photoKey: 'dawit',
      title: 'Heart surgery for Dawit, age 6',
      sub: 'Addis Ababa · Referred by Hope Ethiopia',
      goalEtb: 650000,
      raisedEtb: 402000,
      percent: 62,
    },
  },
  {
    id: 2,
    amharic: 'ተስፋ',
    english: 'Help her see her grandchildren again.',
    lead: 'A verified campaign, reviewed by our team. Every gift brings her closer to her surgery.',
    buttons: [
      { text: 'Donate to this campaign', type: 'dark', href: '/campaign/cataract-surgery-almaz' },
      { text: 'Browse campaigns', type: 'outline', href: '#campaigns' },
    ],
    card: {
      photoKey: 'almaz',
      title: 'Cataract surgery for W/ro Almaz',
      sub: 'Bahir Dar · Verified',
      goalEtb: 250000,
      raisedEtb: 210000,
      percent: 84,
    },
  },
  {
    id: 3,
    amharic: 'ትምህርት',
    english: 'Be the reason she walks through the university gates.',
    lead: 'A verified campaign, reviewed by our team. Help cover her first year of university.',
    buttons: [
      { text: 'Donate to this campaign', type: 'dark', href: '/campaign/school-fees-sara' },
      { text: 'Browse campaigns', type: 'outline', href: '#campaigns' },
    ],
    card: {
      photoKey: 'sara',
      title: 'School fees for Sara',
      sub: 'Hawassa · Verified',
      goalEtb: 120000,
      raisedEtb: 37200,
      percent: 31,
    },
  },
];

export const STORIES = [
  {
    id: 1,
    label: 'Heart surgery · Addis Ababa',
    headline: 'Home from surgery and back to playing with his brothers.',
    number: 650000,
    detail: 'by 1,204 donors in 38 days',
    buttonText: 'Help someone like Dawit',
    photoChip: 'Surgery completed',
    photoKey: 'dawit-after',
    photoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    label: 'Cataract surgery · Bahir Dar',
    headline: "Seeing her grandchildren's faces again after six years.",
    number: 250000,
    detail: 'by 486 donors in 21 days',
    buttonText: 'Help someone like Almaz',
    photoChip: 'Sight restored',
    photoKey: 'almaz-after',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    label: 'University fees · Hawassa',
    headline: 'The first in her family to walk through the university gates.',
    number: 120000,
    detail: 'by 312 donors in 17 days',
    buttonText: 'Help someone like Sara',
    photoChip: 'Enrolled this fall',
    photoKey: 'sara-after',
    photoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
  },
];

/**
 * Photos object containing fallback paths or SVG placeholders.
 */
export const PHOTOS: Record<string, string> = {
  dawit: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
  almaz: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
  sara: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
  water: 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=800&auto=format&fit=crop&q=80',
  'dawit-after': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
  'almaz-after': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80',
  'sara-after': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
};
