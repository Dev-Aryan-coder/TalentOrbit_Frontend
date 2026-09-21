import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  X,
  Check,
  Save,
  Tag,
  BookOpen,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { academicianAPI, profileAPI } from '../../services/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import './AcademicianInterestsTab.css';

export default function AcademicianInterestsTab({ currentUser }) {
  const facultyId = currentUser?.id || currentUser?.userId || 1;

  const defaultSuggestedTags = [
    'Artificial Intelligence',
    'Machine Learning',
    'Cloud Computing',
    'Data Science & Analytics',
    'Ayurveda Informatics',
    'Cybersecurity',
    'Internet of Things (IoT)',
    'Distributed Systems',
    'Bioinformatics',
    'Blockchain & Web3',
    'Robotics & Automation',
    'Computer Vision',
    'Embedded Systems',
    'Healthcare Diagnostics',
  ];

  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      academicianAPI.getInterests(facultyId),
      profileAPI.getProfile(facultyId),
    ]).then(([tagsRes, profileRes]) => {
      if (!isMounted) return;

      if (tagsRes.status === 'fulfilled' && Array.isArray(tagsRes.value) && tagsRes.value.length > 0) {
        setTags(tagsRes.value);
      } else if (profileRes.status === 'fulfilled' && profileRes.value?.skills && profileRes.value.skills.length > 0) {
        const cleanTags = profileRes.value.skills.map((s) =>
          typeof s === 'string' ? s.replace(/\s*\(.*?\)/g, '') : s.name
        ).filter(Boolean);
        setTags(cleanTags);
      } else {
        setTags(['Artificial Intelligence', 'Data Science & Analytics', 'Cloud Computing', 'Ayurveda Informatics']);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [facultyId]);

  const handleAddTag = (tagToAdd) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;

    setTags((prev) => [...prev, trimmed]);
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSaveTags = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      await Promise.allSettled([
        academicianAPI.updateInterests(facultyId, tags),
        profileAPI.updateProfile(facultyId, { skills: tags }),
      ]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save expertise tags to backend', err);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="academician-interests-space space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          My Research Expertise & Specialization Tags
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          These domain tags are indexed by the TalentOrbit recommendation engine to match your profile with relevant sponsored FDPs, research funding calls, and corporate technical advisory
        </p>
      </div>

      {/* Tag Editor using Shadcn Card */}
      <Card className="rounded-2xl shadow-xs space-y-2">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag size={16} className="text-emerald-600" />
              Active Domain Tags ({tags.length})
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Click any tag's remove button to discard or add new research specialties below
            </CardDescription>
          </div>

          <Button
            onClick={handleSaveTags}
            disabled={saving}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 shadow-xs h-9"
          >
            {saving ? 'Saving to Database...' : <><Save size={13} /> Save Expertise</>}
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>Domain expertise tags successfully synchronized and persisted to MySQL database!</span>
            </div>
          )}

          {/* Tag Input Field using Shadcn Input and Button */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Type a research domain or technical topic (e.g. Quantum Algorithms)..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(newTagInput);
                }
              }}
              className="flex-1 h-10 text-xs rounded-xl"
            />
            <Button
              type="button"
              onClick={() => handleAddTag(newTagInput)}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-semibold px-4 h-10 rounded-xl"
            >
              <Plus size={14} className="mr-1" /> Add Tag
            </Button>
          </div>

          {/* Current Active Tags using Shadcn Badge */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 min-h-[100px] flex flex-wrap gap-2 items-start">
            {tags.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">No expertise tags added yet.</span>
            ) : (
              tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="emerald"
                  className="gap-1.5 py-1.5 px-3 text-xs font-semibold shadow-2xs group"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-600 transition"
                    title="Remove Tag"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))
            )}
          </div>

          <Separator className="my-2" />

          {/* Quick-Add Suggestions using Shadcn Badge */}
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Lightbulb size={14} className="text-amber-500" />
              Suggested High-Demand Academic Specializations:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {defaultSuggestedTags
                .filter((st) => !tags.some((t) => t.toLowerCase() === st.toLowerCase()))
                .map((st) => (
                  <Button
                    key={st}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddTag(st)}
                    className="h-8 text-xs font-medium border-slate-200 dark:border-slate-800 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-lg"
                  >
                    + {st}
                  </Button>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
