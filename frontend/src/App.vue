<template>
  <div id="app">
    <vue-header/>
    <el-main>
      <router-view/>
    </el-main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueHeader from './components/Header'

export default {
  name: 'app',
  computed: {
    ...mapGetters(['token'])
  },
  components: {
    VueHeader
  },
  mounted () {
    this.$nextTick(function () {
      this.autoTransition()
    })
  },
  watch: {
    token (val) {
      this.autoTransition()
    }
  },
  methods: {
    autoTransition () {
      if (!this.token) {
        this.$gm_routerPush('SignIn')
      } else if (this.$route.name === 'SignIn') {
        this.$gm_routerPush('Top')
      }
    }
  }
}
</script>

<style>
body,html {
  margin:0;
  padding:0;
  height:100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
