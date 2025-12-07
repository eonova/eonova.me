import type { Inputs, Outputs } from '../client'

import {
  deleteComment as deleteCommentAdmin,
  deleteUser as deleteUserAdmin,
  getDashboardStats,
  getRecentActivity,
  listAllAlbum,
  listAllComments,
  listAllFriends as listAllFriendsAdmin,
  listAllTalks as listAllTalksAdmin,
  listAllUsers,
  updateUser as updateUserAdmin,
} from './admin.router'
import { generate } from './ai.router'
import { addImage, deleteImage, listAllImages, updateImage } from './album.router'
import { listSessions, revokeSession, updateUser } from './auth.router'
import { countComments, createComment, deleteComment, listComments } from './comment.router'
import { createFriend, deleteFriend, listAllFriends, updateFriend } from './friend.router'
import { githubStats } from './github.router'
import { countLike, incrementLike } from './like.router'
import { createMessage, deleteMessage, listMessages } from './message.router'
import { listAllPlaylistSongs } from './music.router'
import { listNeoDBShelf } from './neodb.router'
import { bySlug as getNoteBySlug, likesStats as likeNoteStats, viewsStats as viewNoteStats } from './note.router'
import { bySlug as getPostBySlug, likesStats as likePostStats, viewsStats as viewPostStats } from './post.router'
import { getAvatarUploadUrl } from './r2.router'
import { countReplies } from './reply.router'
import { getSearchSuggestions, searchContent } from './search.router'
import { getSettings, updateSettings } from './settings.router'
import { spotifyStats } from './spotify.router'
import { createTalk, deleteTalk, likesStats as likeTalkStats, listAllTalks, updateTalk, viewsStats as viewTalkStats } from './talk.router'
import { getReplyPrefs, updateCommentReplyPrefs, updateReplyPrefs } from './unsubscribe.router'
import { upload } from './upyun.router'
import { countView, incrementView } from './view.router'
import { createVote } from './vote.router'
import { wakatimeStats } from './wakatime.router'
import { youtubeStats } from './youtube.router'

export const router = {
  stats: {
    github: githubStats,
    youtube: youtubeStats,
    wakatime: wakatimeStats,
    spotify: spotifyStats,
    posts: {
      views: viewPostStats,
      likes: likePostStats,
    },
    notes: {
      views: viewNoteStats,
      likes: likeNoteStats,
    },
    talks: {
      views: viewTalkStats,
      likes: likeTalkStats,
    },
  },
  posts: {
    bySlug: getPostBySlug,
    views: {
      count: countView,
      increment: incrementView,
    },
    likes: {
      count: countLike,
      increment: incrementLike,
    },
    comments: {
      list: listComments,
      create: createComment,
      delete: deleteComment,
      count: countComments,
    },
    replies: {
      count: countReplies,
    },
    votes: {
      create: createVote,
    },
  },
  notes: {
    bySlug: getNoteBySlug,
    views: {
      count: countView,
      increment: incrementView,
    },
    likes: {
      count: countLike,
      increment: incrementLike,
    },
    comments: {
      list: listComments,
      create: createComment,
      delete: deleteComment,
      count: countComments,
    },
    replies: {
      count: countReplies,
    },
    votes: {
      create: createVote,
    },
  },
  talks: {
    list: listAllTalks,
    create: createTalk,
    delete: deleteTalk,
    update: updateTalk,
    views: {
      count: countView,
      increment: incrementView,
    },
    likes: {
      count: countLike,
      increment: incrementLike,
    },
    comments: {
      list: listComments,
      create: createComment,
      delete: deleteComment,
      count: countComments,
    },
    replies: {
      count: countReplies,
    },
    votes: {
      create: createVote,
    },
  },
  messages: {
    list: listMessages,
    create: createMessage,
    delete: deleteMessage,
  },
  admin: {
    stats: {
      dashboard: getDashboardStats,
      recentActivity: getRecentActivity,
    },
    comments: {
      list: listAllComments,
      delete: deleteCommentAdmin,
    },
    users: {
      list: listAllUsers,
      delete: deleteUserAdmin,
      update: updateUserAdmin,
    },
    album: {
      list: listAllAlbum,
      create: addImage,
      update: updateImage,
      delete: deleteImage,
    },
    friends: {
      list: listAllFriendsAdmin,
      create: createFriend,
      update: updateFriend,
      delete: deleteFriend,
    },
    talks: {
      list: listAllTalksAdmin,
      create: createTalk,
      update: updateTalk,
      delete: deleteTalk,
    },
  },
  auth: {
    listSessions,
    revokeSession,
    updateUser,
  },
  r2: {
    getAvatarUploadUrl,
  },
  unsubscribes: {
    getReplyPrefs,
    updateReplyPrefs,
    updateCommentReplyPrefs,
  },
  settings: {
    get: getSettings,
    update: updateSettings,
  },
  friends: {
    listAllFriends,
    createFriend,
    deleteFriend,
    updateFriend,
  },
  album: {
    listAllImages,
  },
  music: {
    list: listAllPlaylistSongs,
  },
  search: {
    searchContent,
    getSearchSuggestions,
  },
  neodb: {
    list: listNeoDBShelf,
  },
  upyun: {
    upload,
  },
  ai: {
    generate,
  },
}

export type ListCommentsInput = Inputs['posts']['comments']['list']
export type ListCommentsOutput = Outputs['posts']['comments']['list']

export type ListMessagesOutput = Outputs['messages']['list']

export type ListAllCommentsOutput = Outputs['admin']['comments']['list']
export type ListAllUsersOutput = Outputs['admin']['users']['list']
export type ListAllFriendsOutput = Outputs['admin']['friends']['list']
export type ListAllAlbumOutput = Outputs['admin']['album']['list']

export type CountViewOutput = Outputs['posts']['views']['count']

export type ListSessionsOutput = Outputs['auth']['listSessions']
