<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="25%">
                <div class="list-container-header">
                    <h3 class="top">Channels</h3>
                    <div>
                        <el-button @click="createDialog = true"><el-icon>
                                <Plus />
                            </el-icon></el-button>
                        <el-button @click="joinDialog = true"><el-icon>
                                <Search />
                            </el-icon></el-button>
                    </div>
                </div>
                <el-scrollbar class="list-channel" height="90%">
                    <ItemChannel v-for="channel in query.result.value?.findAllChannelsForUser" :key="channel.id"
                        :channel="channel" @click="onSelectChannelInList(channel, '')" />
                </el-scrollbar>
            </el-aside>
            <ChannelChat v-if="channelId" :channelId="channelId" :key="channelId" />
        </el-container>
        <CreateChannelDialog v-model="createDialog" />
        <JoinChannelDialog v-model="joinDialog" />
    </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { router } from '@/router'
import {
    useFindAllChannelsForUserQuery,
    type Channel,
    useFindMyUserQuery,
    useOnNewChannelMemberForUserIdSubscription,
    useOnDeleteChannelMemberForUserlIdSubscription,
    useOnUpdateChannelMemberForUserlIdSubscription,
    useFindAllVisibleChannelsQuery,
    useOnDeleteChannelMessageForChannelSubscription,
    useOnNewChannelMemberForChannelIdSubscription,
    useOnDeleteChannelMemberForChannelIdSubscription,
    useOnUpdateChannelMemberForChannelIdSubscription,
} from '@/graphql/graphql-operations'
import ItemChannel from './components/channelListItemComponent.vue'
import CreateChannelDialog from './dialogs/createChannel/createChannelDialog.vue'
import JoinChannelDialog from './dialogs/joinChannel/joinChannelDialog.vue'
import ChannelChat from './components/channelChatComponent.vue'
import { cacheDelete, cacheUpsert } from '@/utils/cacheUtils'
import { ElNotification } from 'element-plus'

const route = useRoute()
const channelId = computed(() => {
    return route.query.channelId ? route.query.channelId.toString() : undefined
})

const { result: myUser } = useFindMyUserQuery()
const query = useFindAllChannelsForUserQuery({})
const visibleQuery = useFindAllVisibleChannelsQuery()

const createDialog = ref(false)
const joinDialog = ref(false)

onMounted(() => {
    query.refetch({})
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSelectChannelInList = ({ id }: Channel, _value: string) => {
    router.replace({ query: { channelId: id } })
}

useOnNewChannelMemberForUserIdSubscription({ args: { userId: myUser.value!.findMyUser.id } }).onResult(({ data }) => {
    cacheUpsert(query, data?.onNewChannelMemberForUserId.channel)
    query.refetch()
    visibleQuery.refetch()
    ElNotification({
        title: 'New channel',
        message: h('i', { style: 'color: teal' }, 'You joined ' + data?.onNewChannelMemberForUserId.channel?.name + ' as ' + data?.onNewChannelMemberForUserId.type.toString()),
        type: 'info'
    })
})

useOnUpdateChannelMemberForUserlIdSubscription({ args: { userId: myUser.value!.findMyUser.id } }).onResult(({ data }) => {
    cacheUpsert(query, data?.onUpdateChannelMemberForUserlId.channel)
    query.refetch()
    visibleQuery.refetch()
    ElNotification({
        title: 'Channel member updated',
        message: h('i', { style: 'color: teal' }, 'Your status has been updated in channel ' + data?.onUpdateChannelMemberForUserlId.channel.name),
        type: 'info'
    })
})

useOnDeleteChannelMemberForUserlIdSubscription({ args: { userId: myUser.value!.findMyUser.id } }).onResult(({ data }) => {
    cacheDelete(data?.onDeleteChannelMemberForUserlId.channel)
    query.refetch()
    visibleQuery.refetch()
    ElNotification({
        title: 'Kicked',
        message: h('i', { style: 'color: teal' }, 'You left ' + data?.onDeleteChannelMemberForUserlId.channel?.name),
        type: 'info'
    })
    router.replace({ query: {} })
})

</script>

<style scoped lang="sass">

.common-layout
    display: flex
    flex: 1
.list-container-header
  display: flex
  flex-direction: row
  justify-content: space-evenly
  align-items: center
  background-color: rgb(32, 32, 32)


.top
    font-size: 2.1em
    top: 45px
    font-family: "Vaporfuturism", "Helvetica", sans-serif
    color: #FA26F7
    text-transform: uppercase
    letter-spacing: -2px
    margin: 20px
    -webkit-text-stroke-width: 1px
    -webkit-text-stroke-color: #7b0080

.el-aside
    border-start-start-radius: var(--el-border-radius-base)
    border-end-start-radius: var(--el-border-radius-base)
    overflow: hidden
</style>
