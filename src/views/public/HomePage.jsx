import React from 'react';
import HeroDigitalSuccess from '../../components/ui/HeroDigitalSuccess';

export default function HomePage({ onNavigateRole }) {
  return (
    <div className="min-h-screen bg-[#050811] text-white">
      <HeroDigitalSuccess
        headline="REFRESHING"
        subtitle="The Next Generation Academia & Industry Intelligence Network"
        description="TalentOrbit (SIH Problem #26044) empowers Students with AI skill diagnostic assessments, Recruiters with explainable talent scouting, Academicians with research grants & FDPs, and Institutions with real-time NIRF/NAAC placement intelligence."
        primaryActionText="Explore Student Portal"
        onPrimaryAction={() => onNavigateRole ? onNavigateRole('student') : console.log('Navigate to student')}
        secondaryActionText="Recruiter ATS & Talent Pool"
        onSecondaryAction={() => onNavigateRole ? onNavigateRole('industry') : console.log('Navigate to industry')}
      />
    </div>
  );
}
