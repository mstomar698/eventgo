'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { BiPlus, BiX } from 'react-icons/bi';

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

const CreateThemePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTag = (list: string[], set: (v: string[]) => void) => (val: string) =>
    set([...list, val]);
  const removeTag = (list: string[], set: (v: string[]) => void) => (i: number) =>
    set(list.filter((_, idx) => idx !== i));

  const toggleColor = (color: string) => {
    setColorPalette((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  if (!session) {
    return <SignInRequired title="Create themes requires sign in" />;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activities.length === 0) {
      setError('Add at least one activity tag.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
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
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error?.message || 'Failed to save theme. Please try again.');
        return;
      }

      router.push('/themes');
      router.refresh();
    } catch {
      setError('Failed to save theme. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell title="Create Theme">
      <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl space-y-6">
        {/* Basic Info */}
        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <h2 className="mb-4 text-base font-semibold text-[var(--app-text)]">
            Basic Info
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Theme title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="e.g. Tropical Sunset Celebration"
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClass}
                placeholder="Describe the overall vibe and feel of this theme..."
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
          <h2 className="mb-1 text-base font-semibold text-[var(--app-text)]">
            Color Palette
          </h2>
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
                className={`h-8 w-8 rounded-lg border-2 transition ${
                  colorPalette.includes(color)
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60'
                }`}
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
          <h2 className="mb-4 text-base font-semibold text-[var(--app-text)]">
            Mood & Activities
          </h2>
          <div className="space-y-4">
            <TagInput
              label="Mood tags"
              placeholder="e.g. festive, romantic, playful — press Enter"
              tags={mood}
              onAdd={addTag(mood, setMood)}
              onRemove={removeTag(mood, setMood)}
            />
            <TagInput
              label="Activities *"
              placeholder="e.g. photo booth, quiz night, dancing — press Enter"
              tags={activities}
              onAdd={addTag(activities, setActivities)}
              onRemove={removeTag(activities, setActivities)}
            />
          </div>
        </section>

        {/* Decor, Music, Food */}
        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <h2 className="mb-4 text-base font-semibold text-[var(--app-text)]">Details</h2>
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
          <h2 className="mb-4 text-base font-semibold text-[var(--app-text)]">Budget</h2>
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

        {error && (
          <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400">{error}</div>
        )}

        <div className="flex flex-wrap gap-3 pb-6">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-[var(--app-accent-strong)] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : 'Save theme'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/themes')}
            className="rounded-lg border border-[var(--app-border)] px-6 py-2.5 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
          >
            Cancel
          </button>
        </div>
      </form>
    </AppShell>
  );
};

export default CreateThemePage;
