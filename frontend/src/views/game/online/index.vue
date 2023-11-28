<template>
  <PongDisplay v-if="pongData" :socket="socket" :pong-data="pongData" />
</template>

<script setup lang="ts">
import { io } from 'socket.io-client'
import { onMounted, ref, onUnmounted, onBeforeUnmount, inject, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import PongDisplay from "./game.vue"
import { ElMessage } from 'element-plus'
import type { PongData } from './index'
import { EUserPresenceStatus, useUpdateUserPresenceMutation } from '@/graphql/graphql-operations'
import type { User } from '@/graphql/graphql-operations'

const route = useRoute()
const socket = io(`http://localhost:3000`)
const pongData = ref<undefined | PongData>()
const roomId = `${route.params.roomId}`
const loggedInUser = inject<Ref<User>>('loggedInUser')

const { mutate } = useUpdateUserPresenceMutation()

onMounted(() => {
  socket.emit(`joinRoom`, roomId)
  mutate({ args: { connected: EUserPresenceStatus.InGame } })
})

onUnmounted(() => {
  socket.emit(`leaveRoom`)
})

onBeforeUnmount(() => {
  socket.emit('changedPage')
})

window.addEventListener('beforeUnmount', (event) => {
  socket.emit('changedPage')
  mutate({ args: { connected: EUserPresenceStatus.Online } })
})

window.addEventListener('dismount', (event) => {
  socket.emit('changedPage')
})

socket.on(`joinRoomSuccess`, (data: PongData) => {
  if (loggedInUser?.value && loggedInUser.value.id) {
    const playerId = loggedInUser.value.id
  
    socket.emit('setPlayerId', playerId)
  } else {
   
  }
  pongData.value = data
})

socket.on(`playerReady`, (player: string) => {
  ElMessage({
    message: `${player} is Ready to play!`,
    type: `success`,
    duration: 5000,
  })
})

socket.on(`playerAskHardMode`, (player: string) => {
  ElMessage({
    message: `${player} Requested hard mode!<br/> <br/>Select hard mode and start the game if you're feeling risky!`,
    type: `success`,
    dangerouslyUseHTMLString: true,
    duration: 5000,
    customClass: 'centered-message'
  })
})

socket.on(`joinRoomError`, (error) => {
  ElMessage({
    message: `JOIN ROOM ERROR: ${error.message}`,
    type: `warning`,
    duration: 5000,
  })
  pongData.value = undefined
})

socket.on(`joinRoomErrorDone`, (error) => {
  ElMessage({
    message: `THIS GAME IS ALREADY DONE. PLEASE GO BACK TO DASHBOARD.`,
    type: `warning`,
    duration: 5000,
  })
  pongData.value = undefined
})

</script>

<style scoped lang="sass">

.konva-container
  display: flex
  justify-content: flex-start
  align-items: stretch
  margin-top: auto
  height: 100%
  width: 100%

.button
    margin: 0
    height: 50px
    width: 50px
    transition: all 0.3s ease
    position: relative
    overflow: hidden
    border-radius: var(--el-border-radius-base) !important
    transition: 128ms color, 128ms box-shadow
    z-index: 1000 !important

.el-button
  z-index: 1000

.centered-message
  display: flex
  align-items: center
  justify-content: center
  text-align: center

</style> 