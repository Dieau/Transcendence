<template>
	<div class="user-item-container">
		<div style="display: flex; flex-direction: row; align-items: center;">
			<el-avatar class="avatar" :src="avatarUrl" />
			<text class="user-name">{{ truncateStr(username, 16) }}</text>
		</div>
		<el-button class="add-btn" @click="handleButtonClick()" @mouseenter="handleMouseEnter()"
			@mouseleave="handleMouseLeave()">
			<el-icon v-if="relationType != 'PendingAccept'">
				<CirclePlus />
			</el-icon>
			<el-icon v-if="relationType === 'PendingAccept' && isHovered">
				<Close />
			</el-icon>
			<a v-if="relationType === 'PendingAccept' && !isHovered">Pending</a>
			<span v-if="relationType === 'PendingAccept' && isHovered">Cancel</span>
		</el-button>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
import { useCreateRequestFriendMutation, useRemoveFriendMutation } from '@/graphql/graphql-operations'


export default {
	name: `search-friend-card-item`,
	props: {
		userId: String,
		avatarUrl: String,
		username: String,
		relationStatus: String,
	},
	setup(props) {

		const { mutate: createfriendrequestmutation } = useCreateRequestFriendMutation()
		const { mutate: removefriendmutation } = useRemoveFriendMutation()

		const relationType = ref(props.relationStatus)
		const isHovered = ref(false)
		watch(() => props.relationStatus, (newRel) => {
			relationType.value = newRel
		})

		const handleMouseEnter = () => {
			isHovered.value = true
		}

		const handleMouseLeave = () => {
			isHovered.value = false
		}

		const handleButtonClick = () => {
			if (relationType.value === `PendingAccept`) {
				removeFriend()
			} else {
				createFriendRequest()
			}
		}

		const removeFriend = () => {
			if (props.userId) {
				removefriendmutation({ args: { userTargetid: props.userId } })
					.then((res) => {
						if (!res?.errors && res?.data?.removeFriend) {
							relationType.value = undefined
						}
					})
					.catch((Error) => {
						ElMessage.error(Error.message)
					})
			}
		}

		const createFriendRequest = () => {
			if (props.userId) {
				createfriendrequestmutation({ args: { userTargetId: props.userId } })
					.then((res) => {
						if (!res?.errors && res?.data?.createRequestFriend) {
							relationType.value = res.data.createRequestFriend.type
						}
					})
					.catch((Error) => {
						ElMessage.error(Error.message)
					})
			}
		}

		const truncateStr = (str: string | undefined, limit: number) => {
			if (str) {
				if (str.length < limit) {
					return str
				}
				else {
					return str.slice(0, limit) + "..."
				}
			} else {
				return '...'
			}
		}

		return { props, createFriendRequest, relationType, handleMouseLeave, handleMouseEnter, handleButtonClick, isHovered, truncateStr }
	}
}

</script>

<style scoped lang="sass">

.user-item-container
  padding: 10px
  height: 42px
  display: flex
  justify-content: space-between
  align-items: center
  margin: 10px
  border-radius: var(--el-border-radius-base)
  &:hover
    background-image: linear-gradient(315deg, hsl(320deg 88% 71%) 1%, hsl(329deg 100% 72%) 43%, hsl(336deg 100% 72%) 50%, hsl(345deg 100% 72%) 51%, hsl(356deg 100% 73%) 51%, hsl(7deg 100% 72%) 49%, hsl(18deg 100% 68%) 49%, hsl(26deg 100% 64%) 50%, hsl(33deg 100% 61%) 57%, hsl(39deg 97% 57%) 99%)

.user-name
  font-weight: bold

</style>