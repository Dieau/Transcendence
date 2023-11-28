<template>
	<el-container class="wrapper">
		<el-container>
			<el-aside width="20%" class="debug-aside">
				<el-row justify="center">
					<el-col span=8>
						<el-avatar shape="square" :size="150" fit="cover" :src="user?.avatarUrl" />
					</el-col>
				</el-row>
				<el-row justify="center"><el-col span=8
						style="font-size: x-large; font-weight: bold; font-family: 'roboto';">{{ user?.username
						}}</el-col></el-row>
				<el-row justify="center">
					<el-divider style="width: 75%;" />
				</el-row>
				<el-row justify="center">
					<el-col span=8 v-if="user">
						<el-button v-if="relation?.type === EUserRealtionType.Friend" @click="removeFriend()">Remove
							Friend</el-button>
						<el-button v-if="relation?.type === EUserRealtionType.PendingAccept" @click="removeFriend()">Cancel
							Friend Request</el-button>
						<el-button v-if="(!relation || relation.type == 'Terminated') && user?.id != loggedInUser?.id"
							@click="createFriendRequest()">Add to Friendlist</el-button>
					</el-col>
				</el-row>
			</el-aside>
			<el-container>
				<el-header class="debug-header">
					<statsComponent style="z-index: 12;" :meanPoints="userGeneralStats?.MeanPoints"
						:winrate="userGeneralStats?.allTimeRatio" :evolution="(progressGameStats as GameStat[])"
						:played-games="userGeneralStats?.gamesCount" :w-ranking="userGeneralStats?.leaderBoardPosition" />
				</el-header>


				<el-main class="debug-main-component">
					<el-container style="height: 100%; width:100%; align-items: center;" direction="vertical">
						<div class="graph-container">
							<gameHistoryGraph v-if="user" style="height: 100%; width: 100%; display: flex;"
								:userId="user?.id" />
						</div>
						<el-scrollbar height="2000px;" style="margin-top: 35px;">
							<div v-for="item in userGameStats" :key="(item.id as string)">
								<newLastGameItem v-if="user && item.opponentId && item.userScore && item.opponentScore"
									:id-player1="user?.id" :id-player2="item.opponentId" :score1="item.userScore"
									:score2="item.opponentScore" />
							</div>
						</el-scrollbar>
					</el-container>
				</el-main>
			</el-container>
		</el-container>
	</el-container>
</template>

<script setup lang="ts">

import { computed, onMounted, inject, ref, type Ref } from "vue"
import { ElMessage } from "element-plus"
import {
	useFindUserQuery,
	useFindPublicGeneralGameStatsForUserQuery,
	useFindAllPublicGameStatsForUserQuery,
	useFindRelationQuery,
	useCreateRequestFriendMutation,
	useRemoveFriendMutation,
	EUserRealtionType,
	type User, type UserRelation, type GameStat
} from '@/graphql/graphql-operations'
import newLastGameItem from "../profile/components/newLastGameItem.vue"
import gameHistoryGraph from "../profile/components/game-history-graph.vue"
import statsComponent from "../profile/components/statsComponent.vue"
import { useRoute } from "vue-router"


const route = useRoute()
const id = computed(() => {
	return route.query.id ? route.query.id.toString() : undefined
})
const { result: resultForUser, variables: findUserVariables, start: findUserStart } = useFindUserQuery({ args: { id: ' ' } })
const { result: resultForGeneralGameStat, variables: publicGeneralGameStatsVariable, start: publicGeneralGameStatsStart } = useFindPublicGeneralGameStatsForUserQuery({ userid: ' ' })
const { result: resultForUserGameStatsQuery, variables: findUserGameStatsVariable, start: findUserGameStatsStart } = useFindAllPublicGameStatsForUserQuery({ userid: ' ' })
const { onResult: onRelationResult, variables: findRelationVariables, refetch } = useFindRelationQuery({ userId: '' })
const loggedInUser = inject<Ref<User>>('loggedInUser')
const { mutate: createfriendrequestmutation } = useCreateRequestFriendMutation()
const { mutate: removefriendmutation } = useRemoveFriendMutation()
const user = computed(() => resultForUser.value?.findUser)
onMounted(() => {
	if (id.value && id.value.length) {
		findUserVariables.value = { args: { id: id.value } }
		findRelationVariables.value = { userId: id.value }
		publicGeneralGameStatsVariable.value = { userid: id.value }
		findUserGameStatsVariable.value = { userid: id.value }
		findUserStart()
		publicGeneralGameStatsStart()
		findUserGameStatsStart()
	}
})

const userGeneralStats = computed(() => resultForGeneralGameStat.value?.findPublicGeneralGameStatsForUser)
const userGameStats = computed(() => resultForUserGameStatsQuery.value?.findAllPublicGameStatsForUser)
const relation = ref<UserRelation>()

onRelationResult((res) => {
	if (res.data?.findRelation) {
		relation.value = res.data.findRelation
	}
	else if (res.data) {
		relation.value = undefined
	}
})

const removeFriend = () => {
	if (user.value?.id) {
		removefriendmutation({ args: { userTargetid: user.value.id } })
			.then((res) => {
				if (res?.data?.removeFriend) {
					refetch()
				}
			})
			.catch((Error) => {
				ElMessage.error(Error.message)
			})
	}
}

const createFriendRequest = () => {
	if (user.value?.id) {
		createfriendrequestmutation({ args: { userTargetId: user.value.id } })
			.then((res) => {
				if (res?.data?.createRequestFriend) {
					refetch()
				}
			})
			.catch((Error) => {
				ElMessage.error(Error.message)
			})
	}
}

const progressGameStats = computed(() => {
	if (userGameStats.value) {
		return userGameStats.value.slice(0, 4)
	}
	return []
})
</script>

<style scoped lang="sass">

.wrapper
	max-height: 100vh
	overflow: auto
.el-row
	margin-bottom: 10px
.el-avatar
	margin-top: 35%
.debug-footer
	height: 17%
	justify-content: center
	align-items: center
.debug-header
	height: 17%
.debug-main-component
	justify-content: center
	align-items: center


.graph-container
	height: 70%
	width: 80%
	display: flex
	background: #151519
	border-radius: var(--el-border-radius-base) 
	z-index: 1

.graph-container:hover
	box-shadow: var(--my-box-shadow)
.scrollbar-flex-content
	display: flex
	align-items: center
	align-self: center	  
</style>