'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiPlus, BiTrash } from 'react-icons/bi';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useSession } from 'next-auth/react';

interface FormData {
  name: string;
  category: string;
  headcount: number;
  description: string;
  checklist: string[];
  timelinePhases: Array<{
    name: string;
    daysBefore: number;
    tasks: string[];
  }>;
  budgetCategories: Array<{
    category: string;
    estimatedAmount: number;
    notes: string;
  }>;
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
    checklist: [''],
    timelinePhases: [{ name: '', daysBefore: 0, tasks: [''] }],
    budgetCategories: [{ category: '', estimatedAmount: 0, notes: '' }],
    vendorNeeds: [''],
  });

  if (!session) {
    return <SignInRequired title="Create template requires sign in" />;
  }

  const handleBasicChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChecklistChange = (index: number, value: string) => {
    const updated = [...formData.checklist];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, checklist: updated }));
  };

  const addChecklistItem = () => {
    setFormData((prev) => ({ ...prev, checklist: [...prev.checklist, ''] }));
  };

  const removeChecklistItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index),
    }));
  };

  const handlePhaseChange = (index: number, field: string, value: any) => {
    const updated = [...formData.timelinePhases];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, timelinePhases: updated }));
  };

  const handleTaskChange = (phaseIndex: number, taskIndex: number, value: string) => {
    const updated = [...formData.timelinePhases];
    updated[phaseIndex].tasks[taskIndex] = value;
    setFormData((prev) => ({ ...prev, timelinePhases: updated }));
  };

  const addTask = (phaseIndex: number) => {
    const updated = [...formData.timelinePhases];
    updated[phaseIndex].tasks.push('');
    setFormData((prev) => ({ ...prev, timelinePhases: updated }));
  };

  const removeTask = (phaseIndex: number, taskIndex: number) => {
    const updated = [...formData.timelinePhases];
    updated[phaseIndex].tasks = updated[phaseIndex].tasks.filter(
      (_, i) => i !== taskIndex
    );
    setFormData((prev) => ({ ...prev, timelinePhases: updated }));
  };

  const addPhase = () => {
    setFormData((prev) => ({
      ...prev,
      timelinePhases: [...prev.timelinePhases, { name: '', daysBefore: 0, tasks: [''] }],
    }));
  };

  const removePhase = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timelinePhases: prev.timelinePhases.filter((_, i) => i !== index),
    }));
  };

  const handleBudgetChange = (index: number, field: string, value: any) => {
    const updated = [...formData.budgetCategories];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, budgetCategories: updated }));
  };

  const addBudgetCategory = () => {
    setFormData((prev) => ({
      ...prev,
      budgetCategories: [
        ...prev.budgetCategories,
        { category: '', estimatedAmount: 0, notes: '' },
      ],
    }));
  };

  const removeBudgetCategory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      budgetCategories: prev.budgetCategories.filter((_, i) => i !== index),
    }));
  };

  const handleVendorNeedChange = (index: number, value: string) => {
    const updated = [...formData.vendorNeeds];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, vendorNeeds: updated }));
  };

  const addVendorNeed = () => {
    setFormData((prev) => ({ ...prev, vendorNeeds: [...prev.vendorNeeds, ''] }));
  };

  const removeVendorNeed = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      vendorNeeds: prev.vendorNeeds.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const cleanedData = {
        name: formData.name.trim(),
        category: formData.category,
        headcount: formData.headcount,
        description: formData.description.trim(),
        checklist: formData.checklist.filter((item) => item.trim()),
        timelinePhases: formData.timelinePhases
          .filter((phase) => phase.name.trim())
          .map((phase) => ({
            name: phase.name.trim(),
            daysBefore: phase.daysBefore,
            tasks: phase.tasks.filter((task) => task.trim()),
          })),
        budgetCategories: formData.budgetCategories
          .filter((item) => item.category.trim())
          .map((item) => ({
            category: item.category.trim(),
            estimatedAmount: item.estimatedAmount,
            notes: item.notes.trim(),
          })),
        vendorNeeds: formData.vendorNeeds.filter((item) => item.trim()),
      };

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        router.push('/templates');
      } else {
        setSubmitError('Failed to create template. Please try again.');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      setSubmitError('Error creating template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm text-[var(--app-text)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20';

  const labelClass = 'block text-sm font-medium text-[var(--app-text)]';

  const sectionClass =
    'rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-4';

  return (
    <AppShell title="Create Template">
      {submitError && (
        <div className="mb-6 rounded-lg bg-red-500/20 p-4 text-sm text-red-400">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Information */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-lg font-semibold text-[var(--app-text)]">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Template Name*</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleBasicChange('name', e.target.value)}
                className={inputClass}
                placeholder="e.g., Summer Wedding"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Category*</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleBasicChange('category', e.target.value)}
                  className={inputClass}
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
                  onChange={(e) =>
                    handleBasicChange('headcount', parseInt(e.target.value))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleBasicChange('description', e.target.value)}
                className={inputClass}
                placeholder="Describe your template..."
                rows={3}
              />
            </div>
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
              onClick={addChecklistItem}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--app-accent-strong)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <BiPlus size={14} /> Add
            </button>
          </div>

          <div className="space-y-2">
            {formData.checklist.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleChecklistChange(index, e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="Checklist item"
                />
                {formData.checklist.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(index)}
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
              onClick={addPhase}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--app-accent-strong)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <BiPlus size={14} /> Phase
            </button>
          </div>

          <div className="space-y-6">
            {formData.timelinePhases.map((phase, phaseIndex) => (
              <div
                key={phaseIndex}
                className="rounded-lg border border-[var(--app-border)]/50 bg-[var(--app-surface)] p-3"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={phase.name}
                    onChange={(e) =>
                      handlePhaseChange(phaseIndex, 'name', e.target.value)
                    }
                    className={`${inputClass} flex-1`}
                    placeholder="Phase name (e.g., Planning)"
                  />
                  {formData.timelinePhases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhase(phaseIndex)}
                      className="rounded-lg border border-[var(--app-border)] p-2 text-red-400 transition hover:bg-red-400/10"
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
                      handlePhaseChange(
                        phaseIndex,
                        'daysBefore',
                        parseInt(e.target.value)
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Tasks</label>
                    <button
                      type="button"
                      onClick={() => addTask(phaseIndex)}
                      className="text-xs font-semibold text-[var(--app-accent-strong)] transition hover:opacity-90"
                    >
                      + Add task
                    </button>
                  </div>

                  {phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex gap-2">
                      <input
                        type="text"
                        value={task}
                        onChange={(e) =>
                          handleTaskChange(phaseIndex, taskIndex, e.target.value)
                        }
                        className={`${inputClass} flex-1`}
                        placeholder="Task"
                      />
                      {phase.tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(phaseIndex, taskIndex)}
                          className="rounded-lg border border-[var(--app-border)] p-2 text-red-400 transition hover:bg-red-400/10"
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
              onClick={addBudgetCategory}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--app-accent-strong)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <BiPlus size={14} /> Category
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {formData.budgetCategories.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-[var(--app-border)]/50 bg-[var(--app-surface)] p-3"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) =>
                      handleBudgetChange(index, 'category', e.target.value)
                    }
                    className={`${inputClass} flex-1`}
                    placeholder="Category (e.g., Catering)"
                  />
                  {formData.budgetCategories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBudgetCategory(index)}
                      className="rounded-lg border border-[var(--app-border)] p-2 text-red-400 transition hover:bg-red-400/10"
                    >
                      <BiTrash size={16} />
                    </button>
                  )}
                </div>

                <div className="mb-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.estimatedAmount}
                    onChange={(e) =>
                      handleBudgetChange(
                        index,
                        'estimatedAmount',
                        parseFloat(e.target.value)
                      )
                    }
                    className={inputClass}
                    placeholder="Estimated amount"
                  />
                </div>

                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => handleBudgetChange(index, 'notes', e.target.value)}
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
              onClick={addVendorNeed}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--app-accent-strong)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <BiPlus size={14} /> Need
            </button>
          </div>

          <div className="space-y-2">
            {formData.vendorNeeds.map((need, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={need}
                  onChange={(e) => handleVendorNeedChange(index, e.target.value)}
                  className={`${inputClass} flex-1`}
                  placeholder="Vendor need"
                />
                {formData.vendorNeeds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVendorNeed(index)}
                    className="rounded-lg border border-[var(--app-border)] p-2 text-red-400 transition hover:bg-red-400/10"
                  >
                    <BiTrash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end pt-4">
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
