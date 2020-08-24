<template>
  <div>
    <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex s12 sm8 md6 lg4 offset-sm2 offset-md3 offset-lg4>
          <p class="headline">Find the perfect music for every moment</p>
          <p class="mb-4">Use any artist, track, or genre as a seed for your custom playlist. Use a favorite Spotify Playlist to discover new similar music. Find taylored music based on your library.</p>

          <v-btn class="text--grey" color="teal accent-4" large v-on:click="connectWithSpotify(); fireGAEvent('Connect With Spotify', 'btn pressed', 'positive', 1)">Get Started</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      credentials: {
        clientId: '466b2a4b16874dadb28efaeb9e21005c',
        responseType: 'token',
        redirectUri: 'http://localhost:8080/build',
        state: this.generateRandomString(16),
        scope: 'user-read-private' +
          ' user-read-email' +
          ' user-read-birthdate' +
          ' playlist-read-private' +
          ' playlist-modify-private' +
          ' playlist-modify-public' +
          ' playlist-read-collaborative' +
          ' user-top-read' +
          ' user-read-recently-played' +
          ' user-library-read' +
          ' user-library-modify' +
          ' user-read-currently-playing' +
          ' user-modify-playback-state' +
          ' user-read-playback-state' +
          ' user-follow-modify' +
          ' user-follow-read' +
          ' streaming'
      }
    }
  },
  methods: {
    generateRandomString (length) {
      let text = ''

      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
      }

      return text
    },
    connectWithSpotify () {
      const url = 'https://accounts.spotify.com/authorize' +
        '?client_id=' +
        encodeURIComponent(this.credentials.clientId) +
        '&response_type=' +
        encodeURIComponent(this.credentials.responseType) +
        '&redirect_uri=' +
        encodeURIComponent(this.credentials.redirectUri) +
        '&state=' +
        encodeURIComponent(this.credentials.state) +
        '&scope=' +
        encodeURIComponent(this.credentials.scope)

      window.location.href = url
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
