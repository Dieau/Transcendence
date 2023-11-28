<template>
	<el-dialog v-model="DialogVisible" width="42%" title="Add friends" style="border-radius: var(--el-border-radius-base)">
		<div class="container">
			<el-input placeholder="Search for user" :prefix-icon="Search" v-model="searched" clearable />
			<el-scrollbar class="scrollbar">
				<div>
					<p v-for="user in filtered" :key="user.id">
						<searchFriendCard :avatar-url="user.avatarUrl || ''" :username="user.username" :user-id="user.id"
							:relation-status="gestUserRelation(user.id)?.type" />
					</p>
				</div>
			</el-scrollbar>

		</div>

	</el-dialog>
</template>
  
<script setup lang="ts">
import { ref, inject, watch, computed, type Ref } from 'vue'
import { useFindPublicUsersListQuery, type UserRelation, type UserPublic, type User } from '@/graphql/graphql-operations'
import searchFriendCard from './searchFriendCard.vue'
import { Search } from '@element-plus/icons-vue'

const { onResult, refetch } = useFindPublicUsersListQuery()
const DialogVisible = ref(false)
const userRelations = inject<Ref<UserRelation[]>>('userRelations')
const users = ref<UserPublic[]>([])
const searched = ref('')
const loggedInUser = inject<Ref<User>>('loggedInUser')

onResult((res) => {
	if (res.data && res.data.findPublicUsersList) {
		const usrs = res.data.findPublicUsersList
		if (usrs) {
			users.value = usrs
		}
	}
})

watch(DialogVisible, () => {
	if (DialogVisible.value) {
		refetch()
	}
})

const gestUserRelation = (userId: string) => {
	if (userRelations) {
		return userRelations.value.find(rel => rel.userTargetId === userId)
	}
}

const filtered = computed(() => {
	return users.value.filter(user => {
		if (user.id === loggedInUser?.value.id) {
			return false
		}
		const relation = gestUserRelation(user.id)
		if (relation && (relation.type === 'Friend' || relation.type === 'WaitingAccept')) {
			return false
		}
		if (searched.value && !user.username.toLowerCase().includes(searched.value.toLowerCase())) {
			return false
		}

		return true
	})
})

const changeDialogVisibility = () => {
	DialogVisible.value ? DialogVisible.value = false : DialogVisible.value = true
}
defineExpose({ changeDialogVisibility })
</script>

<style scoped lang="sass">

</style>
