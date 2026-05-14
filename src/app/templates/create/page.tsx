'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiPlus, BiTrash, BiX } from 'react-icons/bi';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useSession } from 'next-auth/react';

const inputClass =
  'w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm text-[var(--app-text)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20';
const labelClass = 'block text-sm font-medium text-[var(--app-text)]';
const sectionClass =
  'rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-4';

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
      <div className="mt-1 flex gap-2">
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
          className="rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm hover:bg-[var(--app-surface)]"
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

interface FormData {
  name: string;
  category: string;
  headcount: number;
  description: string;
  colorPalette: string[];
  mood: string[];
  activities: string[];
  decor: string[];
  music: string[];
  food: string[];
  checklist: string[];
  timelinePhases: Array<{ name: string; daysBefore: number; tasks: string[] }>;
  budgetCategories: Array<{ category: string; estimatedAmount: number; notes: string }>;
  vendorNeeds: string[];
}

export default function CreateTemplatePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'other',
    headcount: 1,
    description: '',
    colorPalette: [],
    mood: [],
    activities: [],
    decor: [],
    music: [],
    food: [],
    checklist: [''],
    timelinePhases: [{ name: '', daysBefore: 0, tasks: [''] }],
    budgetCategories: [{ category: '', estimatedAmount: 0, notes: '' }],
    vendorNeeds: [''],
  });

  if (!session) return <SignInRequired title="Create template requires sign in" />;

  const set = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleColor = (color: string) =>
    set(
      'colorPalette',
      formData.colorPalette.includes(color)
        ? formData.colorPalette.filter((c) => c !== color)
        : [...formData.colorPalette, color]
    );

  const addTag = (field: string, list: string[]) => (val: string) =>
    set(field, [...list, val]);
  const removeTag = (field: string, list: string[]) => (i: number) =>
    set(
      field,
      list.filter((_, idx) => idx !== i)
    );

  // Checklist
  const updateChecklist = (i: number, val: string) => {
    const next = [...formData.checklist];
    next[i] = val;
    set('checklist', next);
  };

  // Timeline
  const updatePhase = (i: number, field: string, val: any) => {
    const next = [...formData.timelinePhases];
    next[i] = { ...next[i], [field]: val };
    set('timelinePhases', next);
  };
  const updateTask = (pi: number, ti: number, val: string) => {
    const next = [...formData.timelinePhases];
    const tasks = [...next[pi].tasks];
    tasks[ti] = val;
    next[pi] = { ...next[pi], tasks };
    set('timelinePhases', next);
  };
  const addTask = (pi: number) => {
    const next = [...formData.timelinePhases];
    next[pi] = { ...next[pi], tasks: [...next[pi].tasks, ''] };
    set('timelinePhases', next);
  };
  const removeTask = (pi: number, ti: number) => {
    const next = [...formData.timelinePhases];
    next[pi] = { ...next[pi], tasks: next[pi].tasks.filter((_, i) => i !== ti) };
    set('timelinePhases', next);
  };

  // Budget
  const updateBudget = (i: number, field: string, val: any) => {
    const next = [...formData.budgetCategories];
    next[i] = { ...next[i], [field]: val };
    set('budgetCategories', next);
  };

  // Vendor
  const updateVendor = (i: number, val: string) => {
    const next = [...formData.vendorNeeds];
    next[i] = val;
    set('vendorNeeds', next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        headcount: formData.headcount,
        description: formData.description.trim(),
        colorPalette: formData.colorPalette,
        mood: formData.mood,
        activities: formData.activities,
        decor: formData.decor,
        music: formData.music,
        food: formData.food,
        checklist: formData.checklist.filter((s) => s.trim()),
        timeline: formData.timelinePhases
          .filter((p) => p.name.trim())
          .map((p) => ({
            phase: p.name.trim(),
            daysBefore: p.daysBefore,
            tasks: p.tasks.filter((t) => t.trim()),
          })),
        budgetCategories: formData.budgetCategories
          .filter((b) => b.category.trim())
          .map((b) => ({
            category: b.category.trim(),
            estimatedAmount: b.estimatedAmount,
            notes: b.notes.trim(),
          })),
        vendorNeeds: formData.vendorNeeds.filter((s) => s.trim()),
      };

      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/templates');
      } else {
        setSubmitError('Failed to create template. Please try again.');
      }
    } catch {
      setSubmitError('Error creating template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell title="Create Template">
      {submitError && (
        <div className="mb-6 rounded-lg bg-red-500/20 p-4 text-sm text-red-400">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Info */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-[var(--app-text)]">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Template Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => set('name', e.target.value)}
                className={`mt-1 ${inputClass}`}
                placeholder="e.g., Summer Wedding"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => set('category', e.target.value)}
                  className={`mt-1 ${inputClass}`}
                >
                  <option value="birthday">Birthday</option>
                  <option value="wedding">Wedding</option>
                  <option value="community">Community</option>
                  <option value="corporate">Corporate</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Expected Headcount</label>
                <input
                  type="number"
                  min="1"
                  value={formData.headcount}
                  onChange={(e) => set('headcount', parseInt(e.target.value))}
                  className={`mt-1 ${inputClass}`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => set('description', e.target.value)}
                className={`mt-1 ${inputClass}`}
                placeholder="Describe your template..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className={sectionClass}>
          <h2 className="mb-1 text-lg font-semibold text-[var(--app-text)]">
            Color Palette
          </h2>
          <p className="mb-4 text-xs text-[var(--app-muted)]">
            Pick the colors that represent this template
          </p>
          <div className="flex flex-wrap gap-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                style={{ backgroundColor: color }}
                className={`h-8 w-8 rounded-lg border-2 transition ${formData.colorPalette.includes(color) ? 'scale-110 border-white' : 'border-transparent opacity-60'}`}
                title={color}
              />
            ))}
          </div>
          {formData.colorPalette.length > 0 && (
            <p className="mt-3 text-xs text-[var(--app-muted)]">
              Selected: {formData.colorPalette.join(', ')}
            </p>
          )}
        </div>

        {/* Mood & Activities */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-[var(--app-text)]">
            Mood & Activities
          </h2>
          <div className="space-y-4">
            <TagInput
              label="Mood tags"
              placeholder="e.g. festive, romantic, professional — press Enter"
              tags={formData.mood}
              onAdd={addTag('mood', formData.mood)}
              onRemove={removeTag('mood', formData.mood)}
            />
            <TagInput
              label="Activities"
              placeholder="e.g. photo booth, dancing, speeches — press Enter"
              tags={formData.activities}
              onAdd={addTag('activities', formData.activities)}
              onRemove={removeTag('activities', formData.activities)}
            />
          </div>
        </div>

        {/* Details */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-[var(--app-text)]">Details</h2>
          <div className="space-y-4">
            <TagInput
              label="Decor ideas"
              placeholder="e.g. fairy lights, floral centrepieces — press Enter"
              tags={formData.decor}
              onAdd={addTag('decor', formData.decor)}
              onRemove={removeTag('decor', formData.decor)}
            />
            <TagInput
              label="Music / playlist vibes"
              placeholder="e.g. 80s pop, jazz, live band — press Enter"
              tags={formData.music}
              onAdd={addTag('music', formData.music)}
              onRemove={removeTag('music', formData.music)}
            />
            <TagInput
              label="Food & drinks"
              placeholder="e.g. buffet, cocktails, wedding cake — press Enter"
              tags={formData.food}
              onAdd={addTag('food', formData.food)}
              onRemove={removeTag('food', formData.food)}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className={sectionClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">
              Checklist Items
            </h2>
            <button
              type="button"
              onClick={() => set('checklist', [...formData.checklist, ''])}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--app-accent-strong)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <BiPlus size={14} /> Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.checklist.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateChecklist(i, e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="Checklist item"
                />
                {formData.checklist.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        'checklist',
                        formData.checklist.filter((_, j) => j !== i)
                      )
                    }
                    className="rounded-lg border border-[var(--app-border)] p-2 text-red-400 transition hover:bg-red-400/10"
                  >
                    <BiTrash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Phases */}
        <div className={sectionClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">
              Timeline Phases
            </h2>
            <button
              type="button"
              onClick={() =>
                set('timelinePhases', [
                  ...formData.timelinePhases,
                  { name: '', daysBefore: 0, tasks: [''] },
                ])
              }
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--app-accent-strong)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <BiPlus size={14} /> Phase
            </button>
          </div>
          <div className="space-y-4">
            {formData.timelinePhases.map((phase, pi) => (
              <div
                key={pi}
                className="rounded-lg border border-[var(--app-border)]/50 bg-[var(--app-surface)] p-3"
              >
                <div className="mb-3 flex gap-2">
                  <input
                    type="text"
                    value={phase.name}
                    onChange={(e) => updatePhase(pi, 'name', e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder="Phase name (e.g. Planning)"
                  />
                  {formData.timelinePhases.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          'timelinePhases',
                          formData.timelinePhases.filter((_, i) => i !== pi)
                        )
                      }
                      className="rounded-lg border border-[var(--app-border)] p-2 text-red-400 hover:bg-red-400/10"
                    >
                      <BiTrash size={16} />
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <label className={labelClass}>Days before event</label>
                  <input
                    type="number"
                    value={phase.daysBefore}
                    onChange={(e) =>
                      updatePhase(pi, 'daysBefore', parseInt(e.target.value))
                    }
                    className={`mt-1 ${inputClass}`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Tasks</label>
                    <button
                      type="button"
                      onClick={() => addTask(pi)}
                      className="text-xs font-semibold text-[var(--app-accent-strong)] hover:opacity-80"
                    >
                      + Add task
                    </button>
                  </div>
                  {phase.tasks.map((task, ti) => (
                    <div key={ti} className="flex gap-2">
                      <input
                        type="text"
                        value={task}
                        onChange={(e) => updateTask(pi, ti, e.target.value)}
                        className={`${inputClass} flex-1`}
                        placeholder="Task"
                      />
                      {phase.tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(pi, ti)}
                          className="rounded-lg border border-[var(--app-border)] p-2 text-red-400 hover:bg-red-400/10"
                        >
                          <BiTrash size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Categories */}
        <div className={sectionClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">
              Budget Categories
            </h2>
            <button
              type="button"
              onClick={() =>
                set('budgetCategories', [
                  ...formData.budgetCategories,
                  { category: '', estimatedAmount: 0, notes: '' },
                ])
              }
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--app-accent-strong)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <BiPlus size={14} /> Category
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {formData.budgetCategories.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-[var(--app-border)]/50 bg-[var(--app-surface)] p-3"
              >
                <div className="mb-2 flex gap-2">
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => updateBudget(i, 'category', e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder="e.g. Catering"
                  />
                  {formData.budgetCategories.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          'budgetCategories',
                          formData.budgetCategories.filter((_, j) => j !== i)
                        )
                      }
                      className="rounded-lg border border-[var(--app-border)] p-2 text-red-400 hover:bg-red-400/10"
                    >
                      <BiTrash size={16} />
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.estimatedAmount}
                  onChange={(e) =>
                    updateBudget(i, 'estimatedAmount', parseFloat(e.target.value))
                  }
                  className={`mb-2 ${inputClass}`}
                  placeholder="Estimated amount"
                />
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => updateBudget(i, 'notes', e.target.value)}
                  className={inputClass}
                  placeholder="Notes"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Needs */}
        <div className={sectionClass}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">Vendor Needs</h2>
            <button
              type="button"
              onClick={() => set('vendorNeeds', [...formData.vendorNeeds, ''])}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--app-accent-strong)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <BiPlus size={14} /> Need
            </button>
          </div>
          <div className="space-y-2">
            {formData.vendorNeeds.map((need, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={need}
                  onChange={(e) => updateVendor(i, e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="Vendor need (e.g. Photographer)"
                />
                {formData.vendorNeeds.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        'vendorNeeds',
                        formData.vendorNeeds.filter((_, j) => j !== i)
                      )
                    }
                    className="rounded-lg border border-[var(--app-border)] p-2 text-red-400 hover:bg-red-400/10"
                  >
                    <BiTrash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="rounded-lg border border-[var(--app-border)] px-6 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            className="rounded-lg bg-[var(--app-accent-strong)] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Template'}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
