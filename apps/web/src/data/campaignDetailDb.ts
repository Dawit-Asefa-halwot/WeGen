export interface Beneficiary {
  name: string;
  relationship: string;
}

export interface UpdateItem {
  id: string;
  title: string;
  author: string;
  content: string;
}

export interface DonationItem {
  id: number;
  name: string;
  amount: number;
  time: string;
  initial: string;
  isIcon?: boolean;
}

export interface CampaignDetail {
  id: string;
  title: string;
  story: string;
  location: string;
  goalEtb: number;
  raisedEtb: number;
  percentComplete: number;
  supporterCount: number;
  coverImageUrl: string;
  creatorName: string;
  createdAt: string;
  beneficiary: Beneficiary;
  updates: UpdateItem[];
  donations: DonationItem[];
}

export const CAMPAIGN_DB: Record<string, CampaignDetail> = {
  c1: {
    id: 'c1',
    title: 'Support Urgent Cardiac Surgery for 7-Year-Old Chala',
    story: `When I met seven-year-old Chala, he had already spent 30 days in the hospital. At bedtime, he tells his mom, "Let's talk about going home."\n\nChala has survived multiple heart issues and is waiting for a complex surgery in Addis Ababa. His family dreams of finally being home together and eating dinner around their own table.\n\nFor now, home is about two hours away. His dad works full time, mom is at the hospital most days and works part time on the weekends. They are also caring for Chala's three-year-old brother. Between work and hospital trips, they rarely get to be together as a family.\n\nThis fundraiser will help cover the 250,000 ETB needed for his surgery and ongoing care. Every contribution, no matter the size, directly supports Chala.`,
    location: 'Addis Ababa, Ethiopia',
    goalEtb: 250000,
    raisedEtb: 145000,
    percentComplete: 58,
    supporterCount: 38,
    coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Benyam Hussen',
    createdAt: '2026-09-15',
    beneficiary: { name: 'Chala Family', relationship: 'Beneficiary' },
    updates: [{ id: 'u1', title: 'Today', author: 'Benyam Hussen', content: 'Chala has spent more than a month in the hospital now, fighting for his life and waiting for the heart he needs. He continues to amaze us with his strength.' }],
    donations: [
      { id: 1, name: 'Richaud Kirklin', amount: 1000, time: 'Recent donation', initial: 'R' },
      { id: 2, name: 'Parker Shisler', amount: 10000, time: 'Top donation', initial: 'P' },
    ]
  },
  c2: {
    id: 'c2',
    title: 'Emergency Clean Water Well for Somali Region',
    story: `Access to clean drinking water is a fundamental human right. However, for many communities in the Somali Region, this basic necessity remains out of reach. Women and children walk for hours every day to fetch water that is often unsafe to drink.\n\nOur goal is to construct a solar-powered borehole well in Jijiga that will provide sustainable, clean water for over 2,000 residents and their livestock. This well will dramatically reduce waterborne diseases and allow children to attend school instead of spending their days fetching water.\n\nPlease join us in bringing life-saving water to this community.`,
    location: 'Jijiga, Ethiopia',
    goalEtb: 800000,
    raisedEtb: 520000,
    percentComplete: 65,
    supporterCount: 124,
    coverImageUrl: 'https://images.unsplash.com/photo-1541976844346-f18aeac57b06?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Ethiopian Red Cross',
    createdAt: '2026-09-10',
    beneficiary: { name: 'Jijiga Community', relationship: 'Beneficiary' },
    updates: [{ id: 'u1', title: 'Last week', author: 'Ethiopian Red Cross', content: 'We have secured the land and the drilling company is ready to begin once we reach our goal. Thank you for your continued support!' }],
    donations: [
      { id: 1, name: 'Sarah', amount: 5000, time: '1 hr ago', initial: 'S' },
      { id: 2, name: 'Anonymous', amount: 20000, time: 'Top donation', initial: '🤍', isIcon: true },
    ]
  },
  c3: {
    id: 'c3',
    title: 'Rebuilding Classroom Desks & Library for 400 Students',
    story: `Education is the foundation for a better future, but the students at our local primary school in Mekelle are struggling without the basic tools they need. The school's library is empty, and many classrooms lack desks, forcing students to sit on the floor.\n\nWe are raising funds to build 100 new wooden desks and fill the library shelves with textbooks and reading materials. By supporting this campaign, you are investing directly in the future of 400 eager learners.\n\nLet's give these children the learning environment they deserve.`,
    location: 'Mekelle, Ethiopia',
    goalEtb: 180000,
    raisedEtb: 92000,
    percentComplete: 51,
    supporterCount: 47,
    coverImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Abiye Tekle',
    createdAt: '2026-09-20',
    beneficiary: { name: 'Mekelle Primary School', relationship: 'Beneficiary' },
    updates: [{ id: 'u1', title: 'Yesterday', author: 'Abiye Tekle', content: 'We have ordered the first batch of 25 desks from a local carpenter. The students are so excited!' }],
    donations: [
      { id: 1, name: 'Dawit', amount: 1500, time: '5 mins ago', initial: 'D' },
      { id: 2, name: 'Helen', amount: 3000, time: '2 days ago', initial: 'H' },
    ]
  },
  c4: {
    id: 'c4',
    title: 'Heart Surgery for Dawit, Age 6',
    story: `Dawit is a vibrant 6-year-old boy who loves playing football. However, he tires easily and was recently diagnosed with a severe congenital heart defect. \n\nThe doctors have informed us that he urgently needs surgery to live a normal, healthy life. As a family, we have done everything we can to save for this operation, but we still need your help.\n\nPlease consider donating to help Dawit get his heart surgery. Your kindness will give him the chance to grow up and chase his dreams on the football field.`,
    location: 'Addis Ababa, Ethiopia',
    goalEtb: 650000,
    raisedEtb: 535500,
    percentComplete: 82,
    supporterCount: 215,
    coverImageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Hope Ethiopia',
    createdAt: '2026-08-15',
    beneficiary: { name: 'Dawit & Family', relationship: 'Beneficiary' },
    updates: [{ id: 'u1', title: '2 days ago', author: 'Hope Ethiopia', content: 'Dawit is scheduled for his preliminary check-ups next week. We are almost at our goal!' }],
    donations: [
      { id: 1, name: 'Anonymous', amount: 50000, time: 'Top donation', initial: '🤍', isIcon: true },
      { id: 2, name: 'Kebede', amount: 2000, time: '3 hrs ago', initial: 'K' },
    ]
  },
  c5: {
    id: 'c5',
    title: 'Cataract Surgery for W/ro Almaz',
    story: `W/ro Almaz, a beloved grandmother in Bahir Dar, has slowly lost her vision over the past six years due to severe cataracts. She has never seen the faces of her two youngest grandchildren.\n\nA simple 30-minute surgery can restore her sight and give her back her independence. We are raising funds to cover the surgery, post-operative care, and transportation costs.\n\nLet's help W/ro Almaz see the beautiful faces of her family once again.`,
    location: 'Bahir Dar, Ethiopia',
    goalEtb: 250000,
    raisedEtb: 210000,
    percentComplete: 84,
    supporterCount: 486,
    coverImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Kidist M.',
    createdAt: '2026-09-01',
    beneficiary: { name: 'W/ro Almaz', relationship: 'Grandmother' },
    updates: [{ id: 'u1', title: '1 week ago', author: 'Kidist M.', content: 'The hospital has confirmed they can schedule the surgery as soon as we secure the funds. Thank you all!' }],
    donations: [
      { id: 1, name: 'Mekdes', amount: 1000, time: '10 mins ago', initial: 'M' },
    ]
  },
  c6: {
    id: 'c6',
    title: "School Fees for Sara's First Year at University",
    story: `Sara has worked incredibly hard to become the first person in her family to graduate high school with top honors. She has been accepted into Hawassa University to study engineering, but her family cannot afford the registration and living expenses.\n\nWe believe financial hardship should not stand in the way of brilliance. By contributing to this campaign, you are directly paying for Sara's first-year tuition, books, and housing.\n\nHelp Sara break the cycle of poverty and become the engineer she was born to be.`,
    location: 'Hawassa, Ethiopia',
    goalEtb: 120000,
    raisedEtb: 37200,
    percentComplete: 31,
    supporterCount: 312,
    coverImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Joel Adams',
    createdAt: '2026-09-22',
    beneficiary: { name: 'Sara', relationship: 'Student' },
    updates: [{ id: 'u1', title: 'Today', author: 'Joel Adams', content: 'Sara just received her official acceptance letter in the mail!' }],
    donations: [
      { id: 1, name: 'Betty', amount: 500, time: 'Just now', initial: 'B' },
    ]
  },
  c7: {
    id: 'c7',
    title: 'Clean Water for Three Gurage Villages',
    story: `Three remote villages in the Gurage Zone are facing a severe water crisis. The nearest water source is heavily contaminated, leading to frequent illnesses, especially among children.\n\nThe Gurage Development Association is launching a massive initiative to install water filtration systems and drill deep wells to serve over 5,000 people. This infrastructure will change lives for generations.\n\nYour donation will literally bring life-saving water to these communities.`,
    location: 'Wolkite, Ethiopia',
    goalEtb: 900000,
    raisedEtb: 720000,
    percentComplete: 80,
    supporterCount: 890,
    coverImageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Gurage Development Assoc.',
    createdAt: '2026-07-20',
    beneficiary: { name: 'Gurage Villages', relationship: 'Community' },
    updates: [{ id: 'u1', title: '1 month ago', author: 'GDA', content: 'The first well drilling has commenced in village one!' }],
    donations: [
      { id: 1, name: 'Business Owner', amount: 100000, time: 'Top donation', initial: 'B' },
    ]
  },
  c8: {
    id: 'c8',
    title: 'A Wheelchair for Tigist, Age 12',
    story: `Tigist is a sweet 12-year-old girl from Dire Dawa who was born with a condition that affects her mobility. For years, she has relied on her mother to carry her everywhere, which has become increasingly difficult as Tigist grows.\n\nA custom-fitted, durable wheelchair will give Tigist the independence she craves. She will finally be able to attend school regularly and play outside with her friends.\n\nLet's rally together to give Tigist the gift of mobility.`,
    location: 'Dire Dawa, Ethiopia',
    goalEtb: 85000,
    raisedEtb: 6500,
    percentComplete: 8,
    supporterCount: 15,
    coverImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    creatorName: 'Regina Landor',
    createdAt: '2026-10-05',
    beneficiary: { name: 'Tigist', relationship: 'Beneficiary' },
    updates: [{ id: 'u1', title: 'Yesterday', author: 'Regina Landor', content: 'We had a consultation for measuring the custom wheelchair dimensions.' }],
    donations: [
      { id: 1, name: 'Anonymous', amount: 1000, time: '1 hr ago', initial: '🤍', isIcon: true },
    ]
  }
};
