<template>
	<div class="matchmaking-item-layout">
			<div class="head-text-view">
				<div class="player-and-ration-layout" v-if="matchmakingItem?.userGameInfos">
					<p class="player-text">PLAYER</p>
					<p class="username-text">{{ truncateStr(matchmakingItem?.userGameInfos?.username, 15) || "-" }}</p>
				</div>
				<div class="player-and-ration-layout">
					<p class="player-text">WINS</p>
					<p class="ratio-text" v-if="matchmakingItem" style="color: var(--el-color-primary)" >{{ (matchmakingItem?.userGameInfos?.ratio * 100).toFixed(0) || "0"}}%</p>
				</div>
			</div>
			<div class="picture-view">
				<img class="picture" src="../../../assets/card.png"/>
			</div>
				<div class="message-layout">
					<div v-if="!matchmakingItem?.targetUserId" style="display:flex; flex-direction: row;">
						<img src="../../../assets/icon-message.svg">
						<h1 class="message-text">This player is in matchmaking</h1>
					</div>
					<div v-if="matchmakingItem?.targetUserId" style="display:flex; flex-direction: row; justify-content: center; align-items:center">
						<div class="accept-btn" @click="acceptGameInvite()">Accept</div>
						<div class="refuse-btn" @click="refuseGameInvite()">Decline</div>
					</div>
				</div>
		</div>
</template>
	  
<script setup lang="ts">
import { type GameMatchmakingMember, useJoinGameMatchmakingMemberMutation, useRefuseMatchMakingInviteMutation } from '@/graphql/graphql-operations'
import { ElMessage } from 'element-plus'

const { mutate:joinMatchmakingMutate } = useJoinGameMatchmakingMemberMutation()
const { mutate:refuseMatchmakingMutate } = useRefuseMatchMakingInviteMutation()

const props = defineProps({
  matchmakingItem: Object as () => GameMatchmakingMember
})

const acceptGameInvite = () => {
	joinMatchmakingMutate({ userTargetId : props.matchmakingItem?.userId})
	.catch((error) => {
		ElMessage.error(error)
	})
}

const refuseGameInvite = () => {
	if (props.matchmakingItem?.userId ) {
		refuseMatchmakingMutate({ matchMakerId: props.matchmakingItem.userId })
		.catch((error) => {
			ElMessage.error(error)
	})
	}
}
const truncateStr = (str:String, limit:number) => {
	if (!str) {
		return
	}
	if (str.length < limit) {
		return str
	}
	else {
		return str.slice(0, limit) + "..."
	}
}


</script>

<style scoped lang="sass">

.matchmaking-item-layout
	display: flex
	flex-shrink: 0
	height: 90%
	margin-top: 5%
	max-height: 80%
	width: 15vw
	margin-left: 30px
	flex-direction: column
	background: #111115
	border-radius: var(--el-border-radius-base)
	align-self: center
	&.isprivate
		border: 1px solid #EDB15A

	.head-text-view
		display: flex
		flex-direction: row
		justify-content: space-between
		
	.picture-view
		height: 50%
		width: 70%
		justify-self: center
		align-self: center
	.picture
		width: 100%
		height: 100%
		border-radius: var(--el-border-radius-base)

	.player-text
		font-family: "Roboto"
		font-weight: 300
		letter-spacing: 0.35em
		font-size: 9px
		-webkit-font-smoothing: antialiased
		-moz-osx-font-smoothing: grayscale

	.player-and-ration-layout
		display: flex
		justify-content: stretch
		flex-direction: column
		margin: 10px
		margin-bottom: 0px

	.message-layout
		margin: 10px
		margin-bottom: -4px
		display: flex
		justify-content: stretch
		flex-direction: column
	.message-text
		font-family: "Roboto"
		font-weight: 400
		font-size: 10px
		// margin-top: -6px

	.username-text
		font-family: "Roboto"
		font-weight: 400
		color: #f5721b
		font-size: 20px
		-webkit-font-smoothing: antialiased
		-moz-osx-font-smoothing: grayscale
		margin-top: -5px

	.ratio-text
		font-family: "Roboto"
		font-weight: 400
		font-style: italic
		color: #f5721b
		font-size: 20px
		-webkit-font-smoothing: antialiased
		-moz-osx-font-smoothing: grayscale
		margin-top: -5px

	.accept-btn
		background: rgba(0, 255, 10, 0.18)
		align-items: center
		width: 45%
		display: flex
		justify-content: center
		margin-right: 2%
		border-top-left-radius: 5px
		border-bottom-left-radius: 5px
		height: 100%
		padding: 1%
		color: #00FF0A
		cursor: pointer
	.refuse-btn
		background: rgba(255, 4, 4, 0.18)
		width: 45%
		align-items: center
		display: flex
		justify-content: center
		margin-left: 2%
		border-top-right-radius: 5px
		border-bottom-right-radius: 5px
		height: 100%
		padding: 1%
		color: rgba(255, 4, 4, 1)
		cursor: pointer
</style>
	  