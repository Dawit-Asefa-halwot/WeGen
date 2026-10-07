'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { DonationModal } from '../../../components/DonationModal';
import { 
  ShieldCheck, MapPin, Users, Heart, Share2, Calendar, HeartHandshake, 
  Building2, CheckCircle2, AlertCircle, FileText, ArrowRight,
  TrendingUp, Flag, MessageCircle, ChevronLeft, ChevronRight, Link as LinkIcon, Facebook, MessageCircle as MessageCircleIcon, Linkedin
} from 'lucide-react';

const CAMPAIGN_DB: Record<string, any> = {
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

export default function CampaignDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Dynamic campaign data based on slug
  const campaign = CAMPAIGN_DB[slug] || CAMPAIGN_DB['c1'];

  const fmtNum = (n: number) => n.toLocaleString('en-US');

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans">
      <Navbar />

      <main className="max-w-[1040px] mx-auto px-4 sm:px-6 py-8">
        
        {/* Header Title Section */}
        <div className="mb-6">
          <h1 className="font-heading text-[32px] sm:text-[40px] font-bold text-[#1A1A1A] tracking-tight leading-tight">
            {campaign.title}
          </h1>
        </div>

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Media & Story */}
          <div className="flex-1 min-w-0 space-y-8">
            
            {/* Cover Image Carousel Area */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#F5F5F5] group">
              <img
                src={campaign.coverImageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              {/* Carousel Controls (Visual Only) */}
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                <div className="w-4 h-1.5 rounded-full bg-white"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="flex items-center gap-3 py-2 border-b border-[#EBEBEB] pb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                <img src="https://ui-avatars.com/api/?name=Abebe+Bikila&background=random" alt="Avatar" className="w-full h-full" />
              </div>
              <div className="text-[15px] text-[#1A1A1A]">
                <strong>{campaign.creatorName}</strong> is organizing this fundraiser for <strong>{campaign.beneficiary.name}</strong>.
              </div>
            </div>

            {/* Protection Badge & Story */}
            <div className="space-y-6 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E6F4F1] text-[#02845A] rounded-md text-[13px] font-bold">
                <ShieldCheck className="w-4 h-4" /> Donation protected
              </div>

              <div className="text-[#1A1A1A] text-[16px] leading-[1.6] whitespace-pre-line">
                {campaign.story}
              </div>

              <button className="text-[15px] font-bold underline underline-offset-2 hover:text-[#6E6E6E]">
                Read more
              </button>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-b border-[#EBEBEB] pb-8">
                <button 
                  onClick={() => setIsDonateOpen(true)}
                  className="flex-1 py-3 px-4 border border-[#cfcfcf] rounded-full font-semibold text-[15px] hover:border-[#1A1A1A] transition-colors"
                >
                  Donate
                </button>
                <button className="flex-1 py-3 px-4 border border-[#cfcfcf] rounded-full font-semibold text-[15px] hover:border-[#1A1A1A] transition-colors">
                  Share
                </button>
              </div>
            </div>

            {/* Updates Section */}
            <div className="pt-2 border-b border-[#EBEBEB] pb-8">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-heading text-[24px] font-bold">Updates</h2>
                <span className="bg-[#F5F5F5] text-[#1A1A1A] text-xs font-bold px-2 py-0.5 rounded">1</span>
              </div>

              {campaign.updates.map(u => (
                <div key={u.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F5] text-[#6E6E6E] font-bold flex items-center justify-center shrink-0">
                      {u.author[0]}
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#1A1A1A]">{u.title}</div>
                      <div className="text-[13px] text-[#6E6E6E]">{u.author} · {campaign.beneficiary.relationship}</div>
                    </div>
                  </div>
                  <div className="text-[15px] leading-[1.6] text-[#1A1A1A] whitespace-pre-line">
                    {u.content}
                  </div>
                  <button className="text-[15px] font-bold underline underline-offset-2 hover:text-[#6E6E6E]">
                    Read more
                  </button>
                </div>
              ))}
            </div>

            {/* Suggested Nonprofits (Placeholder) */}
            <div className="pt-2 border-b border-[#EBEBEB] pb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-[24px] font-bold">Suggested nonprofits to follow</h2>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full border border-[#cfcfcf] flex items-center justify-center text-[#cfcfcf]"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="w-8 h-8 rounded-full border border-[#cfcfcf] flex items-center justify-center text-[#1A1A1A] hover:bg-[#F5F5F5]"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex gap-4 overflow-hidden">
                {/* Card 1 */}
                <div className="flex-1 border border-[#EBEBEB] rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center relative">
                        <span className="text-[10px]">🌍</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                      </div>
                      <span className="text-[13px] font-bold truncate max-w-[120px]">World Central Kitc...</span>
                    </div>
                    <button className="text-[13px] font-semibold text-[#1A1A1A] flex items-center gap-1"><span className="text-lg leading-none">+</span> Follow</button>
                  </div>
                  <div className="h-32 bg-[#F5F5F5]">
                    <img src="https://images.unsplash.com/photo-1593113511365-021c2725ccdb?w=400&q=80" className="w-full h-full object-cover" alt="org" />
                  </div>
                </div>
                {/* Card 2 */}
                <div className="flex-1 border border-[#EBEBEB] rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center relative">
                        <span className="text-[10px]">🛡️</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
                      </div>
                      <span className="text-[13px] font-bold truncate max-w-[120px]">The Salvation Army</span>
                    </div>
                    <button className="text-[13px] font-semibold text-[#1A1A1A] flex items-center gap-1"><span className="text-lg leading-none">+</span> Follow</button>
                  </div>
                  <div className="h-32 bg-[#F5F5F5]">
                    <img src="https://images.unsplash.com/photo-1593113512304-4b533e4d9eeb?w=400&q=80" className="w-full h-full object-cover" alt="org" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sharing helps more than you think */}
            <div className="pt-2 border-b border-[#EBEBEB] pb-8">
              <h2 className="font-heading text-[24px] font-bold mb-2">Sharing helps more than you think</h2>
              <p className="text-[15px] text-[#1A1A1A] mb-6">
                On average, <strong>each share can inspire {fmtNum(50)} ETB</strong> in donations by helping this fundraiser reach more people.
              </p>
              
              <div className="bg-[#F9F9F9] rounded-3xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <div className="inline-block text-[#02845A] mb-2"><HeartHandshake className="w-6 h-6" /></div>
                    <h3 className="font-bold text-[18px] leading-tight mb-2">A Heart for Chala 💗 Support for His Family</h3>
                    <p className="text-[13px] text-[#6E6E6E] mb-2">Organized for {campaign.beneficiary.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-[#02A95C] flex items-center justify-center text-[10px] font-bold text-[#02A95C]">96%</div>
                      <span className="text-[13px] font-bold bg-[#CCF88E] px-2 py-0.5 rounded">{fmtNum(campaign.raisedEtb)} raised</span>
                      <span className="text-[12px] font-bold text-[#1A1A1A] bg-[#FFD700] px-2 py-0.5 rounded shadow-sm relative -rotate-3 top-1">Donate now!</span>
                    </div>
                  </div>
                  <div className="w-full sm:w-48 aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-slate-200">
                    <img src={campaign.coverImageUrl} className="w-full h-full object-cover" alt="share preview" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#EBEBEB] text-[#1A1A1A]"><LinkIcon className="w-5 h-5" /></button>
                <button className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white"><Facebook className="w-5 h-5 fill-current" /></button>
                <button className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white"><MessageCircleIcon className="w-5 h-5 fill-current" /></button>
                <button className="w-10 h-10 rounded-full bg-[#0084FF] flex items-center justify-center text-white"><MessageCircleIcon className="w-5 h-5 fill-current" /></button>
                <button className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center text-white"><Linkedin className="w-5 h-5 fill-current" /></button>
              </div>
            </div>

            {/* Organizer and beneficiary */}
            <div className="pt-2 border-b border-[#EBEBEB] pb-8">
              <h2 className="font-heading text-[24px] font-bold mb-6">Organizer and beneficiary</h2>
              <div className="flex items-start gap-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                    <img src="https://ui-avatars.com/api/?name=Abebe+Bikila&background=random" alt="Avatar" className="w-full h-full" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#1A1A1A]">{campaign.creatorName}</div>
                    <div className="text-[13px] text-[#6E6E6E]">Organizer</div>
                    <div className="text-[13px] text-[#6E6E6E]">{campaign.location}</div>
                    <button className="mt-3 px-4 py-1.5 border border-[#cfcfcf] rounded-full text-[13px] font-semibold hover:border-[#1A1A1A]">Message</button>
                  </div>
                </div>
                <div className="hidden sm:block text-[#cfcfcf] pt-2"><ArrowRight className="w-5 h-5" /></div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#6E6E6E] font-bold shrink-0">
                    C
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#1A1A1A]">{campaign.beneficiary.name}</div>
                    <div className="text-[13px] text-[#6E6E6E]">{campaign.beneficiary.relationship}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Meta: Created Date & Report */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[13px] text-[#6E6E6E]">
              <div className="flex items-center gap-4">
                <span>Created {campaign.createdAt}</span>
                <span>•</span>
                <span>Medical</span>
              </div>
              <button className="flex items-center gap-1 hover:underline underline-offset-2">
                <AlertCircle className="w-4 h-4" /> Report fundraiser
              </button>
            </div>

          </div>

          {/* Right Column: Sticky Support Card */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#EBEBEB] p-6 sticky top-24">
              
              {/* Progress & Amount */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#EBEBEB]"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#02A95C]"
                      strokeDasharray={`${campaign.percentComplete}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#1A1A1A]">
                    {campaign.percentComplete}%
                  </div>
                </div>
                <div>
                  <div className="text-[20px] leading-tight text-[#1A1A1A]">
                    <strong>{fmtNum(campaign.raisedEtb)} ETB raised</strong> of
                  </div>
                  <div className="text-[15px] text-[#6E6E6E]">
                    <span className="underline decoration-[#cfcfcf] underline-offset-4">{fmtNum(campaign.goalEtb)} ETB</span> goal
                  </div>
                  <div className="text-[13px] text-[#6E6E6E] mt-0.5">
                    {campaign.supporterCount} donations
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="w-full btn-lime py-3.5 rounded-xl font-bold text-[16px] shadow-sm hover:scale-[1.02] transition-transform"
                >
                  Donate now
                </button>
                <button
                  className="w-full btn-dark py-3.5 rounded-xl font-bold text-[16px] hover:scale-[1.02] transition-transform"
                >
                  Share
                </button>
              </div>

              {/* Recent Donations Trend */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#9333EA]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-[14px] font-bold text-[#9333EA]">
                  395 recent donations
                </div>
              </div>

              {/* Donations List */}
              <div className="space-y-5 mb-6">
                {campaign.donations.map((d, i) => (
                  <div key={d.id} className={`flex items-start gap-3 ${i !== 0 ? 'pt-4 border-t border-[#F5F5F5]' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[13px] font-bold text-[#6E6E6E] shrink-0">
                      {d.isIcon ? <Heart className="w-4 h-4" /> : d.initial}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#1A1A1A]">{d.name}</div>
                      <div className="text-[13px] text-[#6E6E6E]">
                        <span className="font-bold">{fmtNum(d.amount)} ETB</span> · {d.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center gap-3">
                <button className="flex-1 py-2.5 border border-[#cfcfcf] rounded-full text-[14px] font-semibold hover:border-[#1A1A1A] transition-colors">
                  See all
                </button>
                <button className="flex-1 py-2.5 border border-[#cfcfcf] rounded-full text-[14px] font-semibold hover:border-[#1A1A1A] transition-colors flex items-center justify-center gap-1">
                  <span>☆</span> See top
                </button>
              </div>

            </div>
          </div>

        </div>

      </main>

      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        campaignType="PERSONAL"
      />

      <Footer />
    </div>
  );
}
