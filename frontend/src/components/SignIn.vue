<template>
  <div>
    <h1>Sign In</h1>

    <el-form status-icon ref="form" :model="form" :rules="rules">

      <el-form-item label="Account" prop="account">
        <el-input v-model="form.account"/>
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="form.password"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="signIn('form')">Sign In</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  name: 'SignIn',
  data () {
    return {
      form: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: 'Please input Account', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input Password', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    signIn (formName) {
      console.log(this.$gm_config('NODE_ENV'))
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch('signIn', {
            account: this.form.account,
            password: this.form.password
          })
        }
      })
    }
  }
}
</script>
