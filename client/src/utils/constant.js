export const HOST = `http://localhost:8747`

export const AUTH_ROUTE =  `/api/auth`
export const SIGN_UP_ROUTE = `${AUTH_ROUTE}/sign-up`
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`
export const GET_USER_INFO = `${AUTH_ROUTE}/user-info`
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTE}/remove-profile-image`;
export const SET_PROFILE_ROUTE = `${AUTH_ROUTE}/set-profile`;
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`;
export const GET_USER_INFO_BY_POSTID = `${AUTH_ROUTE}/get-user-info-by-postid`


export const POST_ROUTE = `/api/post`
export const POSTS_UPLOAD_ROUTE = `${POST_ROUTE}/post-upload`
export const REMOVE_POST_IMAGE_ROUTE = `${POST_ROUTE}/remove-image`
export const POST_DATA = `${POST_ROUTE}/post-data`
export const GET_ALL_POST = `${POST_ROUTE}/get-all-post`
export const DELETE_POST = `${POST_ROUTE}/delete-post`
export const GET_RANDOM_POST = `${POST_ROUTE}/get-random-posts`
export const GET_RANDOM_NETCLIPS = `${POST_ROUTE}/random-net-clips`



export const SEARCH_ROUTE = `/api/search`
export const SEARCH_INPUT_ROUTE = `${SEARCH_ROUTE}/search-data`
export const GET_POST_ROUTE = `${SEARCH_ROUTE}/get-posts`
export const GET_ONE_POST_ROUTE = `${SEARCH_ROUTE}/get-one-post`

export const SAVED_ROUTE = `/api/saved`
export const SAVE_POST_ROUTE = `${SAVED_ROUTE}/save-post`
export const UNSAVE_POST_ROUTE = `${SAVED_ROUTE}/unsave-post`
export const GET_INFO_ROUTE = `${SAVED_ROUTE}/get-info`
export const GET_USER_INFO_POST_ROUTE = `${SAVED_ROUTE}/get-user-info`



export const CONNECTION = `/api/connection`
export const CONNECTION_FOLLOW = `${CONNECTION}/follow`
export const CONNECTION_REQUEST_BACK = `${CONNECTION}/request-back`
export const CONNECTION_UNFOLLOW = `${CONNECTION}/unfollow`
export const CONNECTION_FIND_INCOMING_REQUEST = `${CONNECTION}/find-incoming-request`
export const CONNECTION_CONFIRM_REQUEST = `${CONNECTION}/confirm-request`
export const CONNECTION_DELETE_REQUEST = `${CONNECTION}/delete-request`
export const CONNECTION_FETCH_FOLLOWINGS = `${CONNECTION}/fetch-followings`
export const CONNECTION_FETCH_FOLLOWERS = `${CONNECTION}/fetch-followers`
export const CONNECTION_REMOVE_FOLLOWERS = `${CONNECTION}/remove-followers`

export const NET_CLIPS = `/api/net-clips`
export const FETCH_RANDOM_NET_CLIPS = `${NET_CLIPS}/random-net-clips`