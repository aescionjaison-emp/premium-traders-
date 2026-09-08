import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface SectionHeadingProps {
  smallLabel?: string;
  title: string;
  subtitle?: string; // Optional, keep hidden or minimal
  linkText?: string;
  linkUrl?: string;
  count?: number;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  smallLabel,
  title,
  linkText,
  linkUrl,
  count,
  className = '',
}) => {
  return (
    <div className={`flex items-end justify-between pb-3 mb-6 border-b border-showroom-border/80 ${className}`}>
      <div>
        {smallLabel && (
          <span className="text-[9px] font-bold uppercase tracking-widest text-showroom-bronze block mb-0.5">
            {smallLabel}
          </span>
        )}
        <div className="flex items-baseline gap-3">
          <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
            {title}
          </h2>
          {count !== undefined && (
            <span className="text-xs font-mono font-bold text-showroom-muted">
              ({count.toString().padStart(2, '0')})
            </span>
          )}
        </div>
      </div>

      {linkText && linkUrl && (
        <Link
          to={linkUrl}
          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-architectural text-showroom-charcoal hover:text-showroom-bronze transition-colors shrink-0"
        >
          <span>{linkText}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
};
