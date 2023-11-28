<template>
    <el-dialog v-model="matchMakingDialogVisible" class="dialog" width="55%">
      <div class="dialog">
        <div class="content-container">
          <span class="top">CHOOSE GAMEMODE</span>
          <div class="image-container">
            <img style="margin:30px" src="../../../assets/gif-pong-nobg.gif">
          </div>
          <div class="action-container">
          <div class="offline-selectors">
            <div class="offline-btn" @click="toggleOfflineGame" :class="{ active: isOfflineGameClicked, neon: isOfflineGameClicked }">
              <p style="font-size: 20px">Local 1v1</p>
            </div>
            <div class="offline-btn" @click="toggleChallengeMode" :class="{ active: isChallengeModeClicked, neon: isChallengeModeClicked }">
              <p style="font-size: 20px">Versus AI</p>
            </div>
          </div>
          <div class="launch-game-btn" @click="handleLaunch()" :class="{ disabled: !isOfflineGameClicked && !isChallengeModeClicked }">
            <h1 style="font-size: 20px">Create Game</h1>
          </div>
        </div>
      </div>
      </div>
    </el-dialog>
</template>

<script setup lang="ts">
  import { ref, provide } from 'vue'
  import { useRouter } from 'vue-router'

  const opponentId = ref<String>('')
  const matchMakingDialogVisible = ref(false)
  const router = useRouter()
  const isOfflineGameClicked = ref(false)
  const isChallengeModeClicked= ref(false)

const addOpponent = (OpponentId:String) => {
  opponentId.value = OpponentId
}
const toggleOfflineGame = () => {
    if (!isOfflineGameClicked.value) {
      isOfflineGameClicked.value = true
      isChallengeModeClicked.value = false
    } else {
      isOfflineGameClicked.value = false
    }
  }

  const toggleChallengeMode = () => {
    if (!isChallengeModeClicked.value) {
      isChallengeModeClicked.value = true
      isOfflineGameClicked.value = false
    } else {
      isChallengeModeClicked.value = false
    }
  }

  const changeDialogVisibility = () => {
    matchMakingDialogVisible.value  ? matchMakingDialogVisible.value = false : matchMakingDialogVisible.value = true
  }

  const onLocalChallengeClicked = async () => {
    router.replace(`/app/game/training/`)
  }

  const onLocalMultiClicked = () => {
    router.replace(`/app/game/local/`)
  }

  const handleLaunch = () => {
    if ( !isOfflineGameClicked.value && !isChallengeModeClicked.value ) return
    if (isChallengeModeClicked.value) {
      onLocalChallengeClicked()
    }
    else if (isOfflineGameClicked.value) {
      onLocalMultiClicked()
    }
    changeDialogVisibility()
  }

  provide('addOpponentNewGameDialog', addOpponent)
  defineExpose({ changeDialogVisibility })
</script>

<style scoped lang="sass">
.dialog
  background-color: #0E0E10
  height: 60vh
  width: 100%
  display: flex
  justify-content: center
  align-items: center
  font-family: "Vaporfuturism"
  .content-container
    display: flex
    height: 100%
    width: 100%
    justify-content: space-evenly
    flex-direction: column
    align-items: center
    .image-container
      display: flex
      justify-content: center
    .top
      font-size: 2.5em
      top: 45px
      font-family: "Vaporfuturism", "Helvetica", sans-serif
      color: #FA26F7
      text-transform: uppercase
      letter-spacing: -2px
      margin: 25px
      -webkit-text-stroke-width: 2px
      -webkit-text-stroke-color: #7b0080
    .action-container
      display: flex
      height: 100%
      width: 100%
      justify-content: space-evenly
      flex-direction: column
      align-items: center
      .player-selectors
        display: flex
        width: 90%
        height: 35%
        flex-direction: row
        justify-content: space-between
        align-items: center
        &.oneplayer
          justify-content: center
          animation: centerAnimation 1.5s ease forwards
        @keyframes centerAnimation 
          0%
            justify-content: space-around
          100%
            justify-content: center

      .offline-selectors
        display: flex
        width: 90%
        flex-direction: row
        justify-content: space-between
        align-items: center
        .offline-btn
          height: 50px
          width: 45%
          background: #151519
          border-radius: 10px
          margin-top: 0px
          margin-bottom: 10px
          display: flex
          justify-content: center
          align-items: center
          cursor: pointer
          &.active
            background: var(--el-color-primary)
            box-shadow: 0 0 10px #f5721b
            animation: neonGlow 1s alternate infinite
        .offline-btn:hover
          background: var(--el-color-primary)
      .message-container
        display: flex
        justify-content: center
        align-items: center
        flex-direction: column
        height: 20%
        width: 90%
        background: #151519
        border-radius: 10px
        .message-wrapper
          width: 80%
      .launch-game-btn
        height: 50px
        width: 90%
        background: #f5721b
        border-radius: 10px
        display: flex
        justify-content: center
        align-items: center
        margin-bottom: 10px
        cursor: pointer
        .launch-game-btn:hover
          box-shadow: 0 10 40px var(--el-color-primary)
        &.disabled
          cursor: not-allowed
          opacity: 0.6

  @keyframes neonGlow
    0%
      box-shadow: 0 0 10px #f5721b
    100%
      box-shadow: 0 0 20px #f5721b

</style>
