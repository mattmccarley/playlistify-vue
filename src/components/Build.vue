<template>
  <div>
    <!-- First choice: what type of playlist do you want to create? -->
    <v-layout row wrap v-if="buildProcess === null">
      <v-flex s12 sm8 md6 lg4 offset-sm2 offset-md3 offset-lg4>
        <v-card class="ma-2" hover
          v-on:click.native="
            buildProcess = 'magic';
            getMagicPlaylistCategories();
          "
        >
          <v-card-title>
            <div>
              <h3 class="teal--text text--accent-4">Spotify Playlist</h3>
              <div>Use a Spotify Playlist as your seed to discover similar music.</div>
            </div>
          </v-card-title>
        </v-card>
        <v-card class="ma-2" hover
          v-on:click.native="
            buildProcess = 'useMySavedTracks';
          "
        >
          <v-card-title>
            <div>
              <h3 class="teal--text text--accent-4">
                My Saved Tracks
              </h3>
              <div>
                Use your saved tracks (library) to discover music to the songs you know you love.
              </div>
            </div>
          </v-card-title>
        </v-card>

        <v-card class="ma-2" hover
          v-on:click.native="
            buildProcess = 'simple';
            getTopArtists();
          "
        >
          <v-card-title>
            <div>
              <h3 class="teal--text text--accent-4">
                Custom Seeds
              </h3>
              <div>
                Choose a favorite artist, track, or genre to create a new playlist--add modifications to taylor the playlist for the moment.
              </div>
            </div>
          </v-card-title>
        </v-card>

      </v-flex>
    </v-layout>

    <!-- Playlist Path -->
    <v-layout row>
      <v-flex xs12 sm8 md6 lg4 offset-sm2 offset-md3 offset-lg4>
        <div v-if="accessToken !== null && buildProcess === 'magic'">
          <v-stepper v-model="decisionStep" vertical>
            <v-stepper-step step="1" :complete="decisionStep > 1">
            Playlist Type
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-list>
                <template v-if="magicPlaylistCategories !== null">
                  <v-list-tile avatar v-for="category in magicPlaylistCategories" :key="category.id"
                    v-on:click="
                      getMagicPlaylists(category.id);
                      decisionStep = 2;
                    "
                  >
                    <v-list-tile-avatar>
                      <img :src="category.icons[0].url">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="category.name"></v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-list>
            </v-stepper-content>

            <v-stepper-step step="2" :complete="decisionStep > 2">
              Choose Playlist Seed
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-layout row wrap v-if="magicPlaylists !== null">
                <v-flex xs6
                  v-for="playlist in magicPlaylists"
                  :key="playlist.id"
                  v-on:click="
                    chosenMagicPlaylist = playlist.id;
                    decisionStep = 3;
                    fireGAEvent('Magic Playlist', 'selected', 'positive', 1);
                  "
                >
                  <div class="ma-2" style="cursor: pointer; max-width: 300px">
                    <img :src="playlist.images[0].url" class="elevation-2" style="width: 100%">
                  </div>
                </v-flex>
              </v-layout>
            </v-stepper-content>

            <v-stepper-step
              step="3"
              :complete="decisionStep > 3"
            >
              Add Modifiers
            </v-stepper-step>
            <v-stepper-content
              step="3"
              class="text-xs-center"
            >
              <div
                v-if="targetAcousticness === null && modifierStep === 1"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Acousticness Modifier', 'acoustic', 'positive', 1);
                    targetAcousticness = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 2;
                  "
                >
                  acoustic
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Acousticness Modifier', 'electric', 'positive', 1);
                    targetAcousticness = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 2;
                  "
                >
                  electric
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Acousticness Modifier', 'do not care', 'positive', 1);
                    targetAcousticness = 'na';
                    modifierStep = 2;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetDanceability === null && modifierStep === 2"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Danceability Modifier', 'dancing', 'positive', 1);
                    targetDanceability = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 3;
                  "
                >
                  dancing
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Danceability Modifier', 'chillin', 'positive', 1);
                    targetDanceability = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 3;
                  "
                >
                  chillin
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Danceability Modifier', 'do not care', 'positive', 1);
                    targetDanceability = 'na';
                    modifierStep = 3;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetEnergy === null && modifierStep === 3"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Energy Modifier', 'energetic', 'positive', 1);
                    targetEnergy = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 4;
                  "
                >
                  energetic
                </v-btn>

                <span>
                  vs.
                </span>

                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Energy Modifier', 'sluggish', 'positive', 1);
                    targetEnergy = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 4;
                  "
                >
                  sluggish
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Energy Modifier', 'do not care', 'positive', 1);
                    targetEnergy = 'na';
                    modifierStep = 4;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetInstrumentalness === null && modifierStep === 4"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Instrumentalness Modifier', 'instrumental', 'positive', 1);
                    targetInstrumentalness = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 5;
                  "
                >
                  instrumental
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Instrumentalness Modifier', 'vocal', 'positive', 1);
                    targetInstrumentalness = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 5;
                  "
                  style="min-width: 0"
                >
                  vocal
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Instrumentalness Modifier', 'do not care', 'positive', 1);
                    targetInstrumentalness = 'na';
                    modifierStep = 5;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetLoudness === null && modifierStep === 5"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Loudness Modifier', 'loud', 'positive', 1);
                    targetLoudness = (Math.floor(Math.random() * (15 - 0 + 1) + 0) * -1);
                    modifierStep = 6;
                  "
                >
                  loud
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Loudness Modifier', 'quiet', 'positive', 1);
                    targetLoudness = (Math.floor(Math.random() * (60 - 45 + 1) + 45) * -1);
                    modifierStep = 6;
                  "
                >
                  quiet
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Loudness Modifier', 'do not care', 'positive', 1);
                    targetLoudness = 'na';
                    modifierStep = 6;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetPopularity === null && modifierStep === 6"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Popularity Modifier', 'popular', 'positive', 1);
                    targetPopularity = (Math.floor(Math.random() * (100 - 70 + 1) + 70));
                    modifierStep = 7;
                  "
                >
                  popular
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Popularity Modifier', 'obscure', 'positive', 1);
                    targetPopularity = (Math.floor(Math.random() * (30 - 0 + 1) + 0));
                    modifierStep = 7;
                  "
                >
                  obscure
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Popularity Modifier', 'do not care', 'positive', 1);
                    targetPopularity = 'na';
                    modifierStep = 7;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetValence === null && modifierStep === 7"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Valence Modifier', 'happy', 'positive', 1);
                    targetValence = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 8;
                    decisionStep = 4;
                    setRecommendationsOptions();
                  "
                >
                  happy
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Valence Modifier', 'sad', 'positive', 1);
                    targetValence = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 8;
                    decisionStep = 4;
                    setRecommendationsOptions();
                  "
                >
                  sad
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Valence Modifier', 'do not care', 'positive', 1);
                    targetValence = 'na';
                    modifierStep = 8;
                    decisionStep = 4;
                    setRecommendationsOptions();
                  "
                >
                  don't care
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step
              step="4"
              :complete="decisionStep > 4"
            >
              Preview
            </v-stepper-step>
            <v-stepper-content step="4">
              <v-progress-linear :indeterminate="true" v-if="recommendedTracks === null"></v-progress-linear>
              <v-list two-line
                v-if="recommendedTracks !== null"
              >
                <v-list-tile
                  v-for="track of recommendedTracks"
                  :key="track.id"
                >
                  <v-list-tile-avatar>
                    <img
                      v-if="track.album.images.length !== 0"
                      :src="track.album.images[track.album.images.length -1].url"
                      alt=""
                    >
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ track.name }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ track.artists[0].name }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <div
                v-if="recommendedTracks !== null"
                class="text-xs-center mt-3"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Choose How to Listen ', 'selected', 'positive', 1);
                    decisionStep = 5;
                  "
                >
                  Choose How to Listen
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step
              step="5"
              :complete="decisionStep > 5"
            >
              Play
            </v-stepper-step>
            <v-stepper-content step="5">
              <v-flex xs12 class="text-xs-center">
                <v-select
                  v-if="myDevices.length !== 0"
                  :items="myDevices"
                  item-text="name"
                  v-model="desiredPlaybackDevice"
                  v-on:click="
                    fireGAEvent('Choose Playback Device', 'selected', 'positive', 1);
                  "
                  label="Choose Playback Device"
                >
                </v-select>
                <v-btn
                  small
                  color="teal accent-4"
                  :disabled="myDevices.length === 0"
                  v-if="myDevices.length !== 0"
                  v-on:click="
                    fireGAEvent('Play on Device', 'selected', 'positive', 1);
                    playRecommendedTracks();
                  "
                >
                  Play on Device
                </v-btn>
              </v-flex>


              <v-flex xs12 class="text-xs-center">
                <v-text-field
                  name="playlistName"
                  label="Playlist Name"
                  v-model="playlistName"
                ></v-text-field>
                <v-btn
                  small
                  color="teal accent-4"
                  v-if="myCreatedPlaylist === null"
                  v-on:click.native="
                    fireGAEvent('Save as Playlist', 'selected', 'positive', 1);
                    saveAsPlaylist();
                  "
                >
                  Save as Playlist
                </v-btn>
                <v-btn
                  small
                  color="teal accent-4"
                  v-if="myCreatedPlaylist !== null"
                  :href="myCreatedPlaylist.external_urls.spotify"
                  target="_blank"
                  v-on:click="
                    fireGAEvent('Open in Spotify', 'selected', 'positive', 1);
                  "
                >
                  Open in Spotify
                </v-btn>
              </v-flex>
            </v-stepper-content>
          </v-stepper>
        </div>
      </v-flex>
    </v-layout>

    <!-- My Saved Tracks Path -->
    <v-layout>
      <v-flex xs12 sm8 md6 lg4 offset-sm2 offset-md3 offset-lg4>
        <div v-if="accessToken !== null && buildProcess === 'useMySavedTracks'">
          <v-stepper v-model="decisionStep" vertical>
            <v-stepper-step
              step="1"
              :complete="decisionStep > 1"
            >
              Add Modifiers
            </v-stepper-step>
            <v-stepper-content
              step="1"
              class="text-xs-center"
            >
              <div
                v-if="targetAcousticness === null && modifierStep === 1"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Acousticness Modifier', 'acoustic', 'positive', 1);
                    targetAcousticness = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 2;
                  "
                >
                  acoustic
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Acousticness Modifier', 'electric', 'positive', 1);
                    targetAcousticness = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 2;
                  "
                >
                  electric
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Acousticness Modifier', 'do not care', 'positive', 1);
                    targetAcousticness = 'na';
                    modifierStep = 2;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetDanceability === null && modifierStep === 2"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Danceability Modifier', 'dancing', 'positive', 1);
                    targetDanceability = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 3;
                  "
                >
                  dancing
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Danceability Modifier', 'chillin', 'positive', 1);
                    targetDanceability = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 3;
                  "
                >
                  chillin
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Danceability Modifier', 'do not care', 'positive', 1);
                    targetDanceability = 'na';
                    modifierStep = 3;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetEnergy === null && modifierStep === 3"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Energy Modifier', 'energetic', 'positive', 1);
                    targetEnergy = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 4;
                  "
                >
                  energetic
                </v-btn>

                <span>
                  vs.
                </span>

                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Energy Modifier', 'sluggish', 'positive', 1);
                    targetEnergy = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 4;
                  "
                >
                  sluggish
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Energy Modifier', 'do not care', 'positive', 1);
                    targetEnergy = 'na';
                    modifierStep = 4;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetInstrumentalness === null && modifierStep === 4"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Instrumentalness Modifier', 'instrumental', 'positive', 1);
                    targetInstrumentalness = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 5;
                  "
                >
                  instrumental
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Instrumentalness Modifier', 'vocal', 'positive', 1);
                    targetInstrumentalness = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 5;
                  "
                  style="min-width: 0"
                >
                  vocal
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Instrumentalness Modifier', 'do not care', 'positive', 1);
                    targetInstrumentalness = 'na';
                    modifierStep = 5;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetLoudness === null && modifierStep === 5"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Loudness Modifier', 'loud', 'positive', 1);
                    targetLoudness = (Math.floor(Math.random() * (15 - 0 + 1) + 0) * -1);
                    modifierStep = 6;
                  "
                >
                  loud
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Loudness Modifier', 'quiet', 'positive', 1);
                    targetLoudness = (Math.floor(Math.random() * (60 - 45 + 1) + 45) * -1);
                    modifierStep = 6;
                  "
                >
                  quiet
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Loudness Modifier', 'do not care', 'positive', 1);
                    targetLoudness = 'na';
                    modifierStep = 6;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetPopularity === null && modifierStep === 6"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Popularity Modifier', 'popular', 'positive', 1);
                    targetPopularity = (Math.floor(Math.random() * (100 - 70 + 1) + 70));
                    modifierStep = 7;
                  "
                >
                  popular
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Popularity Modifier', 'obscure', 'positive', 1);
                    targetPopularity = (Math.floor(Math.random() * (30 - 0 + 1) + 0));
                    modifierStep = 7;
                  "
                >
                  obscure
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Popularity Modifier', 'do not care', 'positive', 1);
                    targetPopularity = 'na';
                    modifierStep = 7;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetValence === null && modifierStep === 7"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Valence Modifier', 'happy', 'positive', 1);
                    targetValence = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 8;
                    decisionStep = 2;
                    setRecommendationsOptions();
                  "
                >
                  happy
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Valence Modifier', 'sad', 'positive', 1);
                    targetValence = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 8;
                    decisionStep = 2;
                    setRecommendationsOptions();
                  "
                >
                  sad
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Valence Modifier', 'do not care', 'positive', 1);
                    targetValence = 'na';
                    modifierStep = 8;
                    decisionStep = 2;
                    setRecommendationsOptions();
                  "
                >
                  don't care
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step
              step="2"
              :complete="decisionStep > 2"
            >
              Preview
            </v-stepper-step>
            <v-stepper-content
              step="2"
            >
              <v-progress-linear :indeterminate="true" v-if="recommendedTracks === null"></v-progress-linear>
              <v-list two-line
                v-if="recommendedTracks !== null"
              >
                <v-list-tile
                  v-for="track of recommendedTracks"
                  :key="track.id"
                >
                  <v-list-tile-avatar>
                    <img
                      v-if="track.album.images.length !== 0"
                      :src="track.album.images[track.album.images.length -1].url"
                      alt=""
                    >
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ track.name }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ track.artists[0].name }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <div
                v-if="recommendedTracks !== null"
                class="text-xs-center mt-3"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Choose How to Listen ', 'selected', 'positive', 1);
                    decisionStep = 3;
                  "
                >
                  Choose How to Listen
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step
              step="3"
              :complete="decisionStep > 3"
            >
              Play
            </v-stepper-step>
            <v-stepper-content
              step="3"
            >
              <div class="text-xs-center">
                <v-select
                  v-if="myDevices.length !== 0"
                  :items="myDevices"
                  item-text="name"
                  v-model="desiredPlaybackDevice"
                  v-on:click="
                    fireGAEvent('Choose Playback Device', 'selected', 'positive', 1);
                  "
                  label="Choose Playback Device"
                >
                </v-select>
                <v-btn
                  small
                  color="teal accent-4"
                  :disabled="myDevices.length === 0"
                  v-if="myDevices.length !== 0"
                  v-on:click="
                    fireGAEvent('Play on Device', 'selected', 'positive', 1);
                    playRecommendedTracks();
                  "
                >
                  Play on Device
                </v-btn>
                <v-text-field
                  name="playlistName"
                  label="Playlist Name"
                  v-model="playlistName"
                ></v-text-field>
                <v-btn
                  small
                  color="teal accent-4"
                  v-if="myCreatedPlaylist === null"
                  v-on:click.native="
                    fireGAEvent('Save as Playlist', 'selected', 'positive', 1);
                    saveAsPlaylist();
                  "
                >
                  Save as Playlist
                </v-btn>
                <v-btn
                  small
                  color="teal accent-4"
                  v-if="myCreatedPlaylist !== null"
                  :href="myCreatedPlaylist.external_urls.spotify"
                  target="_blank"
                  v-on:click="
                    fireGAEvent('Open in Spotify', 'selected', 'positive', 1);
                  "
                >
                  Open in Spotify
                </v-btn>
              </div>
            </v-stepper-content>
          </v-stepper>
        </div>
      </v-flex>
    </v-layout>

    <!-- Custom Seeds Path -->
    <v-layout>
      <v-flex xs12 sm8 md6 lg4 offset-sm2 offset-md3 offset-lg4>
        <div v-if="accessToken !== null && buildProcess === 'simple'">
          <v-stepper v-model="decisionStep" vertical>
            <v-stepper-step
              step="1"
              :complete="decisionStep > 1"
            >
              Select Seed Type
            </v-stepper-step>
            <v-stepper-content
              step="1"
              class="text-xs-center"
            >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    seedType = 'artist';
                    decisionStep = 2;
                    fireGAEvent('Seed Type', 'artist', 'positive', 1);
                  "
                >
                  artist
                </v-btn>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    seedType = 'track';
                    getTopTracks();
                    decisionStep = 2;
                    fireGAEvent('Seed Type', 'track', 'positive', 1);
                  "
                >
                  track
                </v-btn>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    seedType = 'genre';
                    decisionStep = 2;
                    fireGAEvent('Seed Type', 'genre', 'positive', 1);
                  "
                >
                  genre
                </v-btn>
            </v-stepper-content>

            <v-stepper-step
              step="2"
              :complete="decisionStep > 2"
            >
              Select Seed
            </v-stepper-step>
            <v-stepper-content
              step="2"
            >
                <!-- Personalized Seed Suggestions -->
                <div
                  v-if="seedType !== 'genre'"
                >
                  <!-- Search Input -->
                  <v-text-field
                    label="Search"
                    v-model.trim="query"
                    type="text"
                    name=""
                    id=""
                    v-on:keyup="
                      executeSearch(seedType);
                    "
                  >
                  </v-text-field>
                  <!-- Search Results -->
                  <v-list
                    subheader
                    v-if="query !== ''"
                  >
                    <v-subheader>
                      Search results
                    </v-subheader>
                    <!-- Artist Search Results -->
                    <div
                      v-if="artistSearchResults !== null && artistSeed === null"
                    >
                      <v-list-tile
                        v-for="result of artistSearchResults.artists.items"
                        :key="result.id"
                        v-on:click="
                          selectArtist(result.id);
                          decisionStep = 3;
                          fireGAEvent('Artist Search Result', 'selected', 'positive', 1);
                        "
                        :data-artist-id="result.id"
                      >
                        <v-list-tile-avatar>
                          <img
                            v-if="result.images.length !== 0"
                            :src="result.images[result.images.length -1].url"
                            alt=""
                          >
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            {{ result.name }}
                          </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </div>
                    <!-- Track Search Results -->
                    <div
                      v-if="trackSearchResults !== null && trackSeed === null"
                    >
                      <v-list-tile
                        v-for="result of trackSearchResults.tracks.items"
                        :key="result.id"
                        v-on:click="
                          selectTrack(result.id);
                          decisionStep = 3;
                          fireGAEvent('Track Search Result', 'selected', 'positive', 1);
                        "
                        :data-track-id="result.id"
                      >
                        <v-list-tile-avatar>
                          <img
                            v-if="result.album.images.length !== 0"
                            :src="result.album.images[result.album.images.length -1].url"
                            alt=""
                          >
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            {{ result.name }}
                          </v-list-tile-title>
                          <v-list-tile-sub-title>
                            {{ result.artists[0].name }}
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </div>
                  </v-list>

                  <!-- My Top Artists/Tracks Section -->
                  <v-list
                    subheader
                  >
                    <v-subheader>
                      Select from your favorites
                    </v-subheader>
                    <!-- Top Artists -->
                    <div
                      v-if="seedType === 'artist'"
                    >
                      <v-list-tile
                        v-for="artist in sliceArray(myTopArtists.items, 0, 5)"
                        :key="artist.id"
                        v-on:click="
                          selectArtist(artist.id);
                          decisionStep = 3;
                          fireGAEvent('My Top Artist Seed', 'selected', 'positive', 1);
                        "
                      >
                        <v-list-tile-content>
                          <v-list-tile-title>
                            {{ artist.name }}
                          </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </div>

                    <!-- Top Tracks -->
                    <div
                      v-if="seedType === 'track'"
                    >
                      <v-list-tile
                        v-for="track in sliceArray(myTopTracks.items, 0, 5)"
                        :key="track.id"
                        v-on:click="
                          selectTrack(track.id);
                          decisionStep = 3;
                          fireGAEvent('My Top Track Seed', 'selected', 'positive', 1);
                        "
                      >
                        <v-list-tile-content>
                          <v-list-tile-title>
                            {{ track.name }}
                          </v-list-tile-title>
                          <v-list-tile-sub-title>
                            {{ track.artists[0].name }}
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </div>
                  </v-list>
                </div>

                <!-- List of available genres -->
                <div
                  v-if="seedType === 'genre'"
                >
                  <v-list
                    subheader
                  >
                    <v-subheader>
                      Choose a genre
                    </v-subheader>
                    <v-list-tile
                      v-for="genre of genreOptions"
                      :key="genre.id"
                      v-on:click="
                        selectGenre(genre);
                        decisionStep = 3;
                        fireGAEvent('Genre Seed', 'selected', 'positive', 1)
                      "
                    >
                      <v-list-tile-content>
                        <v-list-tile-title>
                          {{ genre }}
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                  <div class="text-xs-center mt-3">
                    <v-btn
                      small
                      color="teal accent-4"
                      v-on:click="
                        loadAdditionalGenres();
                        fireGAEvent('Load Additional Genres', 'selected', 'positive', 1);
                      "
                      v-if="additionalGenreOptions.length !== 0"
                    >
                      load more
                    </v-btn>
                    <v-btn
                      small
                      color="teal accent-4"
                      v-on:click="
                        showAllGenres();
                        fireGAEvent('Show All Genres', 'selected', 'positive', 1);
                      "
                      v-if="additionalGenreOptions.length !== 0"
                    >
                      see all genres
                    </v-btn>
                  </div>
              </div>
            </v-stepper-content>

            <v-stepper-step
              step="3"
              :complete="decisionStep > 3"
            >
              Add Modifiers
            </v-stepper-step>
            <v-stepper-content
              step="3"
              class="text-xs-center"
            >
              <div
                v-if="targetAcousticness === null && modifierStep === 1"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Acousticness Modifier', 'acoustic', 'positive', 1);
                    targetAcousticness = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 2;
                  "
                >
                  acoustic
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Acousticness Modifier', 'electric', 'positive', 1);
                    targetAcousticness = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 2;
                  "
                >
                  electric
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Acousticness Modifier', 'do not care', 'positive', 1);
                    targetAcousticness = 'na';
                    modifierStep = 2;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetDanceability === null && modifierStep === 2"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Danceability Modifier', 'dancing', 'positive', 1);
                    targetDanceability = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 3;
                  "
                >
                  dancing
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Danceability Modifier', 'chillin', 'positive', 1);
                    targetDanceability = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 3;
                  "
                >
                  chillin
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Danceability Modifier', 'do not care', 'positive', 1);
                    targetDanceability = 'na';
                    modifierStep = 3;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetEnergy === null && modifierStep === 3"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Energy Modifier', 'energetic', 'positive', 1);
                    targetEnergy = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 4;
                  "
                >
                  energetic
                </v-btn>

                <span>
                  vs.
                </span>

                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Energy Modifier', 'sluggish', 'positive', 1);
                    targetEnergy = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 4;
                  "
                >
                  sluggish
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Energy Modifier', 'do not care', 'positive', 1);
                    targetEnergy = 'na';
                    modifierStep = 4;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetInstrumentalness === null && modifierStep === 4"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Instrumentalness Modifier', 'instrumental', 'positive', 1);
                    targetInstrumentalness = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 5;
                  "
                >
                  instrumental
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Instrumentalness Modifier', 'vocal', 'positive', 1);
                    targetInstrumentalness = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 5;
                  "
                  style="min-width: 0"
                >
                  vocal
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Instrumentalness Modifier', 'do not care', 'positive', 1);
                    targetInstrumentalness = 'na';
                    modifierStep = 5;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetLoudness === null && modifierStep === 5"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Loudness Modifier', 'loud', 'positive', 1);
                    targetLoudness = (Math.floor(Math.random() * (15 - 0 + 1) + 0) * -1);
                    modifierStep = 6;
                  "
                >
                  loud
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Loudness Modifier', 'quiet', 'positive', 1);
                    targetLoudness = (Math.floor(Math.random() * (60 - 45 + 1) + 45) * -1);
                    modifierStep = 6;
                  "
                >
                  quiet
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Loudness Modifier', 'do not care', 'positive', 1);
                    targetLoudness = 'na';
                    modifierStep = 6;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetPopularity === null && modifierStep === 6"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Popularity Modifier', 'popular', 'positive', 1);
                    targetPopularity = (Math.floor(Math.random() * (100 - 70 + 1) + 70));
                    modifierStep = 7;
                  "
                >
                  popular
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Popularity Modifier', 'obscure', 'positive', 1);
                    targetPopularity = (Math.floor(Math.random() * (30 - 0 + 1) + 0));
                    modifierStep = 7;
                  "
                >
                  obscure
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Popularity Modifier', 'do not care', 'positive', 1);
                    targetPopularity = 'na';
                    modifierStep = 7;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="targetValence === null && modifierStep === 7"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Valence Modifier', 'happy', 'positive', 1);
                    targetValence = (Math.floor(Math.random() * (100 - 70 + 1) + 70) / 100);
                    modifierStep = 8;
                  "
                >
                  happy
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Valence Modifier', 'sad', 'positive', 1);
                    targetValence = (Math.floor(Math.random() * (30 - 0 + 1) + 0) / 100);
                    modifierStep = 8;
                  "
                >
                  sad
                </v-btn>
                <br>
                <v-btn
                  small
                  color="teal accent-4"
                  flat
                  v-on:click="
                    fireGAEvent('Valence Modifier', 'do not care', 'positive', 1);
                    targetValence = 'na';
                    modifierStep = 8;
                  "
                >
                  don't care
                </v-btn>
              </div>

              <div
                v-if="allowRepeatArtists === null && modifierStep === 8 && seedType !== 'genre'"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Repeat Artists Modifier', 'Allow Repeat Artists', 'positive', 1);
                    allowRepeatArtists = true;
                    modifierStep = 9;
                  "
                >
                  repeat artists
                </v-btn>
                <span>
                  vs.
                </span>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Repeat Artists Modifier', 'Do Not Allow Repeat Artists', 'positive', 1);
                    allowRepeatArtists = false;
                    modifierStep = 9;
                  "
                >
                  unique artists
                </v-btn>
              </div>

              <div
                v-if="(recommendationLimit === null && modifierStep === 9) || (recommendationLimit === null && modifierStep === 8 && seedType === 'genre')"
              >
                <p class="title">Number of Tracks</p>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Number of Tracks', '25', 'positive', 1);
                    recommendationLimit = 25;
                    modifierStep = 10;
                    decisionStep = 4;
                    setRecommendationsOptions();
                  "
                >
                  25
                </v-btn>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Number of Tracks', '50', 'positive', 1);
                    recommendationLimit = 50;
                    modifierStep = 10;
                    decisionStep = 4;
                    setRecommendationsOptions();
                  "
                >
                  50
                </v-btn>
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Number of Tracks', '100', 'positive', 1);
                    recommendationLimit = 100;
                    modifierStep = 10;
                    decisionStep = 4;
                    setRecommendationsOptions();
                  "
                >
                  100
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step
              step="4"
              :complete="decisionStep > 4"
            >
              Preview
            </v-stepper-step>
            <v-stepper-content
              step="4"
            >
              <v-progress-linear :indeterminate="true" v-if="recommendedTracks === null"></v-progress-linear>
              <v-list two-line
                v-if="recommendedTracks !== null"
              >
                <v-list-tile
                  v-for="track of recommendedTracks"
                  :key="track.id"
                >
                  <v-list-tile-avatar>
                    <img
                      v-if="track.album.images.length !== 0"
                      :src="track.album.images[track.album.images.length -1].url"
                      alt=""
                    >
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ track.name }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ track.artists[0].name }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
              <div
                v-if="recommendedTracks !== null"
                class="text-xs-center mt-3"
              >
                <v-btn
                  small
                  color="teal accent-4"
                  v-on:click="
                    fireGAEvent('Choose How to Listen ', 'selected', 'positive', 1);
                    decisionStep = 5;
                  "
                >
                  Choose How to Listen
                </v-btn>
              </div>
            </v-stepper-content>

            <v-stepper-step
              step="5"
              :complete="decisionStep > 5"
            >
              Play
            </v-stepper-step>
            <v-stepper-content
              step="5"
            >
              <div class="text-xs-center">
                <v-select
                  v-if="myDevices.length !== 0"
                  :items="myDevices"
                  item-text="name"
                  v-model="desiredPlaybackDevice"
                  v-on:click="
                    fireGAEvent('Choose Playback Device', 'selected', 'positive', 1);
                  "
                  label="Choose Playback Device"
                >
                </v-select>
                <v-btn
                  small
                  color="teal accent-4"
                  :disabled="myDevices.length === 0"
                  v-if="myDevices.length !== 0"
                  v-on:click="
                    fireGAEvent('Play on Device', 'selected', 'positive', 1);
                    playRecommendedTracks();
                  "
                >
                  Play on Device
                </v-btn>
                <v-text-field
                  name="playlistName"
                  label="Playlist Name"
                  v-model="playlistName"
                ></v-text-field>
                <v-btn
                  small
                  color="teal accent-4"
                  v-if="myCreatedPlaylist === null"
                  v-on:click.native="
                    fireGAEvent('Save as Playlist', 'selected', 'positive', 1);
                    saveAsPlaylist();
                  "
                >
                  Save as Playlist
                </v-btn>
                <v-btn
                  small
                  color="teal accent-4"
                  v-if="myCreatedPlaylist !== null"
                  :href="myCreatedPlaylist.external_urls.spotify"
                  target="_blank"
                  v-on:click="
                    fireGAEvent('Open in Spotify', 'selected', 'positive', 1);
                  "
                >
                  Open in Spotify
                </v-btn>
              </div>
            </v-stepper-content>
          </v-stepper>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from 'lodash'
