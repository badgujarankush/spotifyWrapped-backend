# Spotify Wrapped
This web-app shows users Top Artists, Top Songs, Favourite Genres, Recently Played Songs
and Playlists


# PREVIEW
![project-image](/Demo/Dashboard.png)
![project-image](/Demo/Top%20Artists.png)
![project-image](/Demo/Top%20Songs.png)
![project-image](/Demo/Favourite%20Genres.png)
![project-image](/Demo/Recently%20Played.png)
![project-image](/Demo/Landing%20Page.png)




## Local Installation & Set Up

1. Register a Spotify App in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and add `http://localhost:8888/callback` as a Redirect URI in the app settings

2. Create a `.env` file at the root of the project based on `.env.example` and add your unique `CLIENT_ID` and `CLIENT_SECRET` from the Spotify dashboard

3. Install dependencies

    ```shell
    npm install
    ```

4. Run the React app on <http://localhost:3000> and the Node server on <http://localhost:8888>

    ```shell
    npm start
    ```