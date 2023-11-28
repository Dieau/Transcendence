<template>
  <el-container class="container-app">
    <el-aside class="aside" v-if="!bar">
      <NavBar />
    </el-aside>
    <el-container class="center">
      <div class="center-background panel-blur" />
      <router-view class="center-main" />
    </el-container>
    <el-footer v-if="bar" style="width: 100%; display: flex; justify-content: center;">
      <NavBarMobile />
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { EUserPresenceStatus, useUpdateUserPresenceMutation,} from '@/graphql/graphql-operations'
import NavBar from './navBar/index.vue'
import NavBarMobile from './navBarMobile/index.vue'
import { ref, onMounted, watch, onUnmounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const { mutate } = useUpdateUserPresenceMutation()

const route = useRoute()
const isGamePage = computed(() => {
  const fullPath = route.fullPath
  return fullPath.startsWith('/app/game/online')
})

const bar = computed(() => {
  if (isMobile.value)
    return true
  else if (isGamePage.value)
    return true
  return false
})

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  mutate({ args: { connected: EUserPresenceStatus.Online } })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

watch(isMobile, () => {
  document.body.style.overflow = 'hidden'
  setTimeout(() => {
    document.body.style.overflow = 'auto'
  }, 0)
})
</script>

<style scoped lang="sass">
.container-app
  height: 100%
  padding: 20px 0px 20px 0px 
  border-radius: var(--el-border-radius-base)
  // background: linear-gradient(6deg, rgba(233,172,99,1) 0%, rgba(221,146,111,1) 100%)
  .aside
    width: 80px
  .center
    position: relative
    margin-right: 20px
    .center-background
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      border-radius: var(--el-border-radius-base)
    .center-main
      position: relative
      padding: 20px
      
</style>
