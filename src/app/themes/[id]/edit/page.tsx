'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import useFetch from 'http-react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, FormEvent } from 'react';
import { BiPlus, BiX, BiTrash, BiArrowToLeft } from 'react-icons/bi';
import Link from 'next/link';

const inputClass =
  'w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm text-[var(--app-text)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20';
const labelClass = 'block text-sm font-medium text-[var(--app-text)] mb-1';

const PRESET_COLORS = [
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

interface TimelinePhase {
  phase: string;
  daysBefore: number;
  tasks: string[];
}

function TagInput({
  label,
  placeholder,
  tags,
  onAdd,
  onRemove,
}: {
  label: string;
  placeholder: string;
  tags: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
}) {
  const [input, setInput] = useState('');
  const commit = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) onAdd(val);
    setInput('');
  };
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
          }}
          className={inputClass}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={commit}
          className="rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm hover:bg-[var(--app-elevated)]"
        >
          <BiPlus size={16} />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-xs text-[var(--app-muted)]"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="hover:text-red-400"
              >
                <BiX size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function EditThemeForm({ themeId }: { themeId: string }) {
  const router = useRouter();
  const { data: response, loadingFirst } = useFetch<{ data?: any }>(
    `/themes?id=${themeId}`,
    {
      default: { data: undefined },
    }
  );

  const theme = response?.data;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [occasion, setOccasion] = useState('other');
  const [mood, setMood] = useState<string[]>([]);
  const [colorPalette, setColorPalette] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [decor, setDecor] = useState<string[]>([]);
  const [music, setMusic] = useState<string[]>([]);
  const [food, setFood] = useState<string[]>([]);
  const [budgetEstimate, setBudgetEstimate] = useState('');
  const [budgetNotes, setBudgetNotes] = useState('');
  const [checklist, setChecklist] = useState<string[]>(['']);
  const [timeline, setTimeline] = useState<TimelinePhase[]>([
    { phase: '', daysBefore: 30, tasks: [''] },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (theme && !loaded) {
      setTitle(theme.title ?? '');
      setDescription(theme.description ?? '');
      setOccasion(theme.occasion ?? 'other');
      setMood(theme.mood ?? []);
      setColorPalette(theme.colorPalette ?? []);
      setActivities(theme.events ?? []);
      setDecor(theme.decor ?? []);
      setMusic(theme.music ?? []);
      setFood(theme.food ?? []);
      setBudgetEstimate(theme.budgetEstimate != null ? String(theme.budgetEstimate) : '');
      setBudgetNotes(theme.budgetNotes ?? '');
      setChecklist(theme.checklist?.length ? theme.checklist : ['']);
      setTimeline(
        theme.timeline?.length
          ? theme.timeline
          : [{ phase: '', daysBefore: 30, tasks: [''] }]
      );
      setLoaded(true);
    }
  }, [theme, loaded]);

  const addTag = (list: string[], set: (v: string[]) => void) => (val: string) =>
    set([...list, val]);
  const removeTag = (list: string[], set: (v: string[]) => void) => (i: number) =>
    set(list.filter((_, idx) => idx !== i));
  const toggleColor = (color: string) =>
    setColorPalette((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );

  const updateChecklistItem = (i: number, val: string) => {
    const n = [...checklist];
    n[i] = val;
    setChecklist(n);
  };
  const addChecklistItem = () => setChecklist([...checklist, '']);
  const removeChecklistItem = (i: number) =>
    setChecklist(checklist.filter((_, idx) => idx !== i));

  const updatePhase = (pi: number, field: keyof TimelinePhase, val: string | number) =>
    setTimeline(timeline.map((p, i) => (i === pi ? { ...p, [field]: val } : p)));
  const updateTask = (pi: number, ti: number, val: string) =>
    setTimeline(
      timeline.map((p, i) => {
        if (i !== pi) return p;
        const tasks = [...p.tasks];
        tasks[ti] = val;
        return { ...p, tasks };
      })
    );
  const addTask = (pi: number) =>
    setTimeline(
      timeline.map((p, i) => (i === pi ? { ...p, tasks: [...p.tasks, ''] } : p))
    );
  const removeTask = (pi: number, ti: number) =>
    setTimeline(
      timeline.map((p, i) =>
        i === pi ? { ...p, tasks: p.tasks.filter((_, j) => j !== ti) } : p
      )
    );
  const addPhase = () =>
    setTimeline([...timeline, { phase: '', daysBefore: 7, tasks: [''] }]);
  const removePhase = (pi: number) => setTimeline(timeline.filter((_, i) => i !== pi));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const cleanChecklist = checklist.filter((s) => s.trim());
      const cleanTimeline = timeline
        .filter((p) => p.phase.trim())
        .map((p) => ({ ...p, tasks: p.tasks.filter((t) => t.trim()) }));

      const res = await fetch(`/api/themes?id=${themeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          occasion,
          mood,
          colorPalette,
          events: activities,
          decor,
          music,
          food,
          budgetEstimate: budgetEstimate ? parseFloat(budgetEstimate) : undefined,
          budgetNotes: budgetNotes || undefined,
          checklist: cleanChecklist.length ? cleanChecklist : undefined,
          timeline: cleanTimeline.length ? cleanTimeline : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error?.message || 'Failed to update theme.');
        return;
      }
      router.push('/themes');
      router.refresh();
    } catch {
      setError('Failed to update theme. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingFirst) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-muted)]">
        Loading theme...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl space-y-6">
      {/* Basic Info */}
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <h2 className="mb-4 text-base font-semibold">Basic Info</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Theme title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              rows={3}
            />
          </div>
          <div>
            <label className={labelClass}>Occasion</label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className={inputClass}
            >
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate</option>
              <option value="community">Community</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <h2 className="mb-1 text-base font-semibold">Color Palette</h2>
        <p className="mb-4 text-xs text-[var(--app-muted)]">
          Pick the colors that define this theme
        </p>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => toggleColor(color)}
              style={{ backgroundColor: color }}
              className={`h-8 w-8 rounded-lg border-2 transition ${colorPalette.includes(color) ? 'scale-110 border-white' : 'border-transparent opacity-60'}`}
              title={color}
            />
          ))}
        </div>
        {colorPalette.length > 0 && (
          <p className="mt-3 text-xs text-[var(--app-muted)]">
            Selected: {colorPalette.join(', ')}
          </p>
        )}
      </section>

      {/* Mood & Activities */}
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <h2 className="mb-4 text-base font-semibold">Mood & Activities</h2>
        <div className="space-y-4">
          <TagInput
            label="Mood tags"
            placeholder="e.g. festive, romantic, playful — press Enter"
            tags={mood}
            onAdd={addTag(mood, setMood)}
            onRemove={removeTag(mood, setMood)}
          />
          <TagInput
            label="Activities"
            placeholder="e.g. photo booth, quiz night, dancing — press Enter"
            tags={activities}
            onAdd={addTag(activities, setActivities)}
            onRemove={removeTag(activities, setActivities)}
          />
        </div>
      </section>

      {/* Details */}
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <h2 className="mb-4 text-base font-semibold">Details</h2>
        <div className="space-y-4">
          <TagInput
            label="Decor ideas"
            placeholder="e.g. fairy lights, floral centrepieces — press Enter"
            tags={decor}
            onAdd={addTag(decor, setDecor)}
            onRemove={removeTag(decor, setDecor)}
          />
          <TagInput
            label="Music / playlist vibes"
            placeholder="e.g. 80s pop, jazz, tropical house — press Enter"
            tags={music}
            onAdd={addTag(music, setMusic)}
            onRemove={removeTag(music, setMusic)}
          />
          <TagInput
            label="Food & drinks"
            placeholder="e.g. tropical cocktails, finger foods, BBQ — press Enter"
            tags={food}
            onAdd={addTag(food, setFood)}
            onRemove={removeTag(food, setFood)}
          />
        </div>
      </section>

      {/* Budget */}
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <h2 className="mb-4 text-base font-semibold">Budget</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Estimated budget ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={budgetEstimate}
              onChange={(e) => setBudgetEstimate(e.target.value)}
              className={inputClass}
              placeholder="e.g. 500"
            />
          </div>
          <div>
            <label className={labelClass}>Budget notes</label>
            <textarea
              value={budgetNotes}
              onChange={(e) => setBudgetNotes(e.target.value)}
              className={inputClass}
              placeholder="e.g. $200 for decor, $150 food, $150 entertainment..."
              rows={2}
            />
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <h2 className="mb-4 text-base font-semibold">Checklist</h2>
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateChecklistItem(i, e.target.value)}
                className={inputClass}
                placeholder="e.g. Book venue"
              />
              <button
                type="button"
                onClick={() => removeChecklistItem(i)}
                className="rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm text-[var(--app-muted)] hover:text-red-400"
              >
                <BiX size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addChecklistItem}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--app-border)] px-3 py-2 text-xs text-[var(--app-muted)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-text)]"
          >
            <BiPlus size={14} /> Add item
          </button>
        </div>
      </section>

      {/* Timeline */}
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
        <h2 className="mb-4 text-base font-semibold">Timeline</h2>
        <div className="space-y-4">
          {timeline.map((phase, pi) => (
            <div
              key={pi}
              className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                  Phase {pi + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removePhase(pi)}
                  className="text-[var(--app-muted)] hover:text-red-400"
                >
                  <BiTrash size={14} />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 mb-3">
                <div>
                  <label className={labelClass}>Phase name</label>
                  <input
                    type="text"
                    value={phase.phase}
                    onChange={(e) => updatePhase(pi, 'phase', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Planning"
                  />
                </div>
                <div>
                  <label className={labelClass}>Days before event</label>
                  <input
                    type="number"
                    min="0"
                    value={phase.daysBefore}
                    onChange={(e) =>
                      updatePhase(pi, 'daysBefore', parseInt(e.target.value) || 0)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Tasks</label>
                {phase.tasks.map((task, ti) => (
                  <div key={ti} className="flex gap-2">
                    <input
                      type="text"
                      value={task}
                      onChange={(e) => updateTask(pi, ti, e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Book venue"
                    />
                    <button
                      type="button"
                      onClick={() => removeTask(pi, ti)}
                      className="rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm text-[var(--app-muted)] hover:text-red-400"
                    >
                      <BiX size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addTask(pi)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--app-border)] px-3 py-2 text-xs text-[var(--app-muted)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-text)]"
                >
                  <BiPlus size={12} /> Add task
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addPhase}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[var(--app-border)] px-4 py-2 text-sm text-[var(--app-muted)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-text)]"
          >
            <BiPlus size={16} /> Add phase
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400">{error}</div>
      )}

      <div className="flex flex-wrap gap-3 pb-6">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-[var(--app-accent-strong)] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
        >
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
        <Link
          href="/themes"
          className="rounded-lg border border-[var(--app-border)] px-6 py-2.5 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

const EditThemePage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const id = params?.id as string;

  if (!session) return <SignInRequired title="Edit theme requires sign in" />;

  return (
    <AppShell title="Edit Theme">
      <div className="mb-4">
        <Link
          href="/themes"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm transition hover:bg-[var(--app-surface)]"
        >
          <BiArrowToLeft size={16} /> Back to Themes
        </Link>
      </div>
      <EditThemeForm themeId={id} />
    </AppShell>
  );
};

export default EditThemePage;
