import React from 'react';
import HeroDigitalSuccess from '../../components/ui/HeroDigitalSuccess';

export default function HomePage({ onNavigateRole }) {
  return (
    <div className="min-h-screen bg-[#050811] text-white">
      {/* Hero Banner Section */}
      <HeroDigitalSuccess
        title="Transforming Academia & Industry"
        highlightText="Collaboration"
        description="TalentOrbit (SIH Problem #26044) empowers Students with AI skill diagnostic assessments, Recruiters with explainable talent scouting, Academicians with research grants & FDPs, and Institutions with real-time NIRF/NAAC placement intelligence."
        primaryActionText="Explore Student Portal"
        onPrimaryAction={() => onNavigateRole ? onNavigateRole('student') : console.log('Navigate to student')}
        secondaryActionText="Recruiter ATS & Talent Pool"
        onSecondaryAction={() => onNavigateRole ? onNavigateRole('industry') : console.log('Navigate to industry')}
        stats={[
          { label: "AI Matching Engine", sub: "Deterministic & Weighted" },
          { label: "Verified Skill Genome", sub: "SHA-256 Tamper-Proof" },
          { label: "Skill Deficit Heatmaps", sub: "NIRF Metric 5.2.1 / NAAC" },
          { label: "Faculty Immersion", sub: "AICTE FDPs & Sabbaticals" }
        ]}
      />
    </div>
  );
}
