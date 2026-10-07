'use client';

import React, { useState } from 'react';
import { 
  X, Copy, Check, Mail, QrCode, Code, Radio, Download, 
  Share2, ExternalLink, Image as ImageIcon
} from 'lucide-react';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle?: string;
  campaignSlug?: string;
  campaignUrl?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  campaignTitle = 'Help Dawit get urgent heart surgery',
  campaignSlug = 'c1',
  campaignUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showWidgetCode, setShowWidgetCode] = useState(false);

  if (!isOpen) return null;

  const currentUrl = campaignUrl || (typeof window !== 'undefined' 
    ? `${window.location.origin}/campaign/${campaignSlug}`
    : `https://wegen.et/campaign/${campaignSlug}`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareText = `Please consider supporting or sharing this fundraiser: "${campaignTitle}" on WeGen`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${currentUrl}`)}`,
    messenger: `fb-messenger://share/?link=${encodeURIComponent(currentUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(campaignTitle)}&body=${encodeURIComponent(`${shareText}\n\n${currentUrl}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
  };

  const openShare = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'width=600,height=500,scrollbars=yes');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[560px] bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 shadow-2xl my-auto text-[#1A1A1A] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4">
          <h2 className="font-heading font-extrabold text-[22px] sm:text-[24px] text-[#1A1A1A]">
            Quick share
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F5F5F5] hover:bg-[#EBEBEB] text-[#1A1A1A] flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Link Input Section */}
        <div className="border border-[#D1D5DB] rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 bg-white focus-within:border-[#1A1A1A] transition-colors">
          <div className="min-w-0 flex-1 px-1">
            <span className="block text-[11px] font-semibold text-[#6E6E6E] uppercase tracking-wider">
              Your unique link
            </span>
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full text-sm sm:text-[15px] font-medium text-[#1A1A1A] bg-transparent outline-none truncate"
            />
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
              copied 
                ? 'bg-[#E8F8F0] text-[#02A95C] border border-[#02A95C]/20'
                : 'bg-[#F5F5F5] hover:bg-[#EBEBEB] text-[#1A1A1A]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy link</span>
              </>
            )}
          </button>
        </div>

        {/* Main Sharing Options */}
        <div className="pt-6">
          <h3 className="font-heading font-bold text-[17px] sm:text-[19px] text-[#1A1A1A]">
            Reach more donors by sharing
          </h3>
          <p className="text-xs sm:text-[13.5px] text-[#6E6E6E] mt-1 mb-5 leading-relaxed">
            We've written tailored messages and auto-generated posters based on the fundraiser story for you to share
          </p>

          {/* Social Channels 2-column Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            
            {/* Facebook */}
            <button
              type="button"
              onClick={() => openShare(shareLinks.facebook)}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A]">
                Facebook
              </span>
            </button>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={() => openShare(shareLinks.whatsapp)}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              </div>
              <span className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A]">
                WhatsApp
              </span>
            </button>

            {/* Messenger */}
            <button
              type="button"
              onClick={() => openShare(shareLinks.facebook)}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#006AFF] via-[#A033FF] to-[#FF5280] text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.084.3 2.235.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.056-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.89-3.26-6.56 6.963z"/>
                </svg>
              </div>
              <span className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A]">
                Messenger
              </span>
            </button>

            {/* Story with NEW! badge */}
            <button
              type="button"
              onClick={() => {
                handleCopyLink();
                alert('Fundraiser link copied! Ready to paste into your Instagram Story link sticker.');
              }}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A]">
                  Story
                </span>
                <span className="bg-[#CCF88E] text-[#1A1A1A] font-extrabold text-[9px] px-1.5 py-0.5 rounded tracking-wide">
                  NEW!
                </span>
              </div>
            </button>

            {/* Email */}
            <button
              type="button"
              onClick={() => openShare(shareLinks.email)}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] text-[#1A1A1A] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                <Mail className="w-5 h-5 text-[#4B5563]" />
              </div>
              <span className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A]">
                Email
              </span>
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              onClick={() => openShare(shareLinks.linkedin)}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.738-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <span className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A]">
                LinkedIn
              </span>
            </button>

            {/* X (Twitter) */}
            <button
              type="button"
              onClick={() => openShare(shareLinks.x)}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="font-extrabold text-sm">𝕏</span>
              </div>
              <span className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A]">
                X
              </span>
            </button>

            {/* QR Code */}
            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] text-[#1A1A1A] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                <QrCode className="w-5 h-5 text-[#4B5563]" />
              </div>
              <span className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A]">
                QR code
              </span>
            </button>

            {/* Website widget */}
            <button
              type="button"
              onClick={() => setShowWidgetCode(!showWidgetCode)}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] text-[#1A1A1A] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                <Code className="w-5 h-5 text-[#4B5563]" />
              </div>
              <span className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A]">
                Website widget
              </span>
            </button>

            {/* Events & streaming */}
            <button
              type="button"
              onClick={() => {
                handleCopyLink();
                alert('Streaming overlay & event link copied to clipboard!');
              }}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl hover:bg-[#F5F5F5] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-[#F5F5F5] text-[#1A1A1A] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                <Radio className="w-5 h-5 text-[#4B5563]" />
              </div>
              <span className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A] truncate">
                Events & streaming
              </span>
            </button>

          </div>
        </div>

        {/* QR Code Expandable View */}
        {showQr && (
          <div className="mt-4 p-5 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] text-center animate-fade-in">
            <h4 className="font-heading font-bold text-sm mb-3">Scan to donate on WeGen</h4>
            <div className="w-44 h-44 mx-auto bg-white p-3 rounded-xl border border-[#E5E7EB] shadow-xs flex items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`} 
                alt="Campaign QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-[#6E6E6E] mt-3">Point phone camera to open fundraiser</p>
          </div>
        )}

        {/* Website Widget Expandable View */}
        {showWidgetCode && (
          <div className="mt-4 p-4 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] animate-fade-in">
            <h4 className="font-heading font-bold text-xs mb-2">Embed button HTML</h4>
            <textarea
              readOnly
              rows={2}
              value={`<iframe src="${currentUrl}/widget" width="300" height="420" frameborder="0"></iframe>`}
              className="w-full text-xs font-mono p-2.5 bg-white border border-[#D1D5DB] rounded-xl outline-none"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`<iframe src="${currentUrl}/widget" width="300" height="420" frameborder="0"></iframe>`);
                alert('Widget code copied!');
              }}
              className="mt-2 text-xs font-bold text-[#02A95C] hover:underline"
            >
              Copy Embed Code
            </button>
          </div>
        )}

        {/* Shareable Graphics Yellow Banner Card (Matches exact screenshot) */}
        <div className="mt-6 bg-[#FEF9C3] border border-[#FDE68A] rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF08A] flex items-center justify-center text-[#854D0E] shrink-0">
              <ImageIcon className="w-5 h-5 text-[#854D0E]" />
            </div>
            <div>
              <div className="font-bold text-[14px] sm:text-[15px] text-[#1A1A1A]">
                Shareable graphics
              </div>
              <div className="text-xs text-[#713F12] mt-0.5 leading-snug">
                Download videos to use for posting on social media
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              // Trigger graphic download demo
              const link = document.createElement('a');
              link.href = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200';
              link.download = `wegen-share-${campaignSlug}.jpg`;
              link.target = '_blank';
              link.click();
            }}
            className="w-full sm:w-auto bg-white hover:bg-[#FAFAFA] text-[#1A1A1A] border border-[#1A1A1A] font-bold text-xs sm:text-[13px] py-2 px-5 rounded-full flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>

      </div>
    </div>
  );
};
