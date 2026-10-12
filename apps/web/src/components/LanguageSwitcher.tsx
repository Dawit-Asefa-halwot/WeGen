'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SupportedLanguage, LANGUAGES } from '../lib/language-context';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'header' | 'mobile' | 'footer';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  if (variant === 'mobile') {
    return (
      <div className={`lang-mobile-group ${className}`} style={{ width: '100%' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--mute, #5E6B60)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          Language / ቋንቋ
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {LANGUAGES.map((item) => {
            const isActive = item.code === language;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: isActive ? '1.5px solid var(--forest, #1E4A2C)' : '1px solid var(--line, #E3EBDA)',
                  background: isActive ? 'var(--mint, #F0F6E8)' : '#ffffff',
                  color: isActive ? 'var(--forest, #1E4A2C)' : 'var(--ink, #1D2B21)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{item.flag}</span>
                  <span>{item.nativeLabel}</span>
                </span>
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className={`lang-switcher-root ${className}`}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
    >
      <button
        type="button"
        id="lang-switcher-btn"
        aria-label="Select Language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 14px',
          borderRadius: '99px',
          border: isOpen ? '1.5px solid var(--forest, #1E4A2C)' : '1px solid var(--line, #E3EBDA)',
          background: isOpen ? 'var(--mint, #F0F6E8)' : '#ffffff',
          color: 'var(--ink, #1D2B21)',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          whiteSpace: 'nowrap',
          boxShadow: isOpen ? '0 4px 12px rgba(30, 74, 44, 0.08)' : 'none',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'var(--mint, #F0F6E8)';
            e.currentTarget.style.borderColor = 'var(--sage, #CBDDB3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = 'var(--line, #E3EBDA)';
          }
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--forest, #1E4A2C)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>

        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '13px' }}>{currentOption.flag}</span>
          <span style={{ letterSpacing: '-0.01em' }}>{currentOption.nativeLabel}</span>
        </span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="currentColor"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: 'var(--mute, #5E6B60)',
          }}
          aria-hidden="true"
        >
          <path d="M1 3l4 4 4-4z" />
        </svg>
      </button>

      {/* Floating Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            minWidth: '190px',
            background: '#ffffff',
            border: '1px solid var(--line, #E3EBDA)',
            borderRadius: '16px',
            padding: '6px',
            boxShadow: '0 12px 36px rgba(30, 74, 44, 0.14), 0 2px 6px rgba(0, 0, 0, 0.04)',
            zIndex: 100,
            animation: 'fadeInScale 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ padding: '6px 10px 4px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--mute, #5E6B60)' }}>
            Select Language
          </div>
          {LANGUAGES.map((item) => {
            const isActive = item.code === language;
            return (
              <button
                key={item.code}
                role="option"
                aria-selected={isActive}
                type="button"
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'var(--mint, #F0F6E8)' : 'transparent',
                  color: isActive ? 'var(--forest, #1E4A2C)' : 'var(--ink, #1D2B21)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#F9FBF6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <span style={{ fontSize: '16px' }}>{item.flag}</span>
                  <span>
                    <div>{item.nativeLabel}</div>
                    <div style={{ fontSize: '11px', color: 'var(--mute, #5E6B60)', fontWeight: 400 }}>{item.label}</div>
                  </span>
                </span>

                {isActive && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--forest, #1E4A2C)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
