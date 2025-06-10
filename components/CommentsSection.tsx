'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { Loader2, Send, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'

interface CommentsSectionProps {
  postSlug: string
}

const fetcher = async (url: string) => {
    const res = await fetch(url, {
      method: 'GET',
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'An error occurred while fetching comments');
    }
    return data;
}

interface Comment {
  id: string;
  user: {
    name: string;
  };
  createdAt: string;
  desc: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postSlug }) => {
  const { data: session } = useSession()
  const [desc, setDesc] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data, mutate, isLoading, error } = useSWR(`/api/comments?postSlug=${postSlug}`, fetcher)
  const comments = data || [];

  // Show error toast if comments failed to load
  React.useEffect(() => {
    if (error) {
      showError('Failed to load comments. Please refresh the page.')
    }
  }, [error])
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!desc.trim()) {
      showError('Please enter a comment before posting.')
      return
    }
    
    if (!session) {
      showError('Please sign in to post a comment.')
      return
    }

    setIsSubmitting(true)
    const loadingToast = showLoading('Posting your comment...')
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({desc, postSlug}),
      })

      dismissToast(loadingToast)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        showError(errorData.message || 'Failed to post comment. Please try again.')
        return
      }

      showSuccess('Comment posted successfully!')
      mutate();
      setDesc('')
    } catch (error) {
      dismissToast(loadingToast)
      console.error('Error posting comment:', error)
      showError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  console.log("slug: ", postSlug);
  
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form - Only for authenticated users */}
      {session ? (
        <div className="mb-6 p-4 border border-border rounded-lg bg-background">
          <div className="flex items-center gap-3 mb-3">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={"/userDeafault.png"}
                width={24}
                height={24}
                className="rounded-full"
                onError={() => {
                  showError('Failed to load user profile image')
                }}
              />
            ) : (
              <User className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">
              {session.user?.name || session.user?.email}
            </span>
          </div>
          
          <form onSubmit={handleSubmitComment}>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              disabled={isSubmitting}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-muted-foreground">
                {desc.length}/500 characters
              </span>
              <button
                type="submit"
                disabled={!desc.trim() || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-6 p-4 border border-border rounded-lg bg-muted/30 text-center">
          <p className="text-muted-foreground">
            Please <span className="font-medium">sign in</span> to leave a comment.
          </p>
        </div>
      )}
      
      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading comments...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-2">Failed to load comments</p>
            <button 
              onClick={() => mutate()}
              className="text-primary hover:text-primary/80 text-sm underline"
            >
              Try again
            </button>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment: Comment) => (
            <div key={comment.id} className="p-3 rounded bg-muted/50">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-foreground font-semibold">
                  {comment.user?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(comment.createdAt.substring(0, 10))}
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                {comment.desc}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  )
}

export default CommentsSection
