'use client';

import AppShell from '@/components/layout/app-shell';
import CalendarPage from '@/features/planner/calendar';
import SignInRequired from '@/features/auth/sign-in-required';
import ConfirmModal from '@/components/ui/confirm-modal';
import Modal from '@/components/ui/modal';
import useFetch, { revalidate } from 'http-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiCalendar, BiPlus, BiTrashAlt, BiPencil } from 'react-icons/bi';

interface PostWithId {
  _id: string;
  title: string;
  date: string;
  content: string;
}

function PostCard({
  post,
  onEdit,
  onDelete,
}: {
  post: PostWithId;
  onEdit: (post: PostWithId) => void;
  onDelete: (id: string) => void;
}) {
  const formattedDate = post.date ? new Date(post.date).toLocaleDateString() : 'No date';

  return (
    <article className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold">{post.title}</h3>
          <p className="mt-1 text-xs text-[var(--app-muted)]">{formattedDate}</p>
        </div>
        <div className="flex gap-1">
          <button
            title="edit-post"
            type="button"
            className="rounded-lg border border-[var(--app-border)] p-2 text-[var(--app-muted)] transition hover:text-[var(--app-accent)]"
            onClick={() => onEdit(post)}
          >
            <BiPencil size={16} />
          </button>
          <button
            title="delete-post"
            type="button"
            className="rounded-lg border border-[var(--app-border)] p-2 text-[var(--app-muted)] transition hover:text-red-400"
            onClick={() => onDelete(post._id)}
          >
            <BiTrashAlt size={16} />
          </button>
        </div>
      </div>
      <p className="mt-3 line-clamp-5 text-sm text-[var(--app-muted)]">{post.content}</p>
    </article>
  );
}

function PostsList() {
  const {
    data: response,
    loadingFirst,
    error,
  } = useFetch<{ data?: PostWithId[] }>('/posts', {
    default: { data: [] },
  });

  const posts = Array.isArray(response?.data) ? response.data : [];
  const [editingPost, setEditingPost] = useState<PostWithId | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', content: '' });

  const handleEdit = (post: PostWithId) => {
    setEditingPost(post);
    setFormData({ title: post.title, date: post.date, content: post.content });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts?id=${deleteId}`, { method: 'DELETE' });
      if (response.ok) {
        revalidate('GET /posts');
        setDeleteId(null);
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editingPost?._id ? 'PATCH' : 'POST';
      const body = editingPost?._id ? { id: editingPost._id, ...formData } : formData;

      const response = await fetch('/api/posts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        revalidate('GET /posts');
        setEditingPost(null);
        setFormData({ title: '', date: '', content: '' });
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setEditingPost(null);
    setFormData({ title: '', date: '', content: '' });
  };

  if (loadingFirst) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-muted)]">
        Loading notes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-red-300">
        Failed to load notes.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--app-muted)]">
          {posts.length} notes in this workspace
        </p>
        <button
          onClick={() => handleEdit({ _id: '', title: '', date: '', content: '' })}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <BiPlus size={18} />
          Add note
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Modal
        isOpen={Boolean(editingPost)}
        onClose={handleCloseModal}
        title={editingPost?._id ? 'Edit note' : 'New note'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm text-[var(--app-text)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20"
              placeholder="Note title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm text-[var(--app-text)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm text-[var(--app-text)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20"
              placeholder="Write your note here..."
              rows={5}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-elevated)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : 'Save note'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete note"
        message="This action cannot be undone. Are you sure you want to delete this note?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        isLoading={isSubmitting}
      />
    </div>
  );
}

const NotesPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Notes access requires sign in" />;
  }

  return (
    <AppShell title="Notes & Schedule">
      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
          <PostsList />
        </section>
        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
          <div className="mb-3 flex items-center gap-2">
            <BiCalendar className="text-[var(--app-accent)]" size={18} />
            <h2 className="text-sm font-semibold">Event calendar</h2>
          </div>
          <CalendarPage />
        </section>
      </div>
    </AppShell>
  );
};

export default NotesPage;
