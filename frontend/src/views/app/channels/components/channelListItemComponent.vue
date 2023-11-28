<template>
  <div class="channel-item-container">
    <div style="display: flex; flex-direction: row; align-items: center;">
      <el-avatar :src="props.channel.avatarUrl"></el-avatar>
      <div class=" channel-description">
        <div class="channel-name">
          {{ truncateStr(channel.name, 16) }}
        </div>
        {{ channel.channelType }}
      </div>
    </div>
    <div>
      {{ queryMembers.result.value?.findAllChannelMembersForChannel.length }}
      <el-icon>
        <User />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Channel, useOnDeleteChannelSubscription, useFindAllChannelsForUserQuery, useOnUpdateChannelSubscription, useFindAllChannelMembersForChannelQuery, useFindAllVisibleChannelsQuery, useOnNewChannelMemberForChannelIdSubscription, useOnUpdateChannelMemberForChannelIdSubscription, useOnDeleteChannelMemberForChannelIdSubscription } from '@/graphql/graphql-operations'
import { router } from '@/router'
import { cacheDelete, cacheUpsert } from '@/utils/cacheUtils'
import { ElNotification } from 'element-plus'
import { computed, h, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps<{
  channel: Channel
}>()

onMounted(() => {
  queryChannels.refetch({})
  visibleQuery.refetch({})
  queryMembers.refetch({
    args: {
      channelId: props.channel.id
    }
  })
})

const truncateStr = (str: String | undefined, limit: number) => {
  if (!str) {
    return
  }
  if (str.length < limit) {
    return str
  }
  else {
    return str.slice(0, limit) + "..."
  }
}

const queryChannels = useFindAllChannelsForUserQuery({})
const visibleQuery = useFindAllVisibleChannelsQuery({})

useOnDeleteChannelSubscription(({ args: { id: props.channel.id } })).onResult(({ data }) => {
  cacheDelete(data?.onDeleteChannel)
  if (route.query.channelId && route.query.channelId.toString() === data?.onDeleteChannel.id) {
    router.replace({ query: {} })
    ElNotification({
      title: 'Channel deleted',
      message: h('i', { style: 'color: teal' }, 'Channel' + data?.onDeleteChannel.name + ' has been deleted'),
      type: 'info'
    })
  }
})

useOnUpdateChannelSubscription(({ args: { id: props.channel.id } })).onResult(() => {
  queryChannels.refetch()
  visibleQuery.refetch()
})

useOnNewChannelMemberForChannelIdSubscription({ args: { channelId: props.channel.id } }).onResult(() => {
  queryMembers.refetch({
    args: {
      channelId: props.channel.id
    }
  })
})

useOnUpdateChannelMemberForChannelIdSubscription({ args: { channelId: props.channel.id } }).onResult(() => {
  queryMembers.refetch({
    args: {
      channelId: props.channel.id
    }
  })
})

useOnDeleteChannelMemberForChannelIdSubscription({ args: { channelId: props.channel.id } }).onResult(({ data }) => {
  queryMembers.refetch({
    args: {
      channelId: props.channel.id
    }
  })
})

const queryMembers = useFindAllChannelMembersForChannelQuery({
  args: {
    channelId: props.channel.id
  }
})

</script>

<style scoped lang="sass">
.channel-item-container
  padding: 10px
  height: 42px
  display: flex
  justify-content: space-between
  align-items: center
  margin: 10px
  border-radius: var(--el-border-radius-base)
  &:hover
    background-image: linear-gradient(315deg, hsl(320deg 88% 71%) 1%, hsl(329deg 100% 72%) 43%, hsl(336deg 100% 72%) 50%, hsl(345deg 100% 72%) 51%, hsl(356deg 100% 73%) 51%, hsl(7deg 100% 72%) 49%, hsl(18deg 100% 68%) 49%, hsl(26deg 100% 64%) 50%, hsl(33deg 100% 61%) 57%, hsl(39deg 97% 57%) 99%)
    

.channel-description
  display: flex
  flex-direction: column

.channel-name
  font-weight: bold
</style>