'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { Comment } from '@/types';

interface CommentsSectionProps {
  songId: string;
}

export function CommentsSection({ songId }: CommentsSectionProps) {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      song_id: songId,
      user_id: user?.id || 'guest',
      content: commentText.trim(),
      parent_id: null,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: profile || {
        id: 'guest',
        display_name: 'Devotee Soul',
        avatar_url: null,
        role: 'user',
        devotee_tier: 'Devotee',
        sadhana_streak_days: 0,
        total_meditation_minutes: 0,
        preferred_tuning: '432Hz',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText('');
  };

  const handleDelete = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--gold-border)] shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--gold-border)]">
        <h3 className="font-laila text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[var(--gold-primary)]" />
          <span>{t('Devotee Reflections', 'भक्तों के विचार')} ({comments.length})</span>
        </h3>
      </div>

      {/* Post Comment Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-start">
        <div className="w-9 h-9 rounded-full overflow-hidden relative shrink-0 border border-[var(--gold-border)] bg-[var(--maroon-pill)] flex items-center justify-center text-[var(--gold-primary)] font-bold text-xs">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="User"
              fill
              className="object-cover"
            />
          ) : (
            <span>{(profile?.display_name || user?.email || 'D')[0].toUpperCase()}</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <textarea
            rows={2}
            placeholder={t('Share your devotion or thoughts...', 'अपने विचार या भक्ति साझा करें...')}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full font-laila bg-[var(--bg-void)] border border-[var(--gold-border)] rounded-2xl p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold-primary)] transition-colors"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="font-laila px-5 py-2 rounded-full bronze-pill hover:opacity-95 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[var(--gold-primary)]/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>{t('Post', 'पोस्ट करें')}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2 max-h-[380px] overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-center font-laila text-xs text-[var(--text-muted)] py-6">
            {t(
              'Be the first devotee to share your sacred reflections on this recording.',
              'इस भजन पर अपने विचार साझा करने वाले पहले भक्त बनें।'
            )}
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-2xl bg-[var(--bg-void)] border border-[var(--gold-border)] space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden relative border border-[var(--gold-border)] bg-[var(--maroon-pill)] flex items-center justify-center text-[var(--gold-primary)] font-bold text-[10px]">
                    {comment.profile?.avatar_url ? (
                      <Image
                        src={comment.profile.avatar_url}
                        alt={comment.profile.display_name || 'User'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span>{(comment.profile?.display_name || 'D')[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <span className="font-laila text-xs font-semibold text-[var(--gold-primary)]">
                      {comment.profile?.display_name || 'Devotee'}
                    </span>
                  </div>
                </div>

                {/* Delete own comment */}
                {(user?.id === comment.user_id || comment.user_id === 'guest') && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-[var(--text-muted)] hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="font-laila text-xs text-[var(--text-secondary)] leading-relaxed pl-9">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
