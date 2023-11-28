<template>
	<div>
		<el-input placeholder="Search for user" :prefix-icon="Search" v-model="searched" clearable></el-input>
		<el-scrollbar height="250">
			<div>
				<p v-for="item in filtered" :key="item.id">
					<blockUserCard :userId="item.id" :avatarUrl="item.avatarUrl || ''" :username="item.username"
						:relationStatus="gestUserRelation(item.id)?.type" />
				</p>
			</div>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { ref, inject, watch, computed, type Ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useFindPublicUsersListQuery, type UserRelation, type UserPublic, type User } from '@/graphql/graphql-operations'
import blockUserCard from './blockUserCard.vue'

const { onResult, refetch } = useFindPublicUsersListQuery()
const userRelations = inject<Ref<UserRelation[]>>('userRelations')
const users = ref<UserPublic[]>([])
const searched = ref('')
const loggedInUser = inject<Ref<User>>('loggedInUser')

onResult((res) => {
	if (res.data.findPublicUsersList) {
		const usrs = res.data.findPublicUsersList
		if (usrs) {
			users.value = usrs
		}
	}
})

onMounted(() => {
	refetch()
})

const gestUserRelation = (userId: string) => {
	if (userRelations) {
		return userRelations.value.find(rel => rel.userTargetId === userId)
	}
}

const filtered = computed(() => {
	if (loggedInUser && loggedInUser.value) {
		return users.value.filter(user => {
			if (user.id === loggedInUser.value.id) {
				return false
			}
			if (searched.value && !user.username.toLowerCase().includes(searched.value.toLowerCase())) {
				return false
			}
			return true
		})
	}
})

</script>

<style scoped lang="sass">

</style>
