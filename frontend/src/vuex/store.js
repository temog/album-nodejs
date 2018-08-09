import Vue from 'vue'
import Vuex from 'vuex'
import GlobalMixin from '../mixin/globalMixin'
Vue.use(Vuex)

/*
  1. store.dispatch -> action 呼び出す
  2. actions.commit -> mutation 呼び出す
  3. mutation -> データを state に渡すのみ
  4. getter -> state を参照
*/

const state = {
  token: GlobalMixin.getStorage('token'), // アクセストークン
  nickname: GlobalMixin.getStorage('nickname'),
  tags: null,
  index: null
}

const actions = {
  // signIn
  signIn ({ commit }, data) {
    const url = GlobalMixin.config('api', 'signIn')
    GlobalMixin.post(url, {
      account: data.account,
      password: data.password
    })
    .then((resp) => {
      commit('signIn', resp)
    })
  },
  // signOut
  signOut ({ commit }) {
    const url = GlobalMixin.config('api', 'signOut')
    GlobalMixin.api(url, {
      token: state.token
    })
    .then((resp) => {
      commit('signOut', resp)
    })
  },
  // getTagAll
  getTagAll ({ commit }) {
    const url = GlobalMixin.config('api', 'getTagAll')
    GlobalMixin.api(url, {
      token: state.token
    })
    .then((resp) => {
      commit('getTagAll', resp)
    })
  },
  getProfile ({ commit }) {
    if (!state.token) {
      return
    }
    const url = GlobalMixin.config('api', 'getProfile')
    GlobalMixin.api(url, {
      token: state.token
    })
    .then((resp) => {
      console.log(resp)
    })
  },
  getIndex ({ commit }) {
    if (!state.token) {
      return
    }
    const url = GlobalMixin.config('api', 'getIndex')
    GlobalMixin.api(url, {
      token: state.token
    })
    .then((resp) => {
      commit('getIndex', resp)
    })
  }
}

const mutations = {
  signIn (state, data) {
    if (data.status === 'success') {
      state.token = data.token
      state.nickname = data.nickname
      GlobalMixin.setStorage('token', data.token)
      GlobalMixin.setStorage('nickname', data.nickname)
    }
  },
  signOut (state, resp) {
    if (resp.status === 'success') {
      state.token = null
      state.nickname = null
      GlobalMixin.removeStorage('token')
      GlobalMixin.removeStorage('nickname')
    }
  },
  getTagAll (state, resp) {
    if (resp.status === 'success') {
      state.tags = resp.tags
    }
  },
  getIndex (state, resp) {
    if (resp.status === 'success') {
      state.index = resp.tags
    }
  }
}

const getters = {
  token: state => state.token,
  nickname: state => state.nickname,
  tags: state => state.tags,
  index: state => state.index
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
