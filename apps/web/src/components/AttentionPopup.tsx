'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CAMPAIGN_DB } from '../data/campaignDetailDb';

const POPUP_DELAY_MS = 3000;
const SESSION_KEY = 'wegen_attention_popup_shown';

export default function AttentionPopup() {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [closing, setClosing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const campaigns = Object.values(CAMPAIGN_DB);
  const urgentCount = campaigns.filter(
    (c) => c.percentComplete < 50
  ).length;

  const topUrgent = campaigns
    .slice()
    .sort((a, b) => a.percentComplete - b.percentComplete)[0];

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) return;

    timerRef.current = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimIn(true));
      });
    }, POPUP_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(SESSION_KEY, '1');
      }
    }, 380);
  };

  if (!visible) return null;

  const pct = topUrgent.percentComplete;
  const progressColor =
    pct < 20 ? '#EF4444' : pct < 50 ? '#F97316' : '#16A34A';

  const cardStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    zIndex: 9999,
    width: '360px',
    maxWidth: 'calc(100vw - 32px)',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.99) 0%, rgba(248,248,255,0.99) 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(110,110,110,0.12)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)',
    padding: '0',
    overflow: 'hidden',
    opacity: animIn && !closing ? 1 : 0,
    transform: animIn && !closing ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.94)',
    transition: 'opacity 0.42s cubic-bezier(0.34,1.56,0.64,1), transform 0.42s cubic-bezier(0.34,1.56,0.64,1)',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(0,0,0,0.30)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: animIn && !closing ? 1 : 0,
          transition: 'opacity 0.38s ease',
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div role="dialog" aria-modal="true" aria-label="Campaigns needing your attention" style={cardStyle}>
        {/* Top gradient accent */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #7C3AED 0%, #EC4899 50%, #F97316 100%)',
        }} />

        <div style={{ padding: '20px 22px 22px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              flexShrink: 0,
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
              animation: 'wgBellWiggle 2.4s ease-in-out infinite 1.5s',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7C3AED', marginBottom: '3px' }}>
                This Week
              </p>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#111827', lineHeight: 1.3 }}>
                {urgentCount} campaign{urgentCount !== 1 ? 's' : ''} need{urgentCount === 1 ? 's' : ''} your attention
              </h2>
            </div>

            <button
              onClick={dismiss}
              aria-label="Close"
              style={{
                flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
                border: 'none', background: '#F3F4F6', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6B7280', padding: 0, transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#E5E7EB'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F3F4F6'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Featured campaign preview */}
          <div style={{
            background: 'linear-gradient(135deg, #F8F7FF 0%, #FDF2F8 100%)',
            border: '1px solid rgba(124,58,237,0.12)',
            borderRadius: '16px',
            padding: '14px',
            marginBottom: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(124,58,237,0.07)', pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{
                flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px',
                background: `${progressColor}18`, border: `1.5px solid ${progressColor}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
              }}>
                {pct < 20 ? '🚨' : pct < 50 ? '⚡' : '💚'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0, fontSize: '13px', fontWeight: 700, color: '#111827',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3,
                }}>
                  {topUrgent.title}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#6B7280' }}>
                  {topUrgent.location}
                </p>
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>{pct}% funded</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: progressColor }}>
                  ETB {topUrgent.raisedEtb.toLocaleString()} raised
                </span>
              </div>
              <div style={{ height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${progressColor} 0%, ${progressColor}BB 100%)`,
                  borderRadius: '100px',
                  boxShadow: `0 0 8px ${progressColor}55`,
                }} />
              </div>
            </div>
          </div>

          {/* Body text */}
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>
            These campaigns are at risk of missing their goals this week. A small donation can change everything.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/discover"
              onClick={() => { if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(SESSION_KEY, '1'); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '11px 16px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                color: 'white', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(124,58,237,0.38)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 7px 20px rgba(124,58,237,0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 14px rgba(124,58,237,0.38)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              View Campaigns
            </Link>

            <button
              onClick={dismiss}
              style={{
                padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #E5E7EB',
                background: 'white', color: '#6B7280', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
            >
              Maybe later
            </button>
          </div>
        </div>

        <style>{`
          @keyframes wgBellWiggle {
            0%, 80%, 100% { transform: rotate(0deg); }
            85%            { transform: rotate(-16deg); }
            90%            { transform: rotate(13deg); }
            95%            { transform: rotate(-8deg); }
            97%            { transform: rotate(5deg); }
          }
        `}</style>
      </div>
    </>
  );
}
