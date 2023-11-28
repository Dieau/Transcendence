<template>
  <div class="details">
    <div class="infos">
      <el-image
        style="align-self: center; height: 25%; background-size: cover; background-position: center; aspect-ratio: 1/1; border-radius: 100%;"
        fit="cover" :src="channel?.avatarUrl" />
      <div style="align-self: center;">{{ channel?.name }}</div>
      <div style="align-self: center;">
        <el-radio-group v-model="channelType">
          <el-radio label="Public" disabled />
          <el-radio label="Protected" disabled />
          <el-radio label="Private" disabled />
        </el-radio-group>
      </div>
      <div style="align-self: center;">Owner: {{ channelOwnerName }}</div>
      <div style="align-self: center;">Created: {{ moment(channel?.createdAt).format('L') }}</div>
      <div class="scroll">
        Channel Members:
        <el-scrollbar max-height="300px">
          <div v-for="item in queryMembers.result.value?.findAllChannelMembersForChannel" :key="item.userId"
            class="members-scroll">
            <div style="display: flex; flex-direction: row;">
              <myAvatar :src="item.user.avatarUrl" :userId="item.userId" />
              <div style="display: flex; flex-direction: column; justify-content: space-evenly;">
                <div>
                  {{ item.user?.username }}
                </div>
                <div style="color: white; font-size: small;">
                  {{ item.type.toString() }}
                </div>
              </div>
            </div>
            <div v-if="item.userId !== myUser?.findMyUser.id">
              <el-button @click="directMessage(item.userId)"><el-icon>
                  <Promotion />
                </el-icon></el-button>
              <el-button @click="onChallengeClicked(item.userId)"><font-awesome-icon icon="gamepad" /></el-button>
              <el-button @click="pushPublicProfile(item.userId)"><el-icon>
                  <Avatar />
                </el-icon></el-button>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="options">
      <el-button
        @click="leaveChannel({ args: { channelId: props.channelId } }).then(() => router.replace({ query: {} }))">Leave
        Channel</el-button>
      <el-button v-if="isAdmin || isOwner" @click="optionsDialog = true">Edit channel</el-button>
      <el-button v-if="isOwner"
        @click="drawer = false, deleteChannel({ args: { id: props.channelId } }).then(() => router.replace({ query: {} }))"
        type="warning" plain>Remove Channel</el-button>
    </div>
  </div>
  <ChannelOptionsDialog v-if="channelId" :channelId="channelId" :key="channelId" v-model="optionsDialog" />
</template>

<script setup lang="ts">
import { EChannelMemberType, useDeleteChannelMutation, useFindMyChannelMemberForChannelQuery, useFindMyUserQuery, useJoinGameMatchmakingMemberMutation, useOnDeleteChannelMemberForChannelIdSubscription, useOnNewChannelMemberForChannelIdSubscription, useOnUpdateChannelMemberForChannelIdSubscription, useOnUpdateChannelMemberForUserlIdSubscription, useSendDirectMessageMutation } from '@/graphql/graphql-operations'
import { useFindChannelQuery, EChannelType, useFindAllChannelMembersForChannelQuery, useDeleteMyMemberForChannelMutation } from '@/graphql/graphql-operations'
import ChannelOptionsDialog from "../dialogs/channelOption/channelOptionsDialog.vue"
import { computed, onMounted, ref } from 'vue'
import moment from "moment"
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import myAvatar from '@/components/myAvatar.vue'

const router = useRouter()
const { result: myUser } = useFindMyUserQuery()

const props = defineProps<{
  modelValue: boolean
  channelId: string
}>()

onMounted(() => {
  queryChannel.refetch({
    args: {
      id: props.channelId
    }
  })
  queryMyMemberForChannel.refetch({ args: { channelId: props.channelId } })
  queryMembers.refetch({
    args: {
      channelId: props.channelId
    }
  })
})

const emit = defineEmits<{
  (e: `update:modelValue`, value: boolean): void
}>()

const drawer = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit(`update:modelValue`, value)
  }
})

const optionsDialog = ref(false)

const queryChannel = useFindChannelQuery({
  args: {
    id: props.channelId
  }
})

const channel = computed(() => { return queryChannel.result.value?.findChannel })

const queryMyMemberForChannel = useFindMyChannelMemberForChannelQuery({ args: { channelId: props.channelId } })
useOnUpdateChannelMemberForUserlIdSubscription({ args: { userId: myUser.value!.findMyUser.id } }).onResult(() => {
  queryMyMemberForChannel.refetch()
})

const queryMembers = useFindAllChannelMembersForChannelQuery({
  args: {
    channelId: props.channelId
  }
})

const { mutate: deleteChannel } = useDeleteChannelMutation({})
const { mutate: leaveChannel } = useDeleteMyMemberForChannelMutation({})

const channelType = computed(() => {
  if (channel.value?.channelType === EChannelType.Private)
    return `Private`
  if (channel.value?.channelType === EChannelType.Protected)
    return `Protected`
  return `Public`
})

const channelOwnerName = ref<string>(``)


const isOwner = computed(() => queryMyMemberForChannel.result.value?.findMyChannelMemberForChannel.type === EChannelMemberType.Owner)
const isAdmin = computed(() => queryMyMemberForChannel.result.value?.findMyChannelMemberForChannel.type === EChannelMemberType.Admin)

const { mutate: sendDirectMessage, onError: onErrorSendingDirectMessage } = useSendDirectMessageMutation({})

const directMessage = (userId: string) => {
  sendDirectMessage({
    args: {
      otherUserId: userId
    }
  }).then((args) => {
    router.replace({ query: { channelId: args?.data?.sendDirectMessage.id } })
  })
}

onErrorSendingDirectMessage((e) => {
  ElMessage({
    message: e.message,
    type: 'warning',
  })
})

const pushPublicProfile = (userId: string) => {
  router.push('/app/publicprofile?id=' + userId)
}

const { mutate: joinMatchmakingMutate } = useJoinGameMatchmakingMemberMutation()

const onChallengeClicked = (userId: string) => {
  joinMatchmakingMutate({ userTargetId: userId })
    .catch((error) => {
      ElMessage.warning(error)
    })
}

</script>

<style scoped lang="sass">

.details
  display: flex
  flex-direction: column
  height: 100%
  padding-left: 5%
  padding-right: 5%

.close
  display: flex
  justify-content: flex-end
  flex: 1

.infos
  display: flex
  flex-direction: column
  flex: 8
  justify-content: space-evenly

.options
  display: flex
  flex-direction: row
  align-items: center
  justify-content: space-evenly
  flex: 1

.scroll
  height: 30%
  width: 100%
.members-scroll
    display: flex
    flex-direction: row
    align-items: center
    min-height: 40px
    text-align: center
    border-radius: 4px
    background: rgb(20, 20, 20)
    justify-content: space-between
    margin: 2%
    padding-right: 2% 
    padding-left: 2%

</style>