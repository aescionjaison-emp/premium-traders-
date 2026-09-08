import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Compass, Cpu, Truck, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface WorkScope {
  id: string;
  category: string;
  title: string;
  scope: string;
  image: string;
  link: string;
  icon: React.ElementType;
}

const workScopes: WorkScope[] = [
  {
    id: '01',
    category: 'SURFACES & QUARRIES',
    title: 'Exotic Stone & Slab Sourcing',
    scope: 'Gangsaw Granite • 1200×2400 Porcelain',
    image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=800&q=85',
    link: '/granite',
    icon: Layers,
  },
  {
    id: '02',
    category: 'BESPOKE JOINERY',
    title: 'Architectural Wood & Teak Doors',
    scope: 'Burma Teak Pivots • Acoustic Slat Panelling',
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=85',
    link: '/wood',
    icon: Compass,
  },
  {
    id: '03',
    category: 'SWITCHGEAR & LIGHTING',
    title: 'Luxury Electrical Systems',
    scope: 'Solid Brass Plates • 48V Magnetic Tracks',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=85',
    link: '/electrical',
    icon: Cpu,
  },
  {
    id: '04',
    category: 'LOGISTICS & SUPPLY',
    title: 'Project Specification & Delivery',
    scope: 'Sample Boxes • Site Calibrated Dispatch',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=85',
    link: '/contact',
    icon: Truck,
  },
];

const processSteps = [
  { num: '01', label: 'Material Selection', sub: 'Showroom physical samples & slab inspection' },
  { num: '02', label: 'Custom Specification', sub: 'Calibrated dimensions, edge profiles & finishes' },
  { num: '03', label: 'Project Dispatch', sub: 'Safe crate packaging & scheduled site delivery' },
];

export const OverallWorkShowcase: React.FC = () => {
  return (
    <section className="py-14 bg-[#141312] text-[#FAF9F5] border-t border-white/10 relative overflow-hidden">
      {/* Subtle Background Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-showroom-bronze/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Minimal Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-showroom-gold uppercase block mb-1">
                OVERALL SCOPE & CAPABILITIES
              </span>
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white">
                WHAT WE DO
              </h2>
            </div>
            <p className="text-[11px] font-mono text-white/50 uppercase tracking-widest mt-2 sm:mt-0">
              [ 4 Core Architectural Divisions ]
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Scope Cards (Visual, Low Text, Small Product/Work Names) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {workScopes.map((scope, idx) => {
            const Icon = scope.icon;
            return (
              <ScrollReveal key={scope.id} direction="up" delay={idx * 0.08}>
                <Link
                  to={scope.link}
                  className="group relative flex flex-col justify-between bg-[#1B1A18] border border-white/10 hover:border-showroom-bronze p-4 transition-all duration-300 h-full rounded-[5px]"
                >
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-showroom-gold bg-black/50 px-2 py-0.5 border border-white/10 rounded-[5px]">
                      {scope.id}
                    </span>
                    <div className="p-1.5 bg-white/5 group-hover:bg-showroom-bronze text-white transition-colors rounded-[5px]">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Visual Image Preview */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40 mb-3 rounded-[5px]">
                    <img
                      src={scope.image}
                      alt={scope.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[5px]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[5px]" />
                    <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-showroom-gold font-bold tracking-wider">
                      {scope.category}
                    </span>
                  </div>

                  {/* Bottom Text (Small, Refined, Minimal) */}
                  <div className="mt-auto">
                    {/* Small Product / Scope Name */}
                    <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white group-hover:text-showroom-gold transition-colors leading-snug">
                      {scope.title}
                    </h3>
                    {/* Minimal Scope Detail */}
                    <p className="text-[10px] font-mono text-white/60 tracking-tight mt-1 truncate">
                      {scope.scope}
                    </p>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-showroom-bronze group-hover:text-white transition-colors">
                      <span>View Division</span>
                      <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Ultra-Minimal 3-Step Execution Workflow */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="mt-8 pt-6 border-t border-white/10 bg-[#171615] p-4 sm:p-5 rounded-[5px]">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-showroom-gold" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-white/80 uppercase">
                SHOWROOM TO SITE WORKFLOW
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
              {processSteps.map((step) => (
                <div key={step.num} className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-showroom-gold shrink-0">
                    [{step.num}]
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                      {step.label}
                    </h4>
                    <p className="text-[10px] text-white/50 tracking-tight mt-0.5">
                      {step.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
