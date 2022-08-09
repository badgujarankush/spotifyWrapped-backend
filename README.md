# Spotify Wrapped
This web-app shows users Top Artists, Top Songs, Favourite Genres, Recently Played Songs
and Playlists


# PREVIEW
![Dashboard](https://user-images.githubusercontent.com/62606523/183626505-ed4156b9-83e6-4e3c-b649-f3220b949a8d.png)
![Top Artists](https://user-images.githubusercontent.com/62606523/183626545-95bd19e7-d379-413f-9186-7814da33d8d4.png)
![Top Songs](https://user-images.githubusercontent.com/62606523/183626571-f9380a69-73ea-406a-802b-d8425f9f8a15.png)
![Favourite Genres](https://user-images.githubusercontent.com/62606523/183626607-881812ef-93b4-4c06-8cce-9164fdbfb034.png)
![Recently Played](https://user-images.githubusercontent.com/62606523/183626637-12fc9163-895f-469d-9914-6795bc784665.png)





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
