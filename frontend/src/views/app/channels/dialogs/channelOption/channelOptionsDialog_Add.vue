<template>
    <el-scrollbar height="250">
        <ItemFriend v-for="user in visibleUsers" :key="user.userTargetId" :user="user.friendInfos"
            :onAddMember="onAddMember" />
    </el-scrollbar>
</template>

<script setup lang="ts">
import { useFindAllFriendsForUserQuery, type Channel, useFindAllChannelMembersForChannelQuery, type UserRelation, useCreateMemberForChannelMutation, useOnUserRelationsChangedSubscription, useFindMyUserQuery, type UserPublic, useOnUpdateChannelMemberForChannelIdSubscription, useOnDeleteChannelMemberForChannelIdSubscription, useOnNewChannelMemberForChannelIdSubscription, type UserPublicGameInfos } from '@/graphql/graphql-operations'
import { ElMessage } from 'element-plus'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ItemFriend from './addMemberListItemComponent.vue'

const props = defineProps<{
    channel: Channel,
}>()

onMounted(() => {
    refetchMyUser({})
    queryMembers.refetch({
        args: {
            channelId: props.channel.id
        }
    })
    refetch()
})

const router = useRouter()
const { result: myUser, refetch: refetchMyUser } = useFindMyUserQuery({})
const queryMembers = useFindAllChannelMembersForChannelQuery({
    args: {
        channelId: props.channel.id
    }
})

const excludeUsers = computed(() => {
    const array: string[] = []
    queryMembers.result.value?.findAllChannelMembersForChannel.forEach((element) => {
        array.push(element.userId)
    })
    return array
})

const { result: visibleQuery, refetch, onResult, onError } = useFindAllFriendsForUserQuery({})

const { mutate: mutateChannelMember, onDone: memberCreated, onError: createMemberError } = useCreateMemberForChannelMutation({})

useOnUserRelationsChangedSubscription(({ userId: myUser.value!.findMyUser.id })).onResult(() => {
    refetch()
})

const visibleUsers = computed(() => {
    return visibleQuery.value?.findAllFriendsForUser.filter(checkUserId)
})

function checkUserId(userRelation: UserRelation) {
    return !excludeUsers.value.includes(userRelation.friendInfos.id)
}

const onAddMember = (user: UserPublicGameInfos) => {
    mutateChannelMember({
        args: {
            channelId: props.channel.id,
            userId: user.id
        }
    })
}

createMemberError((e) => {
    ElMessage({
        showClose: true,
        message: e.message,
        type: `error`
    })
})


</script>

<style scoped lang="sass">

.dialog-header
  display: flex
  align-items: center
  justify-content: center

.dialog-body
  display: flex
  flex-direction: row

.channels
  display: flex
  flex-direction: column
  width: 100%


</style>