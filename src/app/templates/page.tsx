'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import Modal from '@/components/ui/modal';
import ConfirmModal from '@/components/ui/confirm-modal';
import useFetch, { revalidate } from 'http-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiRocket, BiPlus, BiPencil, BiTrash } from 'react-icons/bi';

interface Template {
  _id: string;
  name: string;
  category: string;
  description: string;
  headcount: number;
  createdBy?: string;
  isPublic?: boolean;
}

interface EditFormData {
  name: string;
  category: string;
  description: string;
  headcount: number;
}

function TemplateCard({
  template,
  isUserTemplate,
  onEdit,
  onDelete,
}: {
  template: Template;
  isUserTemplate?: boolean;
  onEdit?: (template: Template) => void;
  onDelete?: (template: Template) => void;
}) {
  return (
    <article className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold">{template.name}</h3>
          <p className="mt-1 text-xs text-[var(--app-muted)] capitalize">
            {template.category} • Up to {template.headcount} people
          </p>
        </div>
        <BiRocket className="text-[var(--app-accent)]" size={20} />
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-[var(--app-muted)]">
        {template.description}
      </p>

      {isUserTemplate ? (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onEdit?.(template)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--app-border)] px-3 py-2 text-xs font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)]"
          >
            <BiPencil size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete?.(template)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--app-border)] px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-400/10"
          >
            <BiTrash size={14} />
            Delete
          </button>
        </div>
      ) : (
        <Link
          href={`/templates/${template._id}/use`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        >
          Use Template
        </Link>
      )}
    </article>
  );
}

function TemplatesList() {
  const { data: session } = useSession();
  const {
    data: response,
    loadingFirst,
    error,
  } = useFetch<{ data?: Template[] }>('/templates', {
    default: { data: [] },
  });

  const templates = Array.isArray(response?.data) ? response.data : [];
  const starterTemplates = templates.filter((t) => t.isPublic);
  const userTemplates = templates.filter((t) => t.createdBy === session?.user?.email);

  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deleteTemplate, setDeleteTemplate] = useState<Template | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    category: '',
    description: '',
    headcount: 1,
  });

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setEditFormData({
      name: template.name,
      category: template.category,
      description: template.description,
      headcount: template.headcount,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(`/api/templates/${editingTemplate._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        revalidate('GET /templates');
        setEditingTemplate(null);
      } else {
        setSubmitError('Failed to update template. Please try again.');
      }
    } catch (error) {
      console.error('Edit failed:', error);
      setSubmitError('Error updating template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTemplate) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(`/api/templates/${deleteTemplate._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        revalidate('GET /templates');
        setDeleteTemplate(null);
        setShowDeleteConfirm(false);
      } else {
        setSubmitError('Failed to delete template. Please try again.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      setSubmitError('Error deleting template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingFirst) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-muted)]">
        Loading templates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-red-300">
        Failed to load templates.
      </div>
    );
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm text-[var(--app-text)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20';
  const labelClass = 'block text-sm font-medium text-[var(--app-text)]';

  return (
    <>
      <div className="space-y-6">
        {/* Starter Templates Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">
              Starter Templates
            </h2>
            <p className="text-xs text-[var(--app-muted)]">
              {starterTemplates.length} available
            </p>
          </div>
          {starterTemplates.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {starterTemplates.map((template) => (
                <TemplateCard key={template._id} template={template} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-6 text-center text-sm text-[var(--app-muted)]">
              No starter templates available
            </div>
          )}
        </div>

        {/* My Templates Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--app-text)]">My Templates</h2>
            <Link
              href="/templates/create"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <BiPlus size={16} />
              Create New
            </Link>
          </div>
          {userTemplates.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {userTemplates.map((template) => (
                <TemplateCard
                  key={template._id}
                  template={template}
                  isUserTemplate
                  onEdit={handleEdit}
                  onDelete={(t) => {
                    setDeleteTemplate(t);
                    setShowDeleteConfirm(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-elevated)]/50 p-6 text-center">
              <p className="text-sm text-[var(--app-muted)]">No custom templates yet</p>
              <Link
                href="/templates/create"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
              >
                <BiPlus size={16} />
                Create your first template
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(editingTemplate)}
        onClose={() => {
          setEditingTemplate(null);
          setSubmitError(null);
        }}
        title="Edit Template"
        size="md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {submitError && (
            <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400">
              {submitError}
            </div>
          )}
          <div>
            <label className={labelClass}>Template Name</label>
            <input
              type="text"
              required
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              className={inputClass}
              placeholder="Template name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={editFormData.category}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, category: e.target.value })
                }
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
                value={editFormData.headcount}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    headcount: parseInt(e.target.value),
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={editFormData.description}
              onChange={(e) =>
                setEditFormData({ ...editFormData, description: e.target.value })
              }
              className={inputClass}
              placeholder="Describe your template..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setEditingTemplate(null)}
              disabled={isSubmitting}
              className="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTemplate(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Template"
        message="This action cannot be undone. Are you sure you want to delete this template?"
        confirmLabel="Delete"
        danger
        isLoading={isSubmitting}
      />
    </>
  );
}

const TemplatesPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Template access requires sign in" />;
  }

  return (
    <AppShell title="Event Templates">
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
        <TemplatesList />
      </section>
    </AppShell>
  );
};

export default TemplatesPage;
