import { Loading } from 'element-ui'
import router from '../router'
import store from '../vuex/store'

const GlobalMixin = {
  install: function (Vue, options) {
    Vue.mixin({
      created: function () {
        // console.log('plugin HOGEEEEEEEEEEE')
      },
      methods: {
        // 可変長引数
        $gm_config (...key) {
          return GlobalMixin.config(...key)
        },
        $gm_getStorageKey (key) {
          return GlobalMixin.getStorageKey(key)
        },
        $gm_createFormData (data) {
          return GlobalMixin.createFormData(data)
        },
        // token必須api用
        $gm_api (url, data) {
          return GlobalMixin.api(url, data)
        },
        $gm_post (url, data) {
          return GlobalMixin.post(url, data)
        },
        $gm_routerPush (router, name, param = null) {
          return GlobalMixin.routerPush(router, name, param)
        },
        $gm_getStorage (key) {
          return GlobalMixin.getStorageKey(key)
        },
        $gm_setStorage (key, value) {
          return GlobalMixin.setStorageKey(key, value)
        },
        $gm_removeStorage (key) {
          return GlobalMixin.removeStorageKey(key)
        }
      }
    })
  },
  config (...key) {
    let conf = null
    key.forEach(function (value) {
      if (!conf) {
        conf = process.env
      }
      conf = conf[value]
    })
    return conf
  },
  getStorageKey (key) {
    return process.env.STOREGE_PREFIX + key
  },
  getStorage (key) {
    return localStorage.getItem(this.getStorageKey(key))
  },
  setStorage (key, value) {
    return localStorage.setItem(this.getStorageKey(key), value)
  },
  removeStorage (key) {
    return localStorage.removeItem(this.getStorageKey(key))
  },
  createFormData (data) {
    let formData = new FormData()
    for (let key in data) {
      formData.append(key, data[key])
    }
    return formData
  },
  api (url, data) {
    const self = this
    return new Promise(function (resolve, reject) {
      if (!data.token) {
        self.routerPush('SignIn')
        return
      }

      self.post(url, data).then(json => {
        if (json.status === 'authError') {
          store.dispatch('signOut')
          return
        }
        resolve(json)
      })
    })
  },
  post (url, data) {
    // const self = this
    return new Promise(function (resolve, reject) {
      let loadingInstance = Loading.service({ fullscreen: true })
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // body: self.createFormData(data)
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(json => {
        loadingInstance.close()
        resolve(json)
      })
    })
  },
  routerPush (name, param = null) {
    if (param) {
      router.push({name: name, params: param})
    } else {
      router.push({name: name})
    }
  }
}
export default GlobalMixin
