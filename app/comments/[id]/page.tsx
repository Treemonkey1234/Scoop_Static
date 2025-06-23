'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Layout from '../../../components/Layout'
import { sampleReviews, sampleUsers, sampleEvents } from '../../../lib/sampleData'
import TrustBadge from '../../../components/TrustBadge'
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'

export default function CommentThreadPage() {
  const params = useParams()
  const reviewId = params.id as string
  
  const [newComment, setNewComment] = useState('')
  const [likedComments, setLikedComments] = useState<{[key: string]: boolean}>({})
  const [votedComments, setVotedComments] = useState<{[key: string]: 'up' | 'down' | undefined}>({})

  // Find the review
  const review = sampleReviews.find(r => r.id === reviewId)
  if (!review) {
    return (
      <Layout>
        <div className="p-4">
          <div className="card-soft text-center py-12">
            <h1 className="text-xl font-semibold text-slate-800 mb-2">Review Not Found</h1>
            <p className="text-slate-600">The review you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    )
  }

  const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
  const reviewed = sampleUsers.find(u => u.id === review.reviewedId)
  
  // Get event details if this is an event review
  const event = review.isEventReview && review.eventId ? 
    sampleEvents.find(e => e.id === review.eventId) : null

  // Sample comments for this review
  const comments = [
    {
      id: '1',
      userId: '3',
      content: 'Completely agree! Sarah really knows her stuff when it comes to UX design.',
      timestamp: '2025-06-16T08:30:00Z',
      upvotes: 5,
      downvotes: 0,
      replies: []
    },
    {
      id: '2', 
      userId: '4',
      content: 'Thanks for sharing this review! I\'ve been looking for a good designer.',
      timestamp: '2025-06-16T14:20:00Z',
      upvotes: 2,
      downvotes: 0,
      replies: [
        {
          id: '3',
          userId: '1',
          content: 'Happy to help! Sarah is definitely worth reaching out to.',
          timestamp: '2025-06-16T15:45:00Z',
          upvotes: 3,
          downvotes: 0,
          replies: []
        }
      ]
    }
  ]

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  const handleVoteComment = (commentId: string, voteType: 'up' | 'down') => {
    setVotedComments(prev => ({
      ...prev,
      [commentId]: prev[commentId] === voteType ? undefined : voteType
    }))
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // In a real app, this would post to an API
      console.log('New comment:', newComment)
      setNewComment('')
    }
  }

  const renderComment = (comment: any, isReply = false) => {
    const commenter = sampleUsers.find(u => u.id === comment.userId)
    if (!commenter) return null

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
        <div className="card-soft">
          <div className="flex space-x-3">
            {/* Comment Content */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Image
                  src={commenter.avatar}
                  alt={commenter.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <Link href={`/user/${commenter.id}`}>
                  <span className="font-medium text-slate-800 hover:text-cyan-600 transition-colors duration-200">
                    {commenter.name}
                  </span>
                </Link>
                <TrustBadge score={commenter.trustScore} size="sm" />
                <span className="text-xs text-slate-500">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-slate-700 mb-3">{comment.content}</p>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition-colors duration-200"
                >
                  {likedComments[comment.id] ? (
                    <HeartIconSolid className="w-4 h-4 text-red-500" />
                  ) : (
                    <HeartIcon className="w-4 h-4" />
                  )}
                  <span className="text-xs">Like</span>
                </button>
                <button className="flex items-center space-x-1 text-slate-500 hover:text-primary-500 transition-colors duration-200">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  <span className="text-xs">Reply</span>
                </button>
              </div>
            </div>

            {/* Voting - Right Side Vertical */}
            <div className="flex flex-col items-center space-y-1 pl-3 border-l border-slate-200">
              <button
                onClick={() => handleVoteComment(comment.id, 'up')}
                className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center ${
                  votedComments[comment.id] === 'up' 
                    ? 'bg-pink-200 scale-110' 
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <svg 
                  width="16" 
                  height="20" 
                  viewBox="0 0 20 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="transform"
                >
                  {/* Upward pointing ice cream cone */}
                  <defs>
                    <linearGradient id="commentUpConeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D2691E"/>
                      <stop offset="50%" stopColor="#CD853F"/>
                      <stop offset="100%" stopColor="#8B4513"/>
                    </linearGradient>
                    <linearGradient id="commentUpScoopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF8DC"/>
                      <stop offset="30%" stopColor="#FFFACD"/>
                      <stop offset="70%" stopColor="#F0E68C"/>
                      <stop offset="100%" stopColor="#DAA520"/>
                    </linearGradient>
                    <radialGradient id="commentUpScoopRadial" cx="40%" cy="30%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.8)"/>
                      <stop offset="60%" stopColor="rgba(255,255,255,0.3)"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                    </radialGradient>
                  </defs>
                  
                  {/* Cone pointing up */}
                  <path 
                    d="M6 14 L10 4 L14 14 Z" 
                    fill="url(#commentUpConeGrad)"
                    stroke="#8B4513"
                    strokeWidth="0.6"
                  />
                  
                  {/* Waffle pattern */}
                  <g stroke="#654321" strokeWidth="0.3" opacity="0.7">
                    <line x1="6.5" y1="13" x2="13.5" y2="13"/>
                    <line x1="7" y1="11.5" x2="13" y2="11.5"/>
                    <line x1="7.5" y1="10" x2="12.5" y2="10"/>
                    <line x1="8" y1="8.5" x2="12" y2="8.5"/>
                    <line x1="8.5" y1="7" x2="11.5" y2="7"/>
                    
                    <line x1="7.5" y1="13.5" x2="9" y2="10"/>
                    <line x1="9" y1="13.5" x2="10.5" y2="10"/>
                    <line x1="10.5" y1="13.5" x2="12" y2="10"/>
                  </g>
                  
                  {/* Ice cream scoop */}
                  <circle 
                    cx="10" 
                    cy="16" 
                    r="5.5" 
                    fill="url(#commentUpScoopGrad)"
                    stroke="#DAA520"
                    strokeWidth="0.2"
                  />
                  
                  {/* Radial highlight */}
                  <circle 
                    cx="10" 
                    cy="16" 
                    r="5.3" 
                    fill="url(#commentUpScoopRadial)"
                  />
                  
                  {/* Main highlight */}
                  <ellipse 
                    cx="8.5" 
                    cy="14.5" 
                    rx="2" 
                    ry="2.5" 
                    fill="rgba(255,255,255,0.6)"
                    opacity="0.8"
                  />
                </svg>
              </button>
              <span className="text-xs font-medium text-slate-600 min-w-[1.5rem] text-center">
                {comment.upvotes - comment.downvotes}
              </span>
              <button
                onClick={() => handleVoteComment(comment.id, 'down')}
                className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center ${
                  votedComments[comment.id] === 'down' 
                    ? 'bg-blue-200 scale-110' 
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <svg 
                  width="16" 
                  height="20" 
                  viewBox="0 0 20 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="transform rotate-180"
                >
                  {/* Downward pointing ice cream cone */}
                  <defs>
                    <linearGradient id="commentDownConeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D2691E"/>
                      <stop offset="50%" stopColor="#CD853F"/>
                      <stop offset="100%" stopColor="#8B4513"/>
                    </linearGradient>
                    <linearGradient id="commentDownScoopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#87CEEB"/>
                      <stop offset="30%" stopColor="#B0E0E6"/>
                      <stop offset="70%" stopColor="#4682B4"/>
                      <stop offset="100%" stopColor="#1E90FF"/>
                    </linearGradient>
                    <radialGradient id="commentDownScoopRadial" cx="40%" cy="30%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
                      <stop offset="60%" stopColor="rgba(255,255,255,0.4)"/>
                      <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                    </radialGradient>
                  </defs>
                  
                  {/* Cone pointing up (will be rotated) */}
                  <path 
                    d="M6 14 L10 4 L14 14 Z" 
                    fill="url(#commentDownConeGrad)"
                    stroke="#8B4513"
                    strokeWidth="0.6"
                  />
                  
                  {/* Waffle pattern */}
                  <g stroke="#654321" strokeWidth="0.3" opacity="0.7">
                    <line x1="6.5" y1="13" x2="13.5" y2="13"/>
                    <line x1="7" y1="11.5" x2="13" y2="11.5"/>
                    <line x1="7.5" y1="10" x2="12.5" y2="10"/>
                    <line x1="8" y1="8.5" x2="12" y2="8.5"/>
                    <line x1="8.5" y1="7" x2="11.5" y2="7"/>
                    
                    <line x1="7.5" y1="13.5" x2="9" y2="10"/>
                    <line x1="9" y1="13.5" x2="10.5" y2="10"/>
                    <line x1="10.5" y1="13.5" x2="12" y2="10"/>
                  </g>
                  
                  {/* Ice cream scoop (blue theme) */}
                  <circle 
                    cx="10" 
                    cy="16" 
                    r="5.5" 
                    fill="url(#commentDownScoopGrad)"
                    stroke="#1E90FF"
                    strokeWidth="0.2"
                  />
                  
                  {/* Radial highlight */}
                  <circle 
                    cx="10" 
                    cy="16" 
                    r="5.3" 
                    fill="url(#commentDownScoopRadial)"
                  />
                  
                  {/* Main highlight */}
                  <ellipse 
                    cx="8.5" 
                    cy="14.5" 
                    rx="2" 
                    ry="2.5" 
                    fill="rgba(255,255,255,0.7)"
                    opacity="0.9"
                  />
                  
                  {/* Ice crystals for frozen effect */}
                  <g fill="rgba(255,255,255,0.8)" opacity="0.6">
                    <circle cx="7.5" cy="15.5" r="0.2"/>
                    <circle cx="12" cy="14" r="0.15"/>
                    <circle cx="9" cy="17.5" r="0.18"/>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Render replies */}
        {comment.replies && comment.replies.map((reply: any) => renderComment(reply, true))}
      </div>
    )
  }

  return (
    <Layout>
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800 mb-2">Comment Thread</h1>
          <p className="text-slate-600">Join the conversation</p>
        </div>

        {/* Original Review */}
        <div className="card-soft mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Image
              src={reviewer?.avatar || ''}
              alt={reviewer?.name || ''}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <Link href={`/user/${reviewer?.id}`}>
                <h3 className="font-semibold text-slate-800 hover:text-cyan-600 transition-colors duration-200">
                  {reviewer?.name}
                </h3>
              </Link>
              <p className="text-sm text-slate-500">
                reviewed{' '}
                <Link href={`/user/${reviewed?.id}`}>
                  <span className="hover:text-cyan-600 transition-colors duration-200">
                    {reviewed?.name}
                  </span>
                </Link>
                {' '}• {new Date(review.timestamp).toLocaleDateString()}
              </p>
            </div>
            <TrustBadge score={reviewer?.trustScore || 0} size="sm" />
          </div>
          
          <div className="mb-4">
            <span className="text-sm font-medium px-2 py-1 rounded-full text-primary-600 bg-primary-50">
              {review.category}
            </span>
          </div>
          
          <p className="text-slate-700 mb-4">{review.content}</p>
          
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <span className={`${review.votes > 0 ? 'text-trust-excellent' : review.votes < 0 ? 'text-orange-500' : 'text-slate-500'}`}>
              {review.votes > 0 ? `+${review.votes}` : review.votes} votes
            </span>
          </div>
        </div>

        {/* Event Details - Only show for event reviews */}
        {event && (
          <div className="card-soft mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              <h3 className="font-semibold text-slate-800">Event Details</h3>
            </div>
            
            <div className="flex items-start space-x-4">
              <Image
                src={event.imageUrl}
                alt={event.title}
                width={80}
                height={80}
                className="rounded-xl object-cover"
              />
              <div className="flex-1">
                <Link 
                  href={`/events/${event.id}`}
                  className="block hover:text-cyan-600 transition-colors"
                >
                  <h4 className="font-semibold text-slate-800 mb-1">{event.title}</h4>
                </Link>
                <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>📅 {event.date}</span>
                  <span>🕐 {event.time}</span>
                  <span>📍 {event.location}</span>
                  <span className="px-2 py-1 bg-slate-100 rounded-full">
                    {event.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Comments ({comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0)})
          </h2>
          
          {comments.map(comment => renderComment(comment))}
        </div>

        {/* Add Comment */}
        <div className="card-soft">
          <h3 className="font-semibold text-slate-800 mb-3">Add a comment</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-slate-500">
              Be respectful and constructive
            </span>
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
} 