<template>
    <div class="message">
        <div v-if="showUser && !showDate" style="margin-bottom: 7%"></div>
        <el-divider v-if="showDate">
            {{ moment(props.message.createdAt).format('LL') }}
        </el-divider>
        <div class="content" @mouseover="hover = true" @mouseleave="hover = false">
            <div class="head">
                <el-image v-if="showUser || showDate" style="
            width: 100%;
            background-size: cover;
            background-position: center;
            aspect-ratio: 1/1;
            border-radius: 100%;
          " fit="cover" :src="user?.findUserForChannelMessage.avatarUrl" />
                <div v-if="hover && !showUser && !showDate" style="font-size: x-small">
                    {{ moment(props.message.createdAt).format('LT') }}
                </div>
            </div>
            <div class="body">
                <div class="title" v-if="showUser || showDate">
                    <div style="font-weight: bold">{{ user?.findUserForChannelMessage.username }}</div>
                    <div style="display: flex; flex: 1; justify-content: flex-end; font-size: small">
                        {{ moment(props.message.createdAt).calendar() }}
                    </div>
                </div>
                <div class="text">
                    {{ props.message.message }}
                </div>
            </div>
            <div class="del">
                <el-button @click="$emit('onDelete')"
                    v-if="hover && user?.findUserForChannelMessage.id === myUser?.findMyUser.id" type="primary"
                    icon="Delete" link />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import {
    useFindUserForChannelMessageQuery,
    type ChannelMessage,
    useFindMyUserQuery
} from '@/graphql/graphql-operations'
import { computed, onMounted, ref } from 'vue'

const hover = ref(false)
const props = defineProps<{
    message: ChannelMessage
    previousMessage?: ChannelMessage
}>()

defineEmits<{
    (e: `onDelete`): void
}>()

onMounted(() => {
    refetchUser({ args: { id: props.message.id } })
    refetchMyUser({})
})

const isNotNull = computed(() => props.previousMessage !== null)
const showUser = computed(
    () => isNotNull.value && props.message.userId !== props.previousMessage?.userId
)
const showDate = computed(
    () =>
        isNotNull.value &&
        moment(props.message.createdAt).format(`LL`) !==
        moment(props.previousMessage?.createdAt).format(`LL`)
)

const { result: user, refetch: refetchUser } = useFindUserForChannelMessageQuery({ args: { id: props.message.id } })
const { result: myUser, refetch: refetchMyUser } = useFindMyUserQuery({})
</script>

<style scoped lang="sass">

.message
    display: flex
    flex-direction: column

.content
    display: flex
    flex-direction: row

.head
    display: flex
    flex-direction: column
    width: 10%
    flex: 1
    justify-content: center

.body
    display: flex
    flex-direction: column
    flex: 9
    margin-left: 5%
    margin-right: 5%

.del
    display: flex
    flex: 0.5

.title
    display: flex
    flex-direction: row
    margin-bottom: 2%

.text
    word-break: break-word
    margin-bottom: 2%
    margin-top: 2%
</style>
