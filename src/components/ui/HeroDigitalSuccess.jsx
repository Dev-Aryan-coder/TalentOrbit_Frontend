import React, { useRef } from 'react';
import { TimelineAnimation } from './TimelineAnimation';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import logoImg from '../../assets/logo.png';

export function HeroDigitalSuccess({
  title = "Transforming Academia & Industry",
  highlightText = "Collaboration",
  description = "TalentOrbit (SIH Problem #26044) empowers Students with AI skill diagnostic assessments, Recruiters with explainable talent scouting, Academicians with research grants & FDPs, and Institutions with real-time NIRF/NAAC placement intelligence.",
  primaryActionText = "Explore Student Portal",
  onPrimaryAction,
  secondaryActionText = "Recruiter ATS & Talent Pool",
  onSecondaryAction,
  stats = [
    { label: "AI Matching Engine", sub: "Deterministic & Weighted" },
    { label: "Verified Skill Genome", sub: "SHA-256 Tamper-Proof" },
    { label: "Skill Deficit Heatmaps", sub: "NIRF Metric 5.2.1 / NAAC" },
    { label: "Faculty Immersion", sub: "AICTE FDPs & Sabbaticals" }
  ]
}) {
  const timelineRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section
      ref={timelineRef}
      className="relative min-h-screen bg-[#050811] text-white overflow-hidden flex flex-col justify-between"
    >
      {/* Interactive Mesh Shader Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing Radial Orbs */}
        <div 
          className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full blur-[140px] opacity-70 animate-pulse"
          style={{ background: 'radial-gradient(circle, #92dbe0 0%, #0b7bff 60%, transparent 80%)' }}
        />
        <div 
          className="absolute top-1/3 -right-32 w-[750px] h-[750px] rounded-full blur-[160px] opacity-60"
          style={{ background: 'radial-gradient(circle, #ff3366 0%, #3865cf 50%, transparent 80%)' }}
        />
        <div 
          className="absolute -bottom-40 left-1/4 w-[850px] h-[650px] rounded-full blur-[180px] opacity-50"
          style={{ background: 'radial-gradient(circle, #1d4ed8 0%, #92dbe0 40%, transparent 70%)' }}
        />
        {/* Cyber Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Top Header with Futuristic Emblem Logo and Pill Navigation */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        {/* Left Section: Futuristic Orbit T Emblem Logo */}
        <TimelineAnimation
          once={true}
          animationNum={1}
          timelineRef={timelineRef}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#92dbe0] to-[#0b7bff] opacity-50 blur-sm group-hover:opacity-100 transition duration-300" />
            <img 
              src={logoImg} 
              alt="TalentOrbit Emblem" 
              className="relative w-11 h-11 object-contain rounded-xl drop-shadow-[0_0_15px_rgba(11,123,255,0.7)]"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xl tracking-tight text-white leading-tight">
              TalentOrbit
            </span>
            <span className="text-[10px] tracking-wider text-[#92dbe0] font-mono uppercase font-semibold">
              SIH Problem #26044
            </span>
          </div>
        </TimelineAnimation>

        {/* Center: Frosted Glass Pill-Shaped Navigation Bar */}
        {!isMobile && (
          <TimelineAnimation
            once={true}
            as="nav"
            animationNum={2}
            timelineRef={timelineRef}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] transition-all duration-300"
          >
            <a 
              href="#how-it-works" 
              className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              How It Works
            </a>
            <a 
              href="#features" 
              className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Features
            </a>
            <a 
              href="#about" 
              className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              About Us
            </a>
            <a 
              href="#contact" 
              className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Contact
            </a>
          </TimelineAnimation>
        )}

        {/* Right Section: Action Button */}
        <TimelineAnimation
          once={true}
          as="button"
          animationNum={3}
          timelineRef={timelineRef}
          onClick={onPrimaryAction}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition cursor-pointer shadow-[0_0_15px_rgba(11,123,255,0.3)] hover:border-white/40"
        >
          <span className="w-2 h-2 rounded-full bg-[#92dbe0] animate-ping" />
          <span>Launch Platform</span>
        </TimelineAnimation>
      </header>

      {/* Center Stage Hero Content */}
      <div className="relative z-10 grow flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto py-12 w-full text-left">
        
        {/* Pill Tag */}
        <TimelineAnimation
          once={true}
          animationNum={4}
          timelineRef={timelineRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs sm:text-sm font-medium text-[#92dbe0] mb-6 w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0b7bff]" />
          <span>Next-Gen Higher Education & Industry Alignment</span>
        </TimelineAnimation>

        {/* Hero Headline with Playfair Display & Instrument Serif + uppercase + tracking-[0.1em] */}
        <TimelineAnimation
          once={true}
          as="h1"
          animationNum={5}
          timelineRef={timelineRef}
          className="font-display-serif uppercase tracking-[0.1em] text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.12] pb-6 font-normal drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        >
          <span className="text-white">{title}</span>{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#92dbe0] via-[#0b7bff] to-[#3865cf] drop-shadow-[0_0_35px_rgba(11,123,255,0.5)] block lg:inline-block">
            {highlightText}
          </span>
        </TimelineAnimation>

        {/* Description */}
        <TimelineAnimation
          once={true}
          as="p"
          animationNum={6}
          timelineRef={timelineRef}
          className="max-w-3xl text-slate-300 text-lg sm:text-xl font-light leading-relaxed mb-10"
        >
          {description}
        </TimelineAnimation>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-5">
          <TimelineAnimation
            once={true}
            as="button"
            animationNum={7}
            timelineRef={timelineRef}
            onClick={onPrimaryAction}
            className="cursor-pointer group relative overflow-hidden bg-gradient-to-r from-[#92dbe0] via-[#0b7bff] to-[#3865cf] text-white px-8 py-4 rounded-full font-semibold text-base flex items-center gap-3 shadow-[0_0_30px_rgba(11,123,255,0.5)] hover:shadow-[0_0_40px_rgba(146,219,224,0.8)] transition-all transform hover:-translate-y-0.5"
          >
            <span>{primaryActionText}</span>
            <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
          </TimelineAnimation>

          <TimelineAnimation
            once={true}
            as="button"
            animationNum={8}
            timelineRef={timelineRef}
            onClick={onSecondaryAction}
            className="cursor-pointer border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md px-8 py-4 rounded-full font-medium text-base text-slate-200 transition hover:border-white/40"
          >
            {secondaryActionText}
          </TimelineAnimation>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-10">
        <TimelineAnimation
          once={true}
          animationNum={9}
          timelineRef={timelineRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          {stats.map((item, idx) => (
            <div key={idx} className="border-l-2 border-[#0b7bff]/60 pl-4 text-left">
              <p className="text-white font-semibold text-sm sm:text-base">{item.label}</p>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{item.sub}</p>
            </div>
          ))}
        </TimelineAnimation>
      </div>
    </section>
  );
}

export default HeroDigitalSuccess;

