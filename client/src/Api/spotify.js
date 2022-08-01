import axios from 'axios';
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timeStamp: 'spotify_token_timestamp',
};

const EXPIRATION_TIME = 3600 * 1000;

const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timeStamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timeStamp),
};

export const logout = () => {
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  window.location = window.location.reload();
  return;
};

const refreshToken = async () => {
  try {
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`,
    );
    const { access_token } = data;
    // Update localStorage values
    window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, access_token);
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());

    // Reload the page for localStorage updates to be reflected
    window.location.reload();
    return;
  } catch (e) {
    console.error(e);
  }
};

const getAccessToken = () => {
  const query = new URLSearchParams(window.location.search);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: query.get('access_token'),
    [LOCALSTORAGE_KEYS.refreshToken]: query.get('refresh_token'),
    [LOCALSTORAGE_KEYS.expireTime]: query.get('expires_in'),
  };

  if (Date.now() - Number(LOCALSTORAGE_VALUES.timeStamp) > EXPIRATION_TIME) {
    console.warn('Access token has expired, refreshing...');
    refreshToken();
  }

  const localAccessToken = Number(LOCALSTORAGE_VALUES.accessToken);
  if (
    (!localAccessToken || localAccessToken === 'undefined') &&
    queryParams[LOCALSTORAGE_KEYS.accessToken]
  ) {
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }

    window.localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());

    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  return localAccessToken;
};

export const accessToken = getAccessToken();

// const spotifyApiHeaders = {
//   'Authorization' : `Bearer ${accessToken}`,
//   'Content-Type': 'application/json',
// };
// const createRequest = (url) => ({ url, headers: spotifyApiHeaders });

// export const spotifyApi = createApi({
//   reducerPath: "spotifyApi",
//   baseQuery: fetchBaseQuery({ baseUrl: "https://api.spotify.com/v1" }),
//   mode: "no-cors",
//   endpoints: (builder) => ({
//     getUser: builder.query({
//       query: () => createRequest(`/me`),
//     }),
//     getUserPlaylist: builder.query({
//       query: (user_id) => createRequest(`/users/${user_id}/playlists`)
//     }),
//     getTopArtists: builder.query({
//       query: ({limit,offset,range}) =>createRequest(`/me/top/artists?limit=${limit}&offset=${offset}&time_range=${range}`)
//     }),
//     getTopSongs: builder.query({
//       query: ({limit,offset,range}) =>createRequest(`/me/top/tracks?limit=${limit}&offset=${offset}&time_range=${range}`)
//     }),
//     getRecentlyPlayed: builder.query({
//       query: (limit) =>createRequest(`/me/player/recently-played?limit=${limit}`)
//     })
//   }),
// });

// export const {useGetUserQuery,useGetUserPlaylistQuery, useGetTopArtistsQuery, useGetTopSongsQuery,useGetRecentlyPlayedQuery}  = spotifyApi;