<template>
  <div>

    <h1>作成</h1>

    <el-form status-icon ref="form" :model="form" :rules="rules" label-position="top" class="add">

      <el-form-item label="Tag" prop="tag">
        <el-input v-model="form.tag" style="width:50%" />
        <el-select v-model="tagCandidate" placeholder="タグ一覧">
          <el-option v-for="tag in tags"
            :key="tag.name"
            :label="tag.name"
            :value="tag.name" />
        </el-select>
      </el-form-item>

      <label v-if="form.tag" class="upload" @dragover.prevent @drop="onDrop">
        <i class="el-icon-picture"></i>
        <br>
        select picture
        <input id="file" type="file" multiple style="display:none" @change="onChange">
      </label>

      <div id="preview"></div>

      <el-row>
        <el-card :body-style="{ padding: '0px' }" v-for="img, key in form.images" :key="key">
          <img :src="img.url">
          <div class="inner">
            <div class="control">
              <el-switch inactive-text="secret" v-model="img.secret" @change="switchSecret" />
              <el-switch inactive-text="markdown" v-model="img.markdown" />
            </div>
            <div v-if="img.markdown" v-html="convertMarkdown(img.memo)" class="markdown-body"></div>
            <el-input
              v-else
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="memo" v-model="img.memo" />
          </div>
        </el-card>
      </el-row>

      <el-form-item v-if="form.images.length">
        <el-button type="primary" @click="create('form')" icon="el-icon-upload">Create</el-button>
      </el-form-item>

    </el-form>
    <a @click="test">aaaaaa</a>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import marked from 'marked'
import 'github-markdown-css/github-markdown.css'
export default {
  name: 'Header',
  computed: {
    ...mapGetters(['token', 'tags']),
    tagCandidate: {
      get () {
        return this.tagCandidateValue
      },
      set (value) {
        this.tagCandidateValue = value

        if (this.form.tag.indexOf(value) !== -1) {
          return
        }
        this.form.tag += this.form.tag ? ' ' + value : value
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      console.log(this.$gm_config('api', 'add'))
      console.log(this.tags)
      this.$store.dispatch('getTagAll')
    })
  },
  methods: {
    test () {
      console.log(this.tags)
    },
    onChange (e) {
      console.log(e)
      const files = e.target.files
      this.previewImage(files)
    },
    onDrop (e) {
      e.preventDefault()
      const files = e.dataTransfer.files
      this.previewImage(files)
    },
    previewImage (files) {
      console.log(files)
      if (!files.length) {
        return false
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // 追加済みの画像はスルー
        if (!this.validationImg(file)) {
          continue
        }

        const reader = new FileReader()
        console.log(reader)
        reader.onload = (event) => {
          console.log(event)

          // 画像リサイズ
          const maxWidth = 1200
          const resize = new Image()
          resize.onload = (event) => {
            console.warn(resize.width)
            console.warn(event)
            const width = resize.width
            const height = resize.height

            let url = resize.src
            if (width > maxWidth) {
              const dstHeight = height / (width / maxWidth)

              const canvas = document.createElement('canvas')
              canvas.width = maxWidth
              canvas.height = dstHeight
              const ctx = canvas.getContext('2d')
              ctx.drawImage(resize, 0, 0, maxWidth, dstHeight)
              url = canvas.toDataURL()
            }

            // 画像をデータ突っ込む
            const data = {
              name: file.name,
              size: file.size,
              url: url,
              memo: '',
              secret: false,
              markdown: false
            }
            this.form.images.push(data)
          }
          resize.src = event.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    switchSecret (e) {
      console.log(e)
    },
    convertMarkdown (html) {
      return marked(html)
    },
    validationImg (file) {
      for (let k = 0; k < this.form.images.length; k++) {
        let img = this.form.images[k]
        console.log(img)
        if (img.name === file.name && img.size === file.size) {
          setTimeout(() => {
            this.$notify({title: '追加済みです', 'message': file.name, type: 'warning'})
          }, 500)
          return false
        }
      }
      return true
    },
    create (formName) {
      console.log(this.form)
      const self = this
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }

        self.form.token = self.token
        self.$gm_api(self.$gm_config('api', 'add'), self.form)
        .then((resp) => {
          console.log(resp)
        })
      })
    }
  },
  data () {
    return {
      form: {
        tag: '',
        images: []
      },
      tagOptions: [
        {
          value: 'val1',
          label: 'hoge1'
        },
        {
          value: 'val2',
          label: 'hoge2'
        }
      ],
      tagCandidateValue: '',
      rules: {
        tag: [
          { required: true, message: 'Please input Tag', trigger: 'blur' },
          { min: 1, max: 100, message: 'length should be 1 to 100', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style scoped>
.upload {
  display:block;
  border: 1px dashed #ccc;
  text-align: center;
  padding: 20px 0;
  border-radius: 4px;
  color:#666;
  cursor:pointer;
  margin-bottom: 15px;
}
.upload i {
  font-size: 40px;
}
.el-row {
  display: flex !important;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
  width: 101.4%;
  margin-left: -0.6%;
  margin-bottom: 15px;
}
.el-row * {
  box-sizing: border-box;
}

.el-card {
  width: 32%;
  margin: 0.66%;
}
.el-card img {
  width: 100%;
}
.el-card .inner {
  padding: 5px 15px 15px;
}
.el-card .control {
  text-align: right;
  margin-bottom: 10px;
}
</style>
