import React, { useRef } from 'react';
import { TimelineAnimation } from './TimelineAnimation';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const HeroDigitalSuccess = ({
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
}) => {
  const timelineRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section
      ref={timelineRef}
      className="relative min-h-screen bg-[#050811] text-white overflow-hidden flex flex-col justify-between"
    >
      {/* Interactive Mesh Shader Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing Radial Orb 1 */}
        <div 
          className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[140px] opacity-70 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #92dbe0 0%, #0b7bff 60%, transparent 80%)'
          }}
        />
        {/* Glowing Radial Orb 2 */}
        <div 
          className="absolute top-1/3 -right-32 w-[700px] h-[700px] rounded-full blur-[160px] opacity-60"
          style={{
            background: 'radial-gradient(circle, #3865cf 0%, #0b7bff 50%, transparent 80%)'
          }}
        />
        {/* Glowing Radial Orb 3 */}
        <div 
          className="absolute -bottom-40 left-1/4 w-[800px] h-[600px] rounded-full blur-[180px] opacity-50"
          style={{
            background: 'radial-gradient(circle, #1d4ed8 0%, #92dbe0 40%, transparent 70%)'
          }}
        />
        {/* Subtle Cyber Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Top Navigation Header */}
      <header className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6 backdrop-blur-md border-b border-white/10 bg-black/20">
        <TimelineAnimation
          once={true}
          animationNum={1}
          timelineRef={timelineRef}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92dbe0] via-[#0b7bff] to-[#3865cf] flex items-center justify-center font-extrabold text-white text-base shadow-[0_0_20px_rgba(11,123,255,0.6)]">
            TO
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white">
              TalentOrbit
            </span>
            <span className="text-[10px] tracking-widest text-[#92dbe0] font-mono uppercase font-semibold">
              SIH Problem #26044
            </span>
          </div>
        </TimelineAnimation>

        {!isMobile && (
          <TimelineAnimation
            once={true}
            as="nav"
            animationNum={2}
            timelineRef={timelineRef}
            className="flex items-center gap-8 text-sm font-medium text-slate-300"
          >
            <a href="#how-it-works" className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(146,219,224,0.8)]">How It Works</a>
            <a href="#features" className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(146,219,224,0.8)]">Features</a>
            <a href="#about" className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(146,219,224,0.8)]">About Us</a>
            <a href="#contact" className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(146,219,224,0.8)]">Contact</a>
          </TimelineAnimation>
        )}

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
      <div className="relative z-10 grow flex flex-col justify-center px-8 md:px-20 max-w-7xl mx-auto py-16">
        <TimelineAnimation
          once={true}
          animationNum={4}
          timelineRef={timelineRef}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] pb-6"
        >
          {title}{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#92dbe0] via-[#0b7bff] to-[#3865cf] drop-shadow-[0_0_35px_rgba(11,123,255,0.5)] block lg:inline-block">
            {highlightText}
          </span>
        </TimelineAnimation>

        <TimelineAnimation
          once={true}
          as="p"
          animationNum={5}
          timelineRef={timelineRef}
          className="max-w-3xl text-slate-300 text-lg sm:text-xl font-light leading-relaxed mb-10"
        >
          {description}
        </TimelineAnimation>

        <div className="flex flex-wrap items-center gap-5">
          <TimelineAnimation
            once={true}
            as="button"
            animationNum={6}
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
            animationNum={7}
            timelineRef={timelineRef}
            onClick={onSecondaryAction}
            className="cursor-pointer border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md px-8 py-4 rounded-full font-medium text-base text-slate-200 transition hover:border-white/40"
          >
            {secondaryActionText}
          </TimelineAnimation>
        </div>
      </div>

      {/* Footer Pill Metrics */}
      <div className="relative z-10 p-8 md:px-20 pb-12">
        <TimelineAnimation
          once={true}
          animationNum={8}
          timelineRef={timelineRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl max-w-7xl mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          {stats.map((item, idx) => (
            <div key={idx} className="border-l-2 border-[#0b7bff]/60 pl-4">
              <p className="text-white font-semibold text-sm sm:text-base">{item.label}</p>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{item.sub}</p>
            </div>
          ))}
        </TimelineAnimation>
      </div>
    </section>
  );
};

export default HeroDigitalSuccess;
