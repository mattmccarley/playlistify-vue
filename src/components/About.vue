<template>
  <div>
    <v-container
      grid-list-md
    >
      <v-layout
        row 
        wrap
      >
        <v-flex
          xs12
          sm8 offset-sm2
        >
          <p 
            class="headline"
          >
            Who is Matt McCarley?
          </p>
          <p
            class="mb-5"
          >
            I am a web developer from the Pacific Northwest. I work full-time in higher education but enjoy creating side projects in my spare time.
          </p>

          <p
            class="headline"
          >
            Why playlistify.me?
          </p>
          <p
            class="mb-5"
          >
            I started this as a useful tool for myself. I listen to music at least eight hours per day and wasn't 
            getting enough out of Spotify's native Discovery features. I was experimenting with Spotify's API and simulatenously
            wanted to learn a JS framework. I decided to build this tool to aid in my enjoyment of Spotify and
            to learn the basics of Vue.js.
          </p>
          <p
            class="headline"
          >
            Is playlistify.me finished?
          </p>
          <p
            class="mb-5"
          >
            Playlistify.me is very much a "living" project. I have a sheet of paper with many, many ideas/plans for
            improving and changing the application. I'm currently working towards a M.S. Statistics degree,
            working full-time, and trying to spend quality time with my wife and kids. Somewhere in-between all that stuff
            I try to make time to work on playlistify for fun.
          </p>
          <p
            class="headline"
          >
            What happened to the old Playlistify.me?
          </p>
          <p
            class="mb-5"
          >
            The old Angular2 version of Playlistify.me is hosted at <a href="http://classic.playlistify.me" target="_blank">classic.playlistify.me</a>
          </p>
          <p
            class="headline"
          >
            What if I want to give feedback or contact you?
          </p>
          <p
            class="mb-5"
          >
            You can email me at <a href="mailto:mdmccarley89@gmail.com">mdmccarley89@gmail.com</a>.
          </p>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'About',
  data () {
    return {
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
