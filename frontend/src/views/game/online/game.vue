<template>
  <div class="konva-container">
    <div class="konva" id="konvaRef"></div>
  </div>
</template>

<script setup lang="ts">
import { Pong } from './index'
import { onMounted, ref } from 'vue'
import type { Socket } from 'socket.io-client'
import type { PongData } from './index'

const pong = ref<Pong | undefined>(undefined)

const props = defineProps<{
  socket: Socket,
  pongData: PongData
}>()

onMounted(() => {
  pong.value = new Pong(props.socket, props.pongData)
})

</script>

<style scoped lang="sass">

.konva-container
  display: flex
  justify-content: center
  align-items: center
  top: 0
  left: 5px
  padding-left: 5px
  padding-right: 5px
  .konva
    margin-top: -15px
    height: 600px
    width: 800px

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
</style> 