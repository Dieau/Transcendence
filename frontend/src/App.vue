<template>
  <div class="full-app" v-loading.fullscreen.lock="onConnectQuery">
    <el-dialog v-model="showAcceptedGameDialog" v-if="showAcceptedGameDialog" class="dialog" @close="onClosedDialog()"
      width="45%">
      <div class="title">
        Your Game is ready to start!
      </div>
      <div class="duel-wrapper"
        style="height: 400px; display: flex; flex-direction: row; justify-content: space-around; align-items: center;">
        <div class="playerCard" v-if="acceptedGame && acceptedGame?.gameMembers && acceptedGame?.gameMembers[0]">
          <el-avatar class="avatar" :src="acceptedGame?.gameMembers[0].userGameInfos.avatarUrl"></el-avatar>
          <p class="pseudo">{{ acceptedGame?.gameMembers[0].userGameInfos.username }}</p>
        </div>
        <p class="vs">VS</p>
        <div class="playerCard" v-if="acceptedGame && acceptedGame?.gameMembers && acceptedGame?.gameMembers[1]">
          <el-avatar class="avatar" :src="acceptedGame?.gameMembers[1].userGameInfos.avatarUrl"></el-avatar>
          <p class="pseudo">{{ acceptedGame?.gameMembers[1].userGameInfos.username }}</p>
        </div>
      </div>
      <div class="offline-selectors">
        <div class="offline-btn-start" @click="onAcceptedGame">
          <p style="font-size: 20px">Start Game</p>
        </div>
        <div class="offline-btn-cancel" @click="onClosedDialog()">
          <p style="font-size: 20px">Refuse Match</p>
        </div>
      </div>
    </el-dialog>
    <Background v-if="isLoginPage" />
    <BackgroundLogin v-else />
    <router-view class='app-body' v-if="!onConnectQuery" />
  </div>
</template>

