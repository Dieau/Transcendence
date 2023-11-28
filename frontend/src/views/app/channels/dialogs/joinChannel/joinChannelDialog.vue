<template>
  <el-dialog v-model="dialog" title="Join channel" width="42%" style="border-radius: var(--el-border-radius-base)"
    :before-close="handleClose" close-on-press-escape>
    <div class="dialog-body">
      <div class="channels">
        <h1 class="dialog-header">Public channels:</h1>
        <el-scrollbar class="list-channel" max-height="300px">
          <ItemChannel v-for="channel in visibleChannels" :key="channel.id" :channel="channel"
            @click="channel.channelType === EChannelType.Protected ? openPasswordInput(channel) : onSelectChannel(channel, '')" />
        </el-scrollbar>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useCreateMyMemberForChannelMutation, useOnNewVisibleChannelSubscription, useFindAllVisibleChannelsQuery, type Channel, useFindAllChannelsForUserQuery, useOnCreateChannelSubscription, useFindChannelQuery, useOnUpdateChannelSubscription } from '@/graphql/graphql-operations'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { EChannelType } from '@/graphql/graphql-operations'
import ItemChannel from "../../components/channelListItemComponent.vue"
import { cacheUpsert } from '@/utils/cacheUtils'

const props = defineProps([`modelValue`])
const emit = defineEmits([`update:modelValue`])

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit(`update:modelValue`, value)
  }
})

const router = useRouter()
const query = useFindAllChannelsForUserQuery({})

const excludeChannels = computed(() => {
  const array: string[] = []
  query.result.value?.findAllChannelsForUser.forEach((element) => {
    array.push(element.id)
  })
  return array
})

const visibleQuery = useFindAllVisibleChannelsQuery()

onMounted(() => {
  query.refetch({})
  visibleQuery.refetch({})
})

useOnNewVisibleChannelSubscription({}).onResult(() => {
  visibleQuery.refetch()
})

const { mutate: mutateChannelMember, onDone: memberCreated, onError: createMemberError } = useCreateMyMemberForChannelMutation({})

useOnCreateChannelSubscription({}).onResult(({ data }) => {
  cacheUpsert(visibleQuery, data?.onCreateChannel)
})

const visibleChannels = computed(() => {
  return visibleQuery.result.value?.findAllVisibleChannels.filter(checkChannelId)
})

function checkChannelId(channel: Channel) {
  return !excludeChannels.value.includes(channel.id)
}

const onSelectChannel = (channel: Channel, password: string) => {
  mutateChannelMember({
    args: {
      channelId: channel.id,
      channelPassword: password,
    }
  }).then((args) => {
    router.replace({ query: { channelId: args?.data?.createMyMemberForChannel.channelId } })
  })
  query.refetch()
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openPasswordInput = (channel: Channel) => {
  ElMessageBox.prompt(`Please input the channel password`, channel.name, {
    confirmButtonText: `Join`,
    cancelButtonText: `Cancel`,
    inputType: `Password`,
    inputValue: ``,
  })
    .then(({ value }) => {
      onSelectChannel(channel, value)
    })
    .catch(() => {
      ElMessage({
        type: `info`,
        message: `Canceled`,
      })
    })
}

createMemberError((e) => {
  ElMessage({
    showClose: true,
    message: e.message,
    type: `error`
  })
})


const handleClose = (() => {
  dialog.value = false
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