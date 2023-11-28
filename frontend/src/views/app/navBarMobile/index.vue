<template>
  <div class="nav-bar-container">
    <div class="top" style="display: flex; justify-content: center; align-items: center; width: 100%;">
      <div class="panel-blur button-container">
        <el-button class="button" text @click="pushHome" :class="{selected: homeIsSelected}">
            <font-awesome-icon icon="gauge"></font-awesome-icon>
        </el-button>
      </div>
      <div class="panel-blur button-container">
        <el-button class="button" text @click="pushMessages" :class="{selected: messagesIsSelected}">
          <font-awesome-icon icon="paper-plane"></font-awesome-icon>
        </el-button>
      </div>
      <div class="panel-blur button-container">
        <el-button class="button" text @click="pushLeaderBoard" :class="{selected: leaderBoardIsSelected}">
          <font-awesome-icon icon="fa-ranking-star"></font-awesome-icon>
        </el-button>
      </div>
      <div class="panel-blur button-container">
        <el-button class="button" text @click="pushProfile" :class="{selected: profileIsSelected}">
          <font-awesome-icon icon="user"></font-awesome-icon>
        </el-button>
        </div>
      <div class="panel-blur button-container">
        <el-button class="button" text @click="disconnected">
          <font-awesome-icon icon="power-off"></font-awesome-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogoutMutation } from '@/graphql/graphql-operations'
import { useRouter, useRoute } from 'vue-router'
import { computed, inject } from "vue"

const route = useRoute()
const router = useRouter()

const pushHome = async () => { 
    await router.push(`/app/home`)
}

const pushMessages = async () => { 
    await router.push(`/app/channel`)
}

const pushLeaderBoard = async () => {
    await router.push(`/app/leaderboard`)
}

const pushProfile = async () => {
    await router.push(`/app/profile`)
}

const homeIsSelected = computed(() => route.fullPath.startsWith(`/app/home`))
const messagesIsSelected = computed(() =>  route.fullPath.startsWith(`/app/channel`))
const leaderBoardIsSelected = computed(() =>  route.fullPath.startsWith(`/app/leaderboard`))
const profileIsSelected = computed(() => route.fullPath.startsWith(`/app/profile`))

const { mutate } = useLogoutMutation()
const resetLoggedInUserOnLogout = inject<() => void>('resetLoggedInUserOnLogout')

const disconnected = async () => {
  mutate().then(() => {
    router.replace(`/login`)
    if (resetLoggedInUserOnLogout) {
      resetLoggedInUserOnLogout()
    }
  })
}
</script>

<style scoped lang="sass">
.nav-bar-container
  position: fixed
  bottom: 1px
  margin: 0 auto
  display: flex
  justify-content: center
  flex-direction: column
  align-items: center
  transform: translateY(-50%)
  box-shadow: 0px -5px 15px rgba(0, 0, 0, 0.1)
  z-index: 999
  .button-container
    height: 30px
    width: 30px
    border-radius: var(--el-border-radius-base) !important
    display: flex
    flex-direction: row
    gap: 20px
    .button
      margin: 0
      height: 30px
      width: 30px
      transition: all 0.3s ease
      position: relative
      overflow: hidden
      border-radius: var(--el-border-radius-base) !important
      transition: 128ms color, 128ms box-shadow
    .button:hover
      color: var(--el-color-primary)
    .button.selected
      color: var(--el-color-primary)
      box-shadow: var(--my-box-shadow)
.top
  display: flex
  align-items: center
  flex-direction: row
  gap: 10px
</style>
