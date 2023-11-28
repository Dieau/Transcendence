<template>
  <div class="full">
    <div class="wrapper-header">
      <div class="trans-container">
        <span class="trans-font"> TRANSCENDENCE </span>
      </div>
      <div class="pong-container">
        <span class="pong-font"> PONG </span>
      </div>
    </div>
    <div class="form-container panel-blur">
      <el-form :model="form" label-position="top" @submit.prevent="onSubmitForm" :style="{ width: '100%' }">
        <el-form-item>
          <el-input v-model="form.email" placeholder="Email" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" show-password placeholder="Password" />
        </el-form-item>
        <el-button class="bt-submit" native-type="submit">Connexion</el-button>
      </el-form>
      <el-divider> </el-divider>
      <div class="o-auth">
        <el-button @click="onConnectWithGoogle" class="bt" circle><font-awesome-icon
            :icon="['fab', 'google']" /></el-button>
        <el-button @click="onConnectWithDiscord" class="bt" circle><font-awesome-icon
            :icon="['fab', 'discord']" /></el-button>
        <el-button @click="onConnectWithGithub" class="bt" circle><font-awesome-icon
            :icon="['fab', 'github']" /></el-button>
        <el-button @click="onConnectWithSchool42" class="bt" circle>42</el-button>
      </div>
      <el-divider> </el-divider>
      <el-button @click="pushSignup" class="bt-submit" native-type="submit">Create Account</el-button>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { useSignInLocalMutation } from '@/graphql/graphql-operations'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useFindMyUserQuery } from '@/graphql/graphql-operations'

const refetchLoggedInUser = inject<() => void>('refetchUser')
const router = useRouter()
const { mutate, onDone, onError } = useSignInLocalMutation()


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

const form = ref({
  email: ``,
  password: ``,
  doubleAuthCode: ``
})


onError((e) => {
  if (e.message == `4242`) {
    ElMessageBox.prompt(`Please Enter 2FA authentication Code: `, `2fa`, {
      confirmButtonText: `OK`,
      cancelButtonText: `Cancel`,
      inputPattern: /^\d{6}$/,
      inputErrorMessage: `Invalid Code`,
      closeOnClickModal: false
    }).then(({ value }) => {
      if (value !== null) {
        form.value.doubleAuthCode = value
        onSubmitForm()
        form.value.doubleAuthCode = ``
      }
    })
  }
  else {
    router.push('/login')
    ElMessage({
    showClose: true,
    message: e.message,
    type: `error`
  })
  }
})

const onSubmitForm = () => {
  if (form.value.email === '' || form.value.password === '') {
    ElMessage({
      showClose: true,
      message: 'Please fill in all required fields',
      type: 'error'
    })
    return
  }
  mutate({ args: form.value }).then((res) => {
    if (res)
    {
      if (res.data?.signInLocal.id) {
        if (refetchLoggedInUser) {
          refetchLoggedInUser()
        }
      }
    }
  })
  .catch((error) => {
    router.push(`/login`)
    })
}

const onConnectWithGoogle = () => {
  window.location.href = `/auth/google`
}

const onConnectWithDiscord = () => {
  window.location.href = `/auth/discord`
}

const onConnectWithGithub = () => {
  window.location.href = `/auth/github`
}

const onConnectWithSchool42 = () => {
  window.location.href = `/auth/42`
}

const pushSignup = () => router.push(`signup`)

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

.login
  height: 100%
  position: absolute
  font-size: 2em

.login > .letter
  -webkit-text-stroke: 2px #F4C6F4
  margin-top: -8px
  display: inline-block
  padding: 0 1px
  animation: glow 2.5s linear infinite

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
      top: -10px
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

.create-account
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 40px
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