import Spotify from 'spotify-web-api-js'
let spotifyApi = new Spotify()

export default {
  name: 'Build',
  data () {
    return {
      accessToken: null,
      userInfo: null,
      buildProcess: null,
      magicPlaylistCategories: null,
      magicPlaylists: null,
      chosenMagicPlaylist: null,
      decisionStep: 1,
      modifierStep: 1,
      query: '',
      seedType: null,
      artistSearchResults: null,
      trackSearchResults: null,
      genreOptions: [
        'hip-hop',
        'r-n-b',
        'rock',
        'pop',
        'country',
        'latin',
        'electronic',
        'dance',
        'gospel',
        'holidays',
        'children',
        'jazz',
        'classical'
      ],
      additionalGenreOptions: [
        'acoustic',
        'afrobeat',
        'alt-rock',
        'alternative',
        'ambient',
        'anime',
        'black-metal',
        'bluegrass',
        'blues',
        'bossanova',
        'brazil',
        'breakbeat',
        'british',
        'cantopop',
        'chicago-house',
        'chill',
        'club',
        'comedy',
        'dancehall',
        'death-metal',
        'deep-house',
        'detroit-techno',
        'disco',
        'disney',
        'drum-and-bass',
        'dub',
        'dubstep',
        'edm',
        'electro',
        'emo',
        'folk',
        'forro',
        'french',
        'funk',
        'garage',
        'german',
        'goth',
        'grindcore',
        'groove',
        'grunge',
        'guitar',
        'happy',
        'hard-rock',
        'hardcore',
        'hardstyle',
        'heavy-metal',
        'honky-tonk',
        'house',
        'idm',
        'indian',
        'indie',
        'indie-pop',
        'industrial',
        'iranian',
        'j-dance',
        'j-idol',
        'j-pop',
        'j-rock',
        'k-pop',
        'kids',
        'latino',
        'malay',
        'mandopop',
        'metal',
        'metal-misc',
        'metalcore',
        'minimal-techno',
        'movies',
        'mpb',
        'new-age',
        'new-release',
        'opera',
        'pagode',
        'party',
        'philippines-opm',
        'piano',
        'pop-film',
        'post-dubstep',
        'power-pop',
        'progressive-house',
        'psych-rock',
        'punk',
        'punk-rock',
        'rainy-day',
        'reggae',
        'reggaeton',
        'road-trip',
        'rock-n-roll',
        'rockabilly',
        'romance',
        'sad',
        'salsa',
        'samba',
        'sertanejo',
        'show-tunes',
        'singer-songwriter',
        'ska',
        'sleep',
        'songwriter',
        'soul',
        'soundtracks',
        'spanish',
        'study',
        'summer',
        'swedish',
        'synth-pop',
        'tango',
        'techno',
        'trance',
        'trip-hop',
        'turkish',
        'work-out',
        'world-music'
      ],
      myTopArtists: null,
      myTopTracks: null,
      relatedArtists: null,
      myDevices: null,
      genreSeed: null,
      artistSeed: null,
      trackSeed: null,
      targetAcousticness: null,
      targetDanceability: null,
      targetEnergy: null,
      targetInstrumentalness: null,
      targetLoudness: null,
      targetPopularity: null,
      targetValence: null,
      allowRepeatArtists: null,
      recommendationLimit: null,
      options: {},
      magicPlaylistTracks: '',
      uniqueTracks: [],
      recommendedTracks: null,
      desiredPlaybackDevice: null,
      playlistName: null,
      myCreatedPlaylist: null,
      tracksArray: []
    }
  },
  mounted: function () {
    const hashParams = {}
    let e
    const r = /([^&;=]+)=?([^&;]*)/g
    const q = window.location.hash.substring(1)

    // eslint-disable-next-line
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2])
    }
    this.accessToken = hashParams.access_token
    spotifyApi.setAccessToken(this.accessToken)
    this.$router.replace('/build')
    spotifyApi.getMe()
        .then((data) => {
          this.userInfo = data
        }, () => {
          // console.error(err)
          this.$router.push('/')
        })
    spotifyApi.getMyDevices()
        .then((data) => {
          this.myDevices = data.devices
        }, () => {
          // console.error(err)
        })
  },
  methods: {
    executeSearch: _.debounce(function (searchType) {
      if (searchType === 'artist') {
        spotifyApi.searchArtists(this.query, {limit: 5})
          .then((data) => {
            this.artistSearchResults = data
          }, () => {
            // console.error(err)
          })
      } else {
        spotifyApi.searchTracks(this.query, {limit: 5})
          .then((data) => {
            this.trackSearchResults = data
          }, () => {
            // console.error(err)
          })
      }
    }, 200),
    fireGAEvent: function (category, action, label, value) {
      this.$ga.event({
        eventCategory: category,
        eventAction: action,
        eventLabel: label,
        eventValue: value
      })
    },
    sliceArray: function (array, start, number) {
      return array.slice(start, (start + number))
    },
    getMagicPlaylistCategories: function () {
      spotifyApi.getCategories({limit: 50})
        .then((data) => {
          this.magicPlaylistCategories = data.categories.items
        }, () => {
          // console.error(err)
        })
    },
    getMagicPlaylists: function (playlistId) {
      spotifyApi.getCategoryPlaylists(playlistId, {limit: 50})
        .then((data) => {
          this.magicPlaylists = data.playlists.items
        }, () => {
          // console.error(err)
        })
    },
    // buildMagicPlaylist: function () {
    //   spotifyApi.getPlaylistTracks('spotify', this.chosenMagicPlaylist)
    //     .then((data) => {
    //       for (var i = 0; i < 5; i++) {
    //         let randomNumber = Math.floor(Math.random() * data.items.length)
    //         this.magicPlaylistTracks = this.magicPlaylistTracks + data.items.splice(randomNumber, 1)[0].track.id + ','
    //       }
    //       let options = {}
    //       options.seed_tracks = this.magicPlaylistTracks
    //       options.limit = this.recommendationLimit
    //       spotifyApi.getRecommendations(options)
    //         .then((data) => {
    //           this.recommendedTracks = data
    //           for (var i = 0; i < this.recommendedTracks.tracks.length; i++) {
    //             this.tracksArray.push(this.recommendedTracks.tracks[i].uri)
    //           }
    //         }, (err) => {
    //           console.error(err)
    //         })
    //     }, (err) => {
    //       console.error(err)
    //     })
    // },
    selectArtist: function (id) {
      if (id) {
        let artistId = id
        spotifyApi.getArtist(artistId)
          .then((data) => {
            this.artistSeed = data
            spotifyApi.getArtistRelatedArtists(data.id)
              .then((data) => {
                this.relatedArtists = data
              }, () => {
                // console.error(err)
              })
          }, () => {
            // console.error(err)
          })
      }
    },
    selectTrack: function (id) {
      if (id) {
        let trackId = id
        spotifyApi.getTrack(trackId)
          .then((data) => {
            this.trackSeed = data
            spotifyApi.getArtistRelatedArtists(data.artists[0].id)
              .then((data) => {
                this.relatedArtists = data
              }, () => {
                // console.error(err)
              })
          }, () => {
            // console.error(err)
          })
      }
    },
    selectGenre: function (genre) {
      this.genreSeed = genre
    },
    getTopArtists: function () {
      spotifyApi.getMyTopArtists({limit: 10, time_range: 'short_term'})
        .then((data) => {
          this.myTopArtists = data
        }, () => {
          // console.error(err)
        })
    },
    getTopTracks: function () {
      spotifyApi.getMyTopTracks({limit: 10, time_range: 'short_term'})
        .then((data) => {
          this.myTopTracks = data
        }, () => {
          // console.error(err)
        })
    },
    // surpriseArtist: function () {
    //   let randomNumber = Math.floor(Math.random() * this.myTopArtists.items.length)
    //   this.artistSeed = this.myTopArtists.items[randomNumber]
    // },
    // surpriseSavedTrack: function () {
    //   spotifyApi.getMySavedTracks({limit: 50})
    //     .then((data) => {
    //       for (var i = 0; i < 5; i++) {
    //         let randomNumber = Math.floor(Math.random() * data.items.length)
    //         this.surpriseSavedTrackSeeds = this.surpriseSavedTrackSeeds + data.items.splice(randomNumber, 1)[0].track.id + ','
    //       }
    //     }, (err) => {
    //       console.error(err)
    //     })
    // },
    loadAdditionalGenres: function () {
      for (let i = 0; i < 10; i++) {
        let genreIndex = (Math.floor(Math.random() * this.additionalGenreOptions.length))
        let newGenre = this.additionalGenreOptions.splice(genreIndex, 1).toString()
        if (newGenre !== '') {
          this.genreOptions.push(newGenre)
        }
      }
    },
    showAllGenres: function () {
      while (this.additionalGenreOptions.length > 0) {
        this.genreOptions.push(this.additionalGenreOptions.shift())
      }
    },
    setRecommendationsOptions: function () {
      if (this.targetAcousticness !== null && this.targetAcousticness !== 'na') {
        this.options.target_acousticness = this.targetAcousticness
      }

      if (this.targetDanceability !== null && this.targetDanceability !== 'na') {
        this.options.target_danceability = this.targetDanceability
      }

      if (this.targetEnergy !== null && this.targetEnergy !== 'na') {
        this.options.target_energy = this.targetEnergy
      }

      if (this.targetInstrumentalness !== null && this.targetInstrumentalness !== 'na') {
        this.options.target_instrumentalness = this.targetInstrumentalness
      }

      if (this.targetLoudness !== null && this.targetLoudness !== 'na') {
        this.options.target_loudness = this.targetLoudness
      }

      if (this.targetLoudness !== null && this.targetLoudness !== 'na') {
        this.options.target_loudness = this.targetLoudness
      }

      if (this.targetPopularity !== null && this.targetPopularity !== 'na') {
        this.options.target_popularity = this.targetPopularity
      }

      if (this.targetValence !== null && this.targetValence !== 'na') {
        this.options.target_valence = this.targetValence
      }

      if (this.artistSeed !== null) {
        this.options.seed_artists = this.artistSeed.id
      } else if (this.trackSeed !== null) {
        this.options.seed_tracks = this.trackSeed.id
      } else if (this.genreSeed !== null) {
        this.options.seed_genres = this.genreSeed
      }

      this.options.limit = this.recommendationLimit
      if (this.buildProcess === 'useMySavedTracks') {
        this.buildPlaylistFromSavedTracks()
      } else if (this.buildProcess === 'magic') {
        this.buildPlaylistFromMagicPlaylist()
      } else {
        this.getTrackRecommendations()
      }
    },
    async buildPlaylistFromMagicPlaylist () {
      this.recommendationLimit = 20
      let magicPlaylistTracks = await spotifyApi.getPlaylistTracks('spotify', this.chosenMagicPlaylist)
      let numberOfPlaylistTracks = magicPlaylistTracks.total
      if (numberOfPlaylistTracks > 100) {
        numberOfPlaylistTracks = 100
      }
      this.options.limit = 1
      do {
        let randomNumber = Math.floor(Math.random() * (numberOfPlaylistTracks - 1))
        let randomTrack = magicPlaylistTracks.items[randomNumber]
        this.options.seed_tracks = randomTrack.track.id
        let recommendations = await spotifyApi.getRecommendations(this.options)
        if (recommendations.tracks.length) {
          if (
            this.uniqueTracks
              .map(element => {
                return element.artists[0].id
              })
              .indexOf(recommendations.tracks[0].artists[0].id) === -1
          ) {
            this.uniqueTracks.push(recommendations.tracks[0])
          }
        }
      } while (this.uniqueTracks.length < this.recommendationLimit)

      this.recommendedTracks = this.uniqueTracks.slice(0, this.recommendationLimit)
      for (var j = 0; j < this.recommendedTracks.length; j++) {
        this.tracksArray.push(this.recommendedTracks[j].uri)
      }
    },
    async buildPlaylistFromSavedTracks () {
      this.recommendationLimit = 20
      let mySavedTracks = await spotifyApi.getMySavedTracks({ limit: 1 })
      let numberOfSavedTracks = mySavedTracks.total
      this.options.limit = 1
      do {
        let randomNumber = Math.floor(Math.random() * numberOfSavedTracks)
        let randomTrack = await spotifyApi.getMySavedTracks({limit: 1, offset: (randomNumber - 1)})
        this.options.seed_tracks = randomTrack.items[0].track.id
        let recommendations = await spotifyApi.getRecommendations(this.options)

        if (
          this.uniqueTracks
            .map(element => {
              return element.artists[0].id
            })
            .indexOf(recommendations.tracks[0].artists[0].id) === -1
        ) {
          this.uniqueTracks.push(recommendations.tracks[0])
        }
      } while (this.uniqueTracks.length < this.recommendationLimit)

      this.recommendedTracks = this.uniqueTracks.slice(0, this.recommendationLimit)

      for (var j = 0; j < this.recommendedTracks.length; j++) {
        this.tracksArray.push(this.recommendedTracks[j].uri)
      }
    },
    async getTrackRecommendations () {
      if (this.allowRepeatArtists === false) {
        let relatedArtistIndex = 0
        let newRelatedArtistIndex = 0

        do {
          let recommendations = await spotifyApi.getRecommendations(this.options)

          for (var i = 0; i < recommendations.tracks.length; i++) {
            if (this.uniqueTracks.map(element => { return element.artists[0].id }).indexOf(recommendations.tracks[i].artists[0].id) === -1) {
              this.uniqueTracks.push(recommendations.tracks[i])
            }
          }

          this.options.seed_artists = this.relatedArtists.artists[relatedArtistIndex].id
          if (relatedArtistIndex < 19) {
            relatedArtistIndex += 1
          } else {
            relatedArtistIndex = 0
            spotifyApi.getArtistRelatedArtists(this.relatedArtists.artists[newRelatedArtistIndex].id)
              .then((data) => {
                this.relatedArtists = data
                newRelatedArtistIndex += 1
              }, () => {
                // console.error(err)
              })
          }
        } while (this.uniqueTracks.length < this.recommendationLimit)
        this.recommendedTracks = this.uniqueTracks.slice(0, this.recommendationLimit)
        for (var j = 0; j < this.recommendedTracks.length; j++) {
          this.tracksArray.push(this.recommendedTracks[j].uri)
        }
      } else {
        let recommendations = await spotifyApi.getRecommendations(this.options)
        this.recommendedTracks = recommendations.tracks
        for (var k = 0; k < this.recommendedTracks.length; k++) {
          this.tracksArray.push(this.recommendedTracks[k].uri)
        }
      }
    },
    playRecommendedTracks: function () {
      spotifyApi.play({uris: this.tracksArray, device_id: this.desiredPlaybackDevice.id})
    },
    saveAsPlaylist: function () {
      let playlistName
      if (this.playlistName !== null) {
        playlistName = this.playlistName
      } else {
        playlistName = 'playlistify.me'
      }
      spotifyApi.createPlaylist(this.userInfo.id, {name: playlistName})
        .then((data) => {
          this.myCreatedPlaylist = data
          spotifyApi.addTracksToPlaylist(this.userInfo.id, data.id, this.tracksArray)
        }, () => {
          // console.error(err)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
