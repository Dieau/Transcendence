<template>
  <div class="full">
    <div class="wrapper-header">
      <div class="trans-container">
        <span class="trans-font">SIGN/UP</span>
      </div>
      <div class="pong-container">
        <span class="pong-font">Join/Us</span>
      </div>
    </div>
    <div class="form-container panel-blur">
      <el-form
    ref="signupFormRef"
    :model="signupForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    size= "default"
    status-icon
    label-position= "top"
  >
        <el-form-item label="Pseudo" prop="pseudo">
          <el-input v-model="signupForm.pseudo"></el-input>
        </el-form-item>
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="signupForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="signupForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="Confirm" prop="retypePassword">
          <el-input v-model="signupForm.retypePassword" show-password></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item>
      <el-button typeuseSignUpLocalMutationmutate="primary" @click="submitForm()">Submit</el-button>
      <el-button @click="pushLogin()">Go back</el-button>
    </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useSignUpLocalMutation } from '@/graphql/graphql-operations'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const { mutate, onDone, onError } = useSignUpLocalMutation()

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const error = urlParams.get(`error`)

  if (error) {
    ElMessage({
      showClose: true,
      message: error,
      type: `error`
    })
  }
})

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const validatePass = (rule: any, value: any, callback: any) => {
  const hasUppercase = /[A-Z]/.test(value)
  const hasLowercase = /[a-z]/.test(value)
  const hasDigit = /[0-9]/.test(value)
  if (value === '') {
    callback(new Error('Enter your password.'))
  }
  if (!hasUppercase) callback(new Error('Password must contain an uppercase character.'))
  else if (!hasLowercase) callback(new Error('Password must contain a lowercase character.'))
  else if (!hasDigit) callback(new Error('Password must contain a digit.'))
  else {
    if (signupForm.retypePassword !== '') {
      if (!signupFormRef.value) return
      signupFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Confirm your password'))
  } else if (value !== signupForm.password) {
    callback(new Error("Passwords don't match!"))
  } else {
    callback()
  }
}

const validatePseudo = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Enter your desired Username'))
  }
  else {
    callback()
  }
}

interface ruleForm {
  pseudo: string
  email: string
  password: string
  retypePassword: string
  notARobot: boolean
}

const signupFormRef = ref<FormInstance>()
const signupForm = reactive<ruleForm>({
  pseudo: '',
  email: '',
  password: '',
  retypePassword: '',
  notARobot: false,
})

const rules: FormRules = {
    pseudo: [
      { required: true, message: 'Enter your desired Pseudo', trigger: 'blur' },
      { min: 3, max: 12, message: 'Your pseudo must be between 3 and 12 characters long!', trigger: 'blur' },
      { validator: validatePseudo, trigger: 'blur' }
    ],
    email: [
      { required: true, message: 'Enter your e-mail address', trigger: 'blur' },
      { type: 'email', message: 'Enter a valid e-mail address', trigger: ['blur', 'change'] }
    ],
    password: [
      { required: true },
      { min: 6, max: 15, message: 'Your password must be between 8 and 16 characters long!', trigger: 'blur' },
      { validator: validatePass, trigger: 'blur' }
    ],
    retypePassword: [
      { required: true, message: 'You need to confirm your password', trigger: 'blur' }, 
      { validator: validatePass2, trigger: 'blur' }
    ]
  }

const submitForm = async () => {
	if (!signupFormRef.value) return
	await signupFormRef.value.validate((valid) => {
		if (valid) {
			mutate({args: {email: signupForm.email, username: signupForm.pseudo, password: signupForm.password}})
      .then(() => {
        pushLogin()
      })
      .catch((error) => {
        ElMessage.error(error.message)
      })
		} else {
			ElMessage({
				showClose: true,
				message: `Please verify your informations!`,
				type: `error`
			})
		}
	})
}

const pushLogin = () => {
  router.push(`login`),
  resetForm(signupFormRef.value)
}

</script>

<style scoped lang="sass">

@import url("https://jackphilippi.com.au/cdn/fonts/outrun_future.otf")

@font-face
  font-family: OutRun
  src: url("https://jackphilippi.com.au/cdn/fonts/outrun_future.otf") format("opentype")

html, body
  height: 100%
  overflow: hidden

