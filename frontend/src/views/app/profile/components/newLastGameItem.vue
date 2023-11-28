<template>
    <div class="last-game-item">
        <div class="avatar-container" v-if="userPublic && userPublic.id" @click="onRedirectToPublicProfile(userPublic?.id)" :class="{'Won' : Number(score1) >= Number(score2)}">
            <el-avatar :src="userPublic?.avatarUrl"/>
        </div>
        <div class="username" style="color: #f5721b; font-family: BaseRetroWave;">{{ userPublic ? truncateStr(userPublic.username) : 'Loading...' }}</div>
		<div :class="['status', Number(score1) >= Number(score2) ? 'Won' : 'Lost']">
    		{{ Number(score1) >= Number(score2) ? 'Won' : 'Lost' }}
		</div>
        <div class="score" style="color: var(--el-color-primary)">{{ score1 }} - {{ score2 }}</div>
        <div :class="['status', Number(score1) < Number(score2) ? 'Won' : 'Lost']">
    		{{ Number(score1) <= Number(score2) ? 'Won' : 'Lost' }}
		</div>
        <div class="opponent-name" style="color: #f5721b; font-family: BaseRetroWave;">{{ opponentPublic ? truncateStr(opponentPublic.username) : 'Loading...' }}</div>
        <div class="avatar-container" v-if="opponentPublic" @click="onRedirectToPublicProfile(opponentPublic?.id)" :class="{'Won' : Number(score1) <= Number(score2)}">
            <el-avatar :src="opponentPublic?.avatarUrl"/>
        </div>
    </div>
</template>

<script lang="ts">
import { useFindUserQuery, type UserPublic } from '@/graphql/graphql-operations'
import {ref, computed, type ComputedRef } from "vue"
import { useRouter } from 'vue-router'

export default {
  name: `statistic-card`,
  props: {
	idPlayer1: String,
	score1: String,
	idPlayer2: String,
	score2: String
  },
  setup(props) {
    const router = useRouter()
    const userPublicRef = ref<ComputedRef<UserPublic | undefined>>()
	const opponentPublicRef = ref<ComputedRef<UserPublic | undefined>>()

	if (props.idPlayer1) {
		const { result:resultForMyUserPlayer } = useFindUserQuery({ args: {id: props.idPlayer1} })
		userPublicRef.value = computed(() => resultForMyUserPlayer.value?.findUser)
	}
	if (props.idPlayer2) {
		const { result:resultForMyUserOpponent } = useFindUserQuery({ args: {id: props.idPlayer2} })
		opponentPublicRef.value = computed(() => resultForMyUserOpponent.value?.findUser)
	}

    const truncateStr = (str:String) => {
        if (str.length < 16) {
            return str
        }
        else {
            return str.slice(0, 8) + "..."
        }
    }
    const userPublic = userPublicRef.value
    const opponentPublic = opponentPublicRef.value
    const onRedirectToPublicProfile = async (userId : string | undefined) => {
        if (userId) {
            await router.push("/app/publicprofile?id=" + userId)
        }
    }

	return {
	  userPublic,
	  opponentPublic,
      truncateStr,
      onRedirectToPublicProfile
	}
}
}
</script>

<style scoped lang="sass">

.last-game-item
    width: 65vw
    height: 10vh
    display: flex
    margin: 20px
    border-radius: var(--el-border-radius-base)
    background: #111115
    justify-content: space-evenly
    align-items: center

    .avatar-container
        display: flex
        border-radius: 180px
        padding: 3px
        background: transparent
        border: 3px solid #58595E
        cursor: pointer
        &.Won
            border: 3px solid #00FF0A
    .username, .opponent-name
            font-family: "Roboto"
            font-weight: 300
            color: #00FF0A
            font-size: 20px
            margin-top: 0px
            -webkit-font-smoothing: antialiased
            -moz-osx-font-smoothing: grayscale

    .score
        font-size: 1.5em
        font-weight: bold
        font-family: "Roboto"

    .status
        font-weight: bold
        font-family: "Roboto"
        padding: 10px
        border-radius: var(--el-border-radius-base)

        &.Won
            color: #00FF0A
            background: rgba(0, 255, 10, 0.18)

        &.Lost
            color: #FF0404
            background: rgba(255, 4, 4, 0.18)

    .last-game-item:hover
        box-shadow: var(--my-box-shadow)

</style>