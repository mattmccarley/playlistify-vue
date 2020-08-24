<template id="template">
  <v-app dark>
    <v-navigation-drawer app v-model="drawer">
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Menu
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense class="pt-0">
          <v-list-tile to="/">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/build" disabled>
            <v-list-tile-action>
              <v-icon>build</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Build</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile to="/about">
            <v-list-tile-action>
              <v-icon>help</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>About</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
      </v-list>

    </v-navigation-drawer>

    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/"><img class="c-toolbar__main-logo" src="../static/images/playlistify-4c.svg"></router-link></v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app>
      <div class="pa-2">Project by Matt McCarley</div>
      <v-spacer></v-spacer>
      <div class="pa-2">&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      right: null,
      drawer: false
    }
  }
}
</script>

<style>
  .c-toolbar__main-logo {
    height: 32px;
    margin-top: 10px;
  }
</style>