<script setup lang="ts">
import {
  useFindMyUserQuery,
  useFindAllGamesQuery,
  useAllGamesUpdatedSubscription,
  useLeaveGameMutation,
  useMatchmakingMembersChangedSubscription,
  useLeaveGameMatchmakingMemberMutation,
  useFindAllGameMatchmakingMemberlQuery,
  useUserGameUpdatedSubscription,
  type User, type Game,
  type GameMatchmakingMember,
  useUpdateUserPresenceMutation,
  EUserPresenceStatus
} from '@/graphql/graphql-operations'
import { ElMessage, ElNotification, type NotificationHandle } from 'element-plus'
import { ref, provide, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import Background from './views/BackgroundRetroWave.vue'
import BackgroundLogin from './views/BackGroundRetroWaveLogin.vue'

const isLoginPage = computed(() => {
  const fullPath = route.fullPath
  return fullPath.startsWith('/login') || fullPath.startsWith('/signup')
})
const showAcceptedGameDialog = ref<Boolean>(false)
const route = useRoute()
const router = useRouter()
const loggedInUser = ref<User>()
const acceptedGame = ref<Game>()
const onConnectQuery = ref(true)
const gameLaunched = ref(false)
const usersOnmatchmaking = ref<GameMatchmakingMember>()
const isNotificationOnAutoClose = ref(false)
const isMatchmakingNotificationOpen = ref(false)
const localMatchmakings = ref<GameMatchmakingMember[]>([])
const localGames = ref<Game[]>([])
const OpenMatchmakingNotifInstance = ref<NotificationHandle>()
const HostedGameNotifInstance = ref<NotificationHandle>()
const InvitedToGameNotifInstance = ref<NotificationHandle>()
const { result: myUser, onResult, onError, refetch: refetchLoggedInUser } = useFindMyUserQuery()
const { onResult: queryGamesOnRes, refetch: refetchGames } = useFindAllGamesQuery()
const { onResult: queryMatchmakersOnRes, refetch: refetchMahMakers } = useFindAllGameMatchmakingMemberlQuery()
const { onResult: gamesOnRes } = useAllGamesUpdatedSubscription()
const { mutate: leaveGameMutate } = useLeaveGameMutation()
const { mutate: leaveMatchMakingMutate } = useLeaveGameMatchmakingMemberMutation()
const { onResult: onResultsMatchMaker } = useMatchmakingMembersChangedSubscription()
const { variables: UserGameUpdatedVariables, onResult: onResultUserGame } = useUserGameUpdatedSubscription({ userId: '' })
const { mutate } = useUpdateUserPresenceMutation()

onMounted(async () => {
})

window.onbeforeunload = () => {
  if (myUser.value) {
    mutate({ args: { connected: EUserPresenceStatus.Offline } })
  }
}

const onClosedSearchGameNotif = () => {
  if (!isNotificationOnAutoClose.value) {
    leaveMatchMakingMutate()
      .catch(() => { })
    ElMessage.info('You left Matchmaking.')
  }
  isMatchmakingNotificationOpen.value = false
  isNotificationOnAutoClose.value = false
}

const onClosedHostedGameNotif = () => {
  if (!isNotificationOnAutoClose.value) {
    leaveMatchMakingMutate()
      .catch(() => { })
    ElMessage.info('You cancelled your Game Invitation.')
  }
  isMatchmakingNotificationOpen.value = false
  isNotificationOnAutoClose.value = false
}

const openMatchMakingNotification = () => {
  if (!isMatchmakingNotificationOpen.value) {
    OpenMatchmakingNotifInstance.value = ElNotification({
      position: 'bottom-right',
      title: `Looking for live games`,
      message: 'You currently are in Matchmaking. Close this panel to cancel the queue.',
      onClose: onClosedSearchGameNotif,
      duration: 0
    })
    isMatchmakingNotificationOpen.value = true
  }
}

const openHostedPrivateGameNotification = () => {
  HostedGameNotifInstance.value = ElNotification({
    position: 'bottom-right',
    title: `Player Invited !`,
    message: 'You invited a player to a game, waiting for his approval... Close this panel to cancel',
    onClose: onClosedHostedGameNotif,
    showClose: true,
    duration: 0
  })
}

const openInvitedPrivateGameNotification = () => {
  InvitedToGameNotifInstance.value = ElNotification({
    position: 'bottom-right',
    title: `You received a game invite !`,
    message: 'Someone wants to challenge you, check your Dashboard !',
    onClick: onAcceptedGameInvitation,
    duration: 30000
  })
}

const onAcceptedGameInvitation = () => {
  router.replace(`/app/home`)
  InvitedToGameNotifInstance.value?.close()
}

const resetLoggedInUserOnLogout = () => {
  if (loggedInUser.value) {
    loggedInUser.value = undefined
  }
}

queryGamesOnRes((res) => {
  if (res.data && res.data.findAllGames) {
    let ret: Game[] = res.data.findAllGames
    const activeGame = ret.find(game => game.gameMembers?.find(mMemeber => mMemeber.userId == loggedInUser.value?.id))
    if (activeGame && !route.fullPath.startsWith(`/app/game/online`)) {
      gameLaunched.value = false
      acceptedGame.value = activeGame
      showAcceptedGameDialog.value = true
    }
    else {
      gameLaunched.value = false
      acceptedGame.value = undefined
      showAcceptedGameDialog.value = false
    }
    localGames.value = ret
  }
})

gamesOnRes((res) => {
  const game = res.data?.allGamesUpdated
  if (game) {
    const tmp = [...localGames.value]
    if (game.isDeleted) {
      localGames.value = tmp.filter(tmpgame => tmpgame.id !== game.id)
    } else {
      const existingIndex = tmp.findIndex(tmpgame => tmpgame.id === game.id)
      if (existingIndex > -1) {
        tmp[existingIndex] = game
      } else {
        tmp.unshift(game)
      }
      localGames.value = tmp
    }
  }
})

onResultUserGame(async (res) => {
  if (res.data?.UserGameUpdated) {
    const game: Game = res.data?.UserGameUpdated
    if (game) {
      if (!game.isDeleted) {
        gameLaunched.value = false
        acceptedGame.value = game
        showAcceptedGameDialog.value = true
      }
      if (game.isDeleted) {
        ElMessage.error("Your opponenent left the game, go back to Dashboard.")
        await onClosedDialog()
      }
    }
  }
})

queryMatchmakersOnRes((res) => {
  if (res.data && res.data.findAllGameMatchmakingMemberl) {
    let ret: GameMatchmakingMember[] = res.data.findAllGameMatchmakingMemberl
    localMatchmakings.value = ret
    if (loggedInUser.value) {
      const userId = loggedInUser.value.id
      if (userId) {
        if (res.data.findAllGameMatchmakingMemberl && userId && res.data.findAllGameMatchmakingMemberl.find((member) => member.userId == userId)) {
          openMatchMakingNotification()
        }
      }
    }
  }
})

//result for matchmaker subscription
onResultsMatchMaker((res) => {
  const member = res.data?.matchmakingMembersChanged
  const tmp = [...localMatchmakings.value]

  if (member) {
    if (member.isDeleted) {
      localMatchmakings.value = tmp.filter(tmpmember => tmpmember.userId !== member.userId)
    } else {
      const existingIndex = tmp.findIndex(tmpmember => tmpmember.userId === member.userId)
      if (existingIndex > -1) {
        tmp[existingIndex] = member
      } else {
        tmp.unshift(member)
      }
      localMatchmakings.value = tmp
    }
  }
  if (member && member.userId == loggedInUser.value?.id) {
    if (!member.isDeleted) {
      isNotificationOnAutoClose.value = false
      if (!member.targetUserId) { //public game hosting context
        openMatchMakingNotification()
      }
      if (member.targetUserId) { //hosted private context
        openHostedPrivateGameNotification()
      }
    }
    else {
      if (OpenMatchmakingNotifInstance.value) {
        isNotificationOnAutoClose.value = true
        OpenMatchmakingNotifInstance.value?.close()
      }
      if (HostedGameNotifInstance.value) {
        isNotificationOnAutoClose.value = true
        HostedGameNotifInstance.value?.close()
      }
    }
  }
  if (member && loggedInUser.value && member.targetUserId == loggedInUser.value.id) {
    if (!member.isDeleted) {
      openInvitedPrivateGameNotification()
    }
    else if (member.isDeleted && !member.isLaunched && !showAcceptedGameDialog.value) {
      ElMessage.info('Your game invite has been refused. Play versus our Bot if you are desperate.')
      if (HostedGameNotifInstance.value) {
        HostedGameNotifInstance.value.close()
      }
      if (InvitedToGameNotifInstance.value) {
        InvitedToGameNotifInstance.value.close()
      }
    }
  }
})

//handling af login error (need rework)
onError(() => {
  if (!route.fullPath.startsWith(`/login`))
    router.replace(`/login`)
  onConnectQuery.value = false
})

//handling of login
onResult(async (res) => {
  if (await res.data && await res.data.findMyUser.id) {
    loggedInUser.value = res.data.findMyUser
    if (loggedInUser.value) {
      provide('loggedInUser', loggedInUser)
      refetchGames()
      UserGameUpdatedVariables.value = { userId: loggedInUser.value.id }
      if (!localMatchmakings.value.length) {
        refetchMahMakers()
      }
      setTimeout(() => {
        if (!route.fullPath.startsWith(`/app`))
          router.replace(`/app/home`)
        onConnectQuery.value = false
      }, 500)
    }
  }
  else if (res.data) {
    router.replace(`/login`)
    onConnectQuery.value = false
  }
})

const onClosedDialog = async () => {
  showAcceptedGameDialog.value = false
  refetchGames()
  if (!gameLaunched.value) {
    leaveGameMutate()
      .then(() => {
        refetchGames()
      })
      .catch(() => { })
  }
}

const onAcceptedGame = () => {
  gameLaunched.value = true
  showAcceptedGameDialog.value = false
  router.push(`/app/game/online/${acceptedGame.value?.id}`)
}

provide('loggedInUser', loggedInUser)
provide('resetLoggedInUserOnLogout', resetLoggedInUserOnLogout as () => void)
provide('matchmakingsSub', usersOnmatchmaking)
provide('localMatchmakings', localMatchmakings)
provide('localGames', localGames)
provide('refetchUser', refetchLoggedInUser as () => void)

</script>

<style scoped lang="sass">
.dialog
  .title
    display: flex
    justify-content: center
    align-items: center
    font-family: 'OutRun'
    color: var(--el-color-primary)
    font-size: 30px
    margin-top: -50px
  
  .vs
    font-family: 'OutRun'
    color: var(--el-color-primary)
    font-size: 50px
    margin-top: -5px
    text-shadow: 0 0 10px #f5721b
    animation: neonGlowText 1s alternate infinite
  
  .photo-container img
    width: 100%
    height: auto
  
  .special-message-field
    margin-top: 20px
    .field-title
      font-weight: bold

  .button-container
    margin-top: 20px
    display: flex
    justify-content: center
.full-app
  position: fixed
  top: 0
  left: 0
  height: 100%
  width: 100%
  display: flex
  align-items: center
  justify-content: center
  background: black
  .duel-wrapper
    width: 100%
    display: flex
    flex-direction: column
    .playerCard
      display: flex
      flex-direction: column
      align-items: center
      .avatar
        width: 130px
        height: 130px
        border-radius: 50%
        overflow: hidden
      .pseudo
        color: var(--el-color-primary)
        padding-top: 10px
        font-family: 'Vaporfuturism'
        font-size: 30px
        margin-top: 5px
  .offline-selectors
    display: flex
    width: 100%
    flex-direction: row
    justify-content: space-around
    align-items: center
    font-family: "Vaporfuturism", "Helvetica", sans-serif
    .offline-btn-start
      height: 50px
      width: 45%
      background: #f5721b
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
    .offline-btn-start:hover
      background: var(--el-color-primary)
      box-shadow: 0 0 10px #f5721b
      animation: neonGlow 1s alternate infinite
    .offline-btn-cancel
      height: 50px
      width: 45%
      background: #f5721b
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
    .offline-btn-cancel:hover
      background: var(--el-color-primary)
      box-shadow: 0 0 10px #f5721b
      animation: neonGlow 1s alternate infinite

.app-body
  position: fixed
  top: 0
  left: 0
  height: 100%
  width: 100%

@keyframes neonGlow
  0%
    box-shadow: 0 0 10px #f5721b
  100%
    box-shadow: 0 0 20px #f5721b

@keyframes neonGlowText
  0%
    text-shadow: 0 0 10px #f5721b
  100%
    text-shadow: 0 0 20px #f5721b
</style>
