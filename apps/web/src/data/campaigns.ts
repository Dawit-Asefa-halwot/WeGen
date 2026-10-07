export interface Campaign {
  id: string;
  title: string;
  city: string;
  goalEtb: number;
  raisedEtb: number;
  percent: number;
  daysLive: number;
  type: "person" | "organization";
  photoKey: string;
  organizationName?: string;
}

export const CAMPAIGN_DATA: Campaign[] = [
  {
    id: "c1",
    title: "Support Urgent Cardiac Surgery for 7-Year-Old Chala",
    city: "Addis Ababa",
    goalEtb: 250000,
    raisedEtb: 145000,
    percent: 58,
    daysLive: 22,
    type: "person",
    photoKey: "chala",
  },
  {
    id: "c2",
    title: "Emergency Clean Water Well for Somali Region",
    city: "Jijiga",
    goalEtb: 800000,
    raisedEtb: 520000,
    percent: 65,
    daysLive: 27,
    type: "organization",
    photoKey: "water",
    organizationName: "Ethiopian Red Cross",
  },
  {
    id: "c3",
    title: "Rebuilding Classroom Desks & Library for 400 Students",
    city: "Mekelle",
    goalEtb: 180000,
    raisedEtb: 92000,
    percent: 51,
    daysLive: 17,
    type: "person",
    photoKey: "school",
  },
  {
    id: "c4",
    title: "Heart Surgery for Dawit, Age 6",
    city: "Addis Ababa",
    goalEtb: 650000,
    raisedEtb: 535500,
    percent: 82,
    daysLive: 53,
    type: "organization",
    photoKey: "dawit",
    organizationName: "Hope Ethiopia",
  },
  {
    id: "c5",
    title: "Cataract Surgery for W/ro Almaz",
    city: "Bahir Dar",
    goalEtb: 250000,
    raisedEtb: 210000,
    percent: 84,
    daysLive: 36,
    type: "person",
    photoKey: "almaz",
  },
  {
    id: "c6",
    title: "School Fees for Sara's First Year at University",
    city: "Hawassa",
    goalEtb: 120000,
    raisedEtb: 37200,
    percent: 31,
    daysLive: 15,
    type: "person",
    photoKey: "sara",
  },
  {
    id: "c7",
    title: "Clean Water for Three Gurage Villages",
    city: "Wolkite",
    goalEtb: 900000,
    raisedEtb: 720000,
    percent: 80,
    daysLive: 79,
    type: "organization",
    photoKey: "gurage",
    organizationName: "Gurage Development Assoc.",
  },
  {
    id: "c8",
    title: "A Wheelchair for Tigist, Age 12",
    city: "Dire Dawa",
    goalEtb: 85000,
    raisedEtb: 6500,
    percent: 8,
    daysLive: 2,
    type: "person",
    photoKey: "tigist",
  },
];

export const HERO_SLIDES = [
  {
    id: 1,
    amharic: "አብረን",
    english: "Fundraising for Ethiopia you can trust.",
    lead: "Share your story with a video, documents and a few words. We verify every campaign, so donors give with confidence and help reaches the right person.",
    buttons: [
      { text: "Start a campaign", type: "dark", href: "/dashboard/campaigns/new" },
      { text: "Browse campaigns", type: "outline", href: "#campaigns" },
    ],
    card: {
      photoKey: "dawit",
      title: "Heart Surgery for Dawit, Age 6",
      sub: "Addis Ababa · Referred by Hope Ethiopia",
      goalEtb: 650000,
      raisedEtb: 535500,
      percent: 82,
    },
  },
  {
    id: 2,
    amharic: "ተስፋ",
    english: "Help her see her grandchildren again.",
    lead: "A verified campaign, reviewed by our team. Every gift brings her closer to her surgery.",
    buttons: [
      { text: "Donate to this campaign", type: "dark", href: "/campaign/c5" },
      { text: "Browse campaigns", type: "outline", href: "#campaigns" },
    ],
    card: {
      photoKey: "almaz",
      title: "Cataract Surgery for W/ro Almaz",
      sub: "Bahir Dar · Verified",
      goalEtb: 250000,
      raisedEtb: 210000,
      percent: 84,
    },
  },
  {
    id: 3,
    amharic: "ትምህርት",
    english: "Be the reason she walks through the university gates.",
    lead: "A verified campaign, reviewed by our team. Help cover her first year of university.",
    buttons: [
      { text: "Donate to this campaign", type: "dark", href: "/campaign/c6" },
      { text: "Browse campaigns", type: "outline", href: "#campaigns" },
    ],
    card: {
      photoKey: "sara",
      title: "School Fees for Sara",
      sub: "Hawassa · Verified",
      goalEtb: 120000,
      raisedEtb: 37200,
      percent: 31,
    },
  },
];

export const STORIES = [
  {
    id: 1,
    label: "Heart surgery · Addis Ababa",
    headline: "Home from surgery and back to playing with his brothers.",
    number: 650000,
    detail: "by 1,204 donors in 38 days",
    buttonText: "Help someone like Dawit",
    photoChip: "Surgery completed",
    photoKey: "dawit-after",
    photoUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    label: "Cataract surgery · Bahir Dar",
    headline: "Seeing her grandchildren's faces again after six years.",
    number: 250000,
    detail: "by 486 donors in 21 days",
    buttonText: "Help someone like Almaz",
    photoChip: "Sight restored",
    photoKey: "almaz-after",
    photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    label: "University fees · Hawassa",
    headline: "The first in her family to walk through the university gates.",
    number: 120000,
    detail: "by 312 donors in 17 days",
    buttonText: "Help someone like Sara",
    photoChip: "Enrolled this fall",
    photoKey: "sara-after",
    photoUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
  },
];

/**
 * Unified photo map — all pages share the same image URLs.
 */
export const PHOTOS: Record<string, string> = {
  chala:         "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
  water:         "https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=800&auto=format&fit=crop&q=80",
  school:        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
  dawit:         "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
  almaz:         "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80",
  sara:          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
  gurage:        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
  tigist:        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
  "dawit-after": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
  "almaz-after": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80",
  "sara-after":  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
};
