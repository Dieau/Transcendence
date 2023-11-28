<template>
    <el-container>
        <el-header height="15%">
            <h3 class="top">{{ channel?.name }}</h3>
        </el-header>
        <el-main>
            <el-scrollbar ref="chatScroll" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
                <div ref="innerRef">
                    <ChannelChatMessage v-for="(message, index) in messages" :key="message.id" :message="message"
                        :previousMessage="messages[index - 1]" @on-delete="mutateDelete({ args: { id: message.id } })" />
                </div>
            </el-scrollbar>
        </el-main>
        <el-footer>
            <el-input @keyup.enter="onCreateMessage" placeholder="Message..." v-model="inputValue">
                <template #append><el-button @click="onCreateMessage"><el-icon>
                            <DArrowRight />
                        </el-icon></el-button></template>
            </el-input>
            <el-button v-if="channel?.channelType !== EChannelType.Direct" size="large" @click="drawer = true"><el-icon>
                    <Menu />
                </el-icon></el-button>
            <el-button v-if="channel?.channelType === EChannelType.Direct" size="large"
                @click="deleteChannel({ args: { id: props.channelId } }).then(() => router.replace({ query: {} }))"><font-awesome-icon
                    icon="ban" /></el-button>
            <el-button size="large" @click="closeChannel" type="info" plain><el-icon>
                    <Close />
                </el-icon></el-button>
        </el-footer>
    </el-container>
    <el-drawer v-model="drawer" title="Channel details" direction="rtl" close-on-press-escape :with-header="false">
        <ChannelDetails v-if="channelId" :channelId="channelId" :key="channelId" v-model="drawer" />
    </el-drawer>
</template>

<script setup lang="ts">
import {
    useFindChannelQuery,
    useDeleteMyMessageForChannelMutation,
    useCreateMessageForChannelMutation,
    useFindAllChannelMessagesForChannelQuery,
    useOnNewChannelMessageForChannelIdSubscription,
    useOnDeleteChannelMessageForChannelSubscription,
    EChannelType,
    useDeleteChannelMutation,
    useFindAllBlockedForUserQuery,
    useFindAllBlockedByForUserQuery,
    type ChannelMessage,
    useOnUserRelationsChangedSubscription,
    useFindMyUserQuery,
} from '@/graphql/graphql-operations'
import { computed, onMounted, ref } from 'vue'
import ChannelChatMessage from './channelChatMessageComponent.vue'
import ChannelDetails from './channelDetailsComponent.vue'
import { cacheDelete, cacheUpsert } from '@/utils/cacheUtils'
import { ElMessage, type ElScrollbar } from 'element-plus'
import { router } from '@/router'
import { elements } from 'chart.js'

const props = defineProps<{
    channelId: string,
}>()

const drawer = ref(false)
const loading = ref(true)
const innerRef = ref<HTMLDivElement>()
const chatScroll = ref<InstanceType<typeof ElScrollbar>>()

onMounted(() => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
        chatScroll.value?.setScrollTop(innerRef.value!.clientHeight)
    }, 500)
    queryChannel.refetch({
        args: {
            id: props.channelId
        }
    })
    queryMessages.refetch({
        args: {
            channelId: props.channelId
        }
    })
    queryBlocked.refetch({})
    queryBlockedBy.refetch({})
})

const { result: myUser } = useFindMyUserQuery({})

useOnUserRelationsChangedSubscription(({ userId: myUser.value!.findMyUser.id })).onResult(() => {
    queryMessages.refetch({
        args: {
            channelId: props.channelId
        }
    })
    queryBlocked.refetch({})
    queryBlockedBy.refetch({})
})

const { mutate: deleteChannel } = useDeleteChannelMutation({})

const queryChannel = useFindChannelQuery({
    args: {
        id: props.channelId
    }
})

queryChannel.onError((e) => {
    ElMessage({
        message: e.message,
        type: 'warning',
    })
    closeChannel()
})

const channel = computed(() => queryChannel.result.value?.findChannel)

const inputValue = ref(``)

const queryMessages = useFindAllChannelMessagesForChannelQuery({
    args: {
        channelId: props.channelId
    }
})

const { mutate: mutateDelete } = useDeleteMyMessageForChannelMutation()

const { mutate, onError } = useCreateMessageForChannelMutation({})

useOnNewChannelMessageForChannelIdSubscription({ args: { channelId: props.channelId } }).onResult(
    ({ data }) => {
        cacheUpsert(queryMessages, data?.onNewChannelMessageForChannelId)
        setTimeout(() => {
            chatScroll.value?.setScrollTop(innerRef.value!.clientHeight)
        }, 5)
    }
)

useOnDeleteChannelMessageForChannelSubscription({ args: { channelId: props.channelId } }).onResult(
    ({ data }) => {
        cacheDelete(data?.onDeleteChannelMessageForChannel)
    }
)

const queryBlocked = useFindAllBlockedForUserQuery({})
const queryBlockedBy = useFindAllBlockedByForUserQuery({})

const excludeUserIds = computed(() => {
    const array: string[] = []
    queryBlocked.result.value?.findAllBlockedForUser.forEach((element) => {
        array.push(element.userTargetId)
    })
    queryBlockedBy.result.value?.findAllBlockedByForUser.forEach((element) => {
        array.push(element.userOwnerId)
    })
    return array
})

function checkUserId(message: ChannelMessage) {
    return !excludeUserIds.value.includes(message.userId)
}

const messages = computed(() => queryMessages.result.value?.findAllChannelMessagesForChannel.filter(checkUserId) ?? [])

const onCreateMessage = () => {
    if (inputValue.value.trim().length !== 0 && inputValue.value.length < 1024) {
        mutate({
            args: {
                channelId: props.channelId,
                message: inputValue.value
            }
        }).then(() => (inputValue.value = ``))
    }
    else if (inputValue.value.length > 1024) {
        ElMessage({
            showClose: true,
            message: "Input too long!",
            type: `warning`
        })
    }
}

onError((e) => {
    ElMessage({
        showClose: true,
        message: e.message,
        type: `warning`
    })
})

const closeChannel = () => {
    router.replace({ query: {} })
}
</script>

<style scoped lang="sass">


.active-channel
    height: 100%
    display: flex
    flex-direction: column

.active-channel-content
    height: 100%
    display: flex
    flex-direction: column
    margin-left: 5%
    margin-right: 5%
.el-header
    display: flex
    border-start-end-radius: var(--el-border-radius-base)
    justify-content: center
    align-items: center
.el-main
    display: flex
    flex-direction: column
    margin-left: 5%
    margin-right: 5%
.el-footer
    display: flex
    align-items: center
    border-end-end-radius: var(--el-border-radius-base)

.el-input
    height: 75%
    margin-left: 5%
    margin-right: 5%

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
</style>
