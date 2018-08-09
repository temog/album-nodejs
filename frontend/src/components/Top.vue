<template>
  <div>
    top
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Top',
  computed: {
    ...mapGetters(['token', 'index'])
  },
  mounted () {
    this.$nextTick(function () {
      this.$store.dispatch('getIndex')
    })
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
