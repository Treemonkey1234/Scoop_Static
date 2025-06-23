'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import { sampleUsers, sampleReviews, areUsersFriends, getUserFriends, getMutualFriends } from '@/lib/sampleData'
import { 
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  ChevronLeftIcon,
  UserPlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const user = sampleUsers.find(u => u.id === userId)
  const currentUser = sampleUsers[0] // Test User
  const isFriend = areUsersFriends(currentUser.id, userId)
  const userFriends = getUserFriends(userId)
  const mutualFriends = getMutualFriends(currentUser.id, userId)

  // Ensure userId is a string and exists
  if (!userId) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <h1 className="text-xl font-semibold text-slate-800 mb-2">Invalid User ID</h1>
          <p className="text-slate-600 mb-4">Please provide a valid user ID.</p>
          <button
            onClick={() => router.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </Layout>
    )
  }

  const userReviews = sampleReviews.filter(r => r.reviewedId === userId)

  const getSocialMediaUrl = (platform: string, handle: string): string => {
    switch (platform) {
      case 'Facebook':
        return `https://facebook.com/${handle}`
      case 'Twitter':
        return `https://twitter.com/${handle}`
      case 'Instagram':
        return `https://instagram.com/${handle}`
      case 'LinkedIn':
        return `https://linkedin.com/in/${handle}`
      case 'TikTok':
        return `https://tiktok.com/@${handle}`
      case 'YouTube':
        return `https://youtube.com/@${handle}`
      case 'GitHub':
        return `https://github.com/${handle}`
      case 'Discord':
        return `https://discord.com/users/${handle}`
      case 'Reddit':
        return `https://reddit.com/user/${handle}`
      case 'Twitch':
        return `https://twitch.tv/${handle}`
      case 'Pinterest':
        return `https://pinterest.com/${handle}`
      case 'Snapchat':
        return `https://snapchat.com/add/${handle}`
      case 'WhatsApp':
        return `https://wa.me/${handle}`
      case 'Telegram':
        return `https://t.me/${handle}`
      case 'BeReal':
        return `https://bere.al/${handle}`
      default:
        return '#'
    }
  }

  if (!user) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <h1 className="text-xl font-semibold text-slate-800 mb-2">User Not Found</h1>
          <p className="text-slate-600 mb-4">This user doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
          >
            <ChevronLeftIcon className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-semibold text-slate-800">Profile</h1>
        </div>

        {/* User Profile Card */}
        <div className="card-soft">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <Image
                src={user.avatar}
                alt={user.name}
                width={96}
                height={96}
                className="rounded-2xl"
              />
              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
            
            {/* Header Info */}
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">{user.name}</h1>
              <p className="text-slate-600 mb-2">@{user.name.toLowerCase().replace(/\s+/g, '_')}</p>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full font-medium">
                  {user.isVerified ? 'Verified User' : 'Standard User'}
                </span>
                <span className="text-sm px-3 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">
                  {user.trustScore >= 80 ? 'Premium' : 'Free'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 mb-2">
              <TrustBadge score={user.trustScore} />
            </div>
            
            <p className="text-slate-700 mb-4">{user.bio}</p>

            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 mb-6">
              <div className="flex items-center space-x-1">
                <MapPinIcon className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>Joined {user.joinDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <UserGroupIcon className="w-4 h-4" />
                <span>{user.friendsCount} friends</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {!isFriend ? (
                <button className="flex-1 btn-primary">
                  <UserPlusIcon className="w-4 h-4 mr-2" />
                  Add Friend
                </button>
              ) : (
                <button className="flex-1 btn-secondary">
                  <UserGroupIcon className="w-4 h-4 mr-2" />
                  Friends
                </button>
              )}
              {isFriend && (
                <Link
                  href={`/create-post?reviewFor=${user.id}`}
                  className="flex-1 btn-primary flex items-center justify-center"
                >
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Write Review
                </Link>
              )}
              {!isFriend && (
                <button className="flex-1 btn-secondary">
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Reviews Only for Friends
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trust Score Display */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Trust Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Trust Level</span>
              <span className="text-sm font-medium text-slate-800 capitalize">
                {user.trustScore >= 90 ? 'excellent' : user.trustScore >= 70 ? 'good' : user.trustScore >= 50 ? 'fair' : user.trustScore >= 30 ? 'poor' : 'new'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Reviews Given</span>
              <span className="text-sm font-medium text-slate-800">{user.reviewsCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Events Attended</span>
              <span className="text-sm font-medium text-slate-800">{user.eventsAttended}</span>
            </div>
          </div>
        </div>

        {/* Social Accounts */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-800 mb-3">Connected Accounts</h4>
          {Object.entries(user.socialLinks).map(([platform, handle], index) => (
            handle && (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {platform === 'instagram' ? '📸' : platform === 'twitter' ? '🐦' : platform === 'linkedin' ? '💼' : '🔗'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 capitalize">{platform}</div>
                    <div className="text-sm text-slate-600">{handle}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-xs text-green-600 font-medium">Connected</span>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Friends Section */}
        {isFriend && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800">Friends ({userFriends.length})</h4>
            
            {mutualFriends.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-slate-600 mb-2">
                  Mutual Friends ({mutualFriends.length})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {mutualFriends.slice(0, 5).map(friend => (
                    <Link
                      key={friend.id}
                      href={`/user/${friend.id}`}
                      className="flex items-center space-x-2 bg-cyan-50 hover:bg-cyan-100 rounded-lg px-3 py-2 transition-colors"
                    >
                      <Image
                        src={friend.avatar}
                        alt={friend.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-sm font-medium text-cyan-700">{friend.name}</span>
                    </Link>
                  ))}
                  {mutualFriends.length > 5 && (
                    <span className="text-sm text-slate-500 px-3 py-2">
                      +{mutualFriends.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {userFriends.slice(0, 6).map(friend => (
                <Link
                  key={friend.id}
                  href={`/user/${friend.id}`}
                  className="flex items-center space-x-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Image
                    src={friend.avatar}
                    alt={friend.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{friend.name}</p>
                    <p className="text-xs text-slate-500">Trust: {friend.trustScore}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            {userFriends.length > 6 && (
              <button className="w-full text-center text-sm text-cyan-600 hover:text-cyan-700 py-2">
                View All {userFriends.length} Friends
              </button>
            )}
          </div>
        )}

        {!isFriend && (
          <div className="text-center py-8 bg-slate-50 rounded-lg">
            <UserGroupIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 mb-2">Friends List Private</p>
            <p className="text-sm text-slate-500">
              Add {user.name} as a friend to see their friends list
            </p>
          </div>
        )}

        {/* Recent Reviews */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Reviews ({userReviews.length})
          </h3>
          
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.slice(0, 3).map((review) => {
                const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
                return (
                  <div key={review.id} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-start space-x-3">
                      {reviewer && (
                        <Image
                          src={reviewer.avatar}
                          alt={reviewer.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-slate-800">{reviewer?.name || 'Anonymous'}</h4>
                          <span className={`text-sm ${review.votes > 0 ? 'text-trust-excellent' : review.votes < 0 ? 'text-orange-500' : 'text-slate-500'}`}>
                            ({review.votes > 0 ? `+${review.votes}` : review.votes} votes)
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{review.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span>{review.category}</span>
                          <span>{new Date(review.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {userReviews.length > 3 && (
                <button className="w-full py-3 text-primary-600 hover:text-primary-700 font-medium text-sm">
                  View All Reviews ({userReviews.length})
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <StarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No reviews yet</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Activity Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-800">{userReviews.length}</div>
              <div className="text-sm text-slate-500">Reviews Received</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-800">
                {userReviews.length > 0 
                  ? Math.round(userReviews.reduce((acc, r) => acc + (r.votes > 0 ? r.votes : 0), 0) / userReviews.length)
                  : 0
                }
              </div>
              <div className="text-sm text-slate-500">Average Positive Votes</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 