import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from 'axios';

// function to extract the required query params from the url after hash
const getHashParams = () => {
  const hashParams = {};
  let e;
  const r = /([^&;=]+)=?([^&;]*)/g;
  const q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
};

// Expiration time of token
const EXPIRATION_TIME = 3600 * 1000; // 3600 seconds * 1000 = 1 hour in milliseconds

// Setters for time stamp, accessToken and refreshToken

const setTokenTimestamp = () => window.localStorage.setItem('spotify_token_timestamp', Date.now());
const setLocalAccessToken = token => {
  setTokenTimestamp();
  window.localStorage.setItem('spotify_access_token', token);
};
const setLocalRefreshToken = token => window.localStorage.setItem('spotify_refresh_token', token);

// Getters for time stamp, accessToken and refreshToken
const getTokenTimestamp = () => window.localStorage.getItem('spotify_token_timestamp');
const getLocalAccessToken = () => window.localStorage.getItem('spotify_access_token');
const getLocalRefreshToken = () => window.localStorage.getItem('spotify_refresh_token');

// Refresh the token
const refreshAccessToken = async () => {
  try {
    const { data } = await axios.get(`/refresh_token?refresh_token=${getLocalRefreshToken()}`);
    const { access_token } = data;
    // set new access Token in the local storage
    setLocalAccessToken(access_token);

    // reload the page to reflect changes
    window.location.reload();
    return;
  } catch (e) {
    console.error(e);
  }
};

// Get access token

export const getAccessToken = () => {
  // Get access token off of query params from url
  const { error, access_token, refresh_token } = getHashParams();

  if (error) {
    console.error(error);
    refreshAccessToken();
  }

  // If token has expired
  if (Date.now() - getTokenTimestamp() > EXPIRATION_TIME) {
    console.warn('Access token has expired, refreshing...');
    refreshAccessToken();
  }

  const localAccessToken = getLocalAccessToken();

  // If there is no ACCESS token in local storage, set it and return `access_token` from params
  // also if user logs in for first time
  if ((!localAccessToken || localAccessToken === 'undefined') && access_token) {
    setLocalAccessToken(access_token);
    setLocalRefreshToken(refresh_token);
    return access_token;
  }

  return localAccessToken;
};

export const accessToken  = getAccessToken();

// Logout function , removes all the items from local storage
export const logout = () => {
  window.localStorage.removeItem('spotify_token_timestamp');
  window.localStorage.removeItem('spotify_access_token');
  window.localStorage.removeItem('spotify_refresh_token');
  window.location.reload();
};

// Headers for API to fetch info from different endpoints
const spotifyApiHeaders = {
  'Authorization' : "Bearer " + accessToken,
};
const createRequest = (url) => ({ url, headers: spotifyApiHeaders });

export const spotifyApi = createApi({
  reducerPath: "spotifyApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.spotify.com/v1" }),
  mode: "no-cors",
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => createRequest(`/me`),
    }),
    getUserPlaylist: builder.query({
      query: (user_id) => createRequest(`/users/${user_id}/playlists`)
    }),
    getTopArtists: builder.query({
      query: ({limit,offset,range}) =>createRequest(`/me/top/artists?limit=${limit}&offset=${offset}&time_range=${range}`)
    }),
    getTopSongs: builder.query({
      query: ({limit,offset,range}) =>createRequest(`/me/top/tracks?limit=${limit}&offset=${offset}&time_range=${range}`)
    }),
    getRecentlyPlayed: builder.query({
      query: (limit) =>createRequest(`/me/player/recently-played?limit=${limit}`)
    })
  }),
});

export const {useGetUserQuery,useGetUserPlaylistQuery, useGetTopArtistsQuery, useGetTopSongsQuery,useGetRecentlyPlayedQuery}  = spotifyApi;