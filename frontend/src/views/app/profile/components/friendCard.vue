<template>
	<div class="friend-card-item" @click="handleSelected()" :class="{ 'extended': isSelected }">
		<div class="info-container">
			<MyAvatar :src="usr?.avatarUrl" :userId="props.userId" @click="onRedirectToProfile(props.userId)" style="z-index:10"/>
			<div style="display: flex; flex-direction: column">
				<text style="font-size: 14px;">{{ truncateStr(usr?.username, 16) }}</text>
			</div>
			<el-button v-if="relationStatus == `Friend`" @click="onRedirectToProfile(userId)" ><el-icon><User/></el-icon></el-button>
			<el-button v-if="relationStatus == `WaitingAccept`" @click="acceptFriendRequest()" style="margin:0">
				<el-icon>
					<Select style="color:green" />
					<!-- <Check/> -->
				</el-icon>
			</el-button>
			<el-button v-if="relationStatus == `WaitingAccept`" @click="removeFriend()" style="margin:0">
				<el-icon>
					<Close style="color:red" />
				</el-icon>
			</el-button>
		</div>
		<div v-if="isSelected && relationStatus == 'Friend'" class="interaction-container">
			<div class="iteration-card" @click="onChallengeClicked()">Challenge</div>
			<div v-if="relationStatus == 'Friend'" class="iteration-card" @click="removeFriend()"
				:class="{ error: relationStatus == 'Friend' }">Unfriend</div>
			<div class="iteration-card" @click="onDirectMessageClicked()">Chat</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	useFindUserQuery,
	useAcceptFriendRequestMutation,
	useRefuseFriendRequestMutation,
	useRemoveFriendMutation,
	useJoinGameMatchmakingMemberMutation,
	useSendDirectMessageMutation,
	type UpdateUserRelationInput,
	EUserRealtionType,
} from '@/graphql/graphql-operations'
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import MyAvatar from '@/components/myAvatar.vue'
import { useRouter } from 'vue-router'
import { router } from '@/router'

const props = defineProps<{
	userId: string,
	relationType: string,
	isValidated: boolean,
}>()

const { mutate: acceptfriendrequestmutate } = useAcceptFriendRequestMutation()
const { mutate: refusefriendrequestmutate } = useRefuseFriendRequestMutation()
const { mutate: removefriendmutate } = useRemoveFriendMutation()
const { mutate: joinMatchmakingMutate } = useJoinGameMatchmakingMemberMutation()
const { mutate: sendDirectMessage } = useSendDirectMessageMutation()
const isSelected = ref(false)
const relationStatus = ref<string | undefined>(props.relationType)
const { result } = useFindUserQuery({ args: { id: props.userId || "" } })
const usr = computed(() => result.value?.findUser)

const onRedirectToProfile = async (userid: string) => {
	await router.push('/app/publicprofile?id=' + userid)
}
const handleSelected = () => {
	if (isSelected.value) {
		isSelected.value = false
	}
	else {
		isSelected.value = true
	}
}
const truncateStr = (str: String | undefined, limit: number) => {
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
const acceptFriendRequest = () => {
	if (props.userId) {
		const input: UpdateUserRelationInput = { userTargetid: props.userId }
		acceptfriendrequestmutate({ args: input })
			.then((res) => {
				relationStatus.value = res?.data?.acceptFriendRequest.type
			})
			.catch((Error) => {
				ElMessage.error(Error.message)
			})
	}
}

const removeFriend = () => {
	if (props.userId) {
		const input: UpdateUserRelationInput = { userTargetid: props.userId }
		removefriendmutate({ args: input })
			.then((res) => {
				relationStatus.value = res?.data?.removeFriend.type
			})
			.catch((Error) => {
				ElMessage.error(Error.message)
			})
	}
}

const onDirectMessageClicked = async () => {
	if (props.userId) {
		sendDirectMessage({
			args: {
				otherUserId: props.userId
			}
		}).then(async (res) => {
			router.push(`/app/channel`).then(() =>
				router.replace({ query: { channelId: res?.data?.sendDirectMessage.id } })
			)
		})
	}
}

const onChallengeClicked = () => {
	joinMatchmakingMutate({ userTargetId: props.userId })
		.catch((error) => {
			ElMessage.warning(error)
		})
}

</script>

<style scoped lang="sass">

.friend-card-item
	width: 250px
	height: 40px
	display: flex
	background: rgba(217, 217, 217, 0.04)
	justify-content: space-evenly
	align-items: center
	backdrop-filter: blur(5px) 
	padding-top: 4%
	padding-bottom: 4%
	border-radius: var(--el-border-radius-base)
	border: 3px solid rgba(217, 217, 217, 0.04)
	font-family: 'roboto'
	font-size: 12px
	flex-direction: column
	cursor: pointer
	&.extended
		height: 90px
	.info-container
		width: 100%
		height: 40px
		justify-content: center
		align-items: center
		display: flex
		justify-content: space-evenly
		.activityIndicator
			width: 30%
			height: 80%
			background: rgba(0, 255, 10, 0.18)
			color: rgba(0, 255, 10, 1)
			display: flex
			border-radius: 3px
			justify-content: center
			align-items: center
			&.disconnected
				background: rgba(255, 4, 4, 0.18)
				color: rgba(255, 4, 4, 1)
	.interaction-container
		display: flex
		height: 50%
		width: 100%
		.iteration-card
			height: 80%
			display: flex
			justify-content: center
			align-items: center
			width: 30%
			background: rgba(80, 48, 240, 0.18)
			margin: 2%
			border-radius: 6px
			cursor: pointer
			z-index: 1
			&.error
				background: rgba(255, 4, 4, 0.18)
				color: rgba(255, 4, 4, 1)
			&.info
				background: rgba(205, 255, 4, 0.18)
				color: rgba(205, 255, 4, 1)


</style>