body
  text-align: center
  font-family: "Open Sans", sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  background: #111
  background: linear-gradient(#0c141f 40%, #cf33d9 41%, #0c141f 60%)

.wrapper-header
  display: flex
  justify-content: flex-start
  flex-direction: column
  align-items: center
  height: 100%
  z-index: -1
  .trans-container

    margin-top: 80px
    transform: scale(2, 2)

    position: relative
    z-index: 101
    .trans-font
      position: absolute
      top: -30px
      font-family: "Vaporfuturism", "Helvetica", sans-serif
      font-size: 4em
      letter-spacing: -10px
      transform: rotate(-6deg) skew(-3deg) translateX(-50%) scaleX(1.4)
      background: linear-gradient(to bottom, #18191a 32%, #157be6 40%, #ffffff 52%, #18191a 56%, #157be6 85%, #ffffff)
      -webkit-background-clip: text
      -webkit-text-fill-color: transparent
      -webkit-text-stroke-width: 1px
      -webkit-text-stroke-color: #FFF

  .pong-container
    position: relative
    z-index: 110
    .pong-font
      position: absolute
      top: 45px
      font-family: "OutRun", "Helvetica", sans-serif
      transform: translateX(-50%)
      font-size: 4.5em
      color: #FA26F7
      text-transform: uppercase
      letter-spacing: 0px
      transform: translateX(-50%) rotate(-8deg) skew(-3deg)
      -webkit-text-stroke-width: 1px
      -webkit-text-stroke-color: #000

.inner-wrapper
  width: 100%
  height: 100%
  position: absolute
  margin: 0 auto
  perspective: 180px
  perspective-origin: 50% 40%
  display: flex
  flex-wrap: wrap

.landscape
  position: absolute
  width: 200%
  left: -50%
  height: 130%
  bottom: -30%
  background-image: -webkit-linear-gradient(top, #CF33D9 2px, transparent 2px), -webkit-linear-gradient(left, #CF33D9 2px, transparent 2px)
  background-size: 50px 50px, 80px 80px
  background-position: -1px -1px, -1px -1px
  transform: rotateX(85deg)
  animation: moveUp 1s infinite linear

.nrw
  z-index: 50
  margin-bottom: 600px
  flex-shrink: 0
  white-space: nowrap

.new
  font-size: 5.2em
  text-transform: uppercase
  font-family: "Open Sans"
  color: transparent
  position: relative
  display: block
  letter-spacing: -15px
  transform: rotate(-10deg) skew(-20deg)
  margin-left: 280px
  margin-bottom: -20px

.new > .letter
  -webkit-text-stroke: 2px #F4C6F4
  margin-top: -8px
  display: inline-block
  padding: 0 1px
  animation: glow 2.5s linear infinite

@keyframes moveUp
  0%
    background-position: -1px -1px, -1px -1px
  100%
    background-position: -50px -50px, -1px -1px

@keyframes glow
  0%
    filter: drop-shadow(0 0 6px #CF33D9) drop-shadow(0 0 6px #CF33D9)
  50%
    filter: drop-shadow(0 0 1px #CF33D9) drop-shadow(0 0 1px #CF33D9)
  100%
    filter: drop-shadow(0 0 6px #CF33D9) drop-shadow(0 0 6px #CF33D9)

.retro
  font-size: 5.5em
  font-weight: 800
  display: block
  text-transform: uppercase
  letter-spacing: -12px
  transform: rotate(-10deg) skew(-15deg)
  margin-bottom: -70px



.full
  height: 100%
  width: 100%
  position: fixed
  top: 0
  left: 0
  display: flex
  align-items: center
  justify-content: center

.form-container
  width: 400px
  border: (--el-border)
  border-radius: 5%
  display: flex
  flex-direction: column
  padding: 25px
  padding-top: 70px
  gap: 20px
  justify-content: center
  align-items: center
  position: absolute
  overflow: hidden
  margin-top: 125px
  .title
    @extend .letter

.form-container:hover
  box-shadow: var(--my-box-shadow)

.form-title
  font-family: sans-serif
  font-size: 16px
  color: white
  margin: 5px

.create-account
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 60px
  border: (--el-border)
  border-radius: (--el-border-radius-base)
  background-color: transparent
  color: white
  text-decoration: none
  font-family: sans-serif
  font-size: 16px
  color: white

.create-account:hover
  box-shadow: var(--my-box-shadow)
  color: var(--el-color-primary)

.bt-submit
  width: 100%

.o-auth
  display: flex
  .bt
    height: 40px
    width: 40px

.bt:hover
    box-shadow: var(--my-box-shadow)
</style>
