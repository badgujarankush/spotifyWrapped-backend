import axios from 'axios';

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
  window.location = window.location.origin;
//   return;
};

const refreshToken = async () => {
  try {
    if (!LOCALSTORAGE_VALUES.refreshToken ||
        LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
        (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000
      ) {
        console.error('No refresh token available');
        logout();
      }
  
     //use refresh token from our node app
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`,
    );
    const { access_token,refresh_token } = data;
    // Update localStorage values
    window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, access_token);
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());
    window.localStorage.setItem(LOCALSTORAGE_KEYS.refreshToken,refresh_token);
    // Reload the page for localStorage updates to be reflected
    window.location.reload();
    // return;
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
