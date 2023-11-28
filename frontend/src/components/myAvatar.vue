<template>
  <el-tooltip :content="'Since: ' + moment(presenceQuery.result.value?.findUserPresence.updatedAt).format('LT')"
    placement="top">
    <el-badge is-dot :type="status">
      <el-avatar :src="props.src"></el-avatar>
    </el-badge>
  </el-tooltip>
</template>

<script setup lang="ts">
import { EUserPresenceStatus, useFindUserPresenceQuery, useOnUpdateUserPresenceSubscription } from '@/graphql/graphql-operations'
import { cacheUpsert } from '@/utils/cacheUtils'
import moment from 'moment'
import { computed } from 'vue'

interface myAvatarProps {
  userId: string,
  src?: string | null,
}
const props = defineProps<myAvatarProps>()

const presenceQuery = useFindUserPresenceQuery({
  args: {
    userId: props.userId
  }
})

useOnUpdateUserPresenceSubscription({
  args: {
    userId: props.userId
  }
}).onResult(({ data }) => {
  presenceQuery.refetch()
})

const status = computed(() => {
  if (presenceQuery.result.value?.findUserPresence.connected === EUserPresenceStatus.Online)
    return 'success'
  else if (presenceQuery.result.value?.findUserPresence.connected === EUserPresenceStatus.InGame)
    return 'primary'
  return 'info'
})
const lastActivity = computed(() => {
  return "Since: " + moment(presenceQuery.result.value?.findUserPresence.updatedAt).fromNow()
})

</script>

<style scoped lang="sass">
</style>
