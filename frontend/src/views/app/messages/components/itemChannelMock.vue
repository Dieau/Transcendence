<template>
    <div class="channel-item-container">
      {{channel.name}}
    </div>
</template>

<script setup lang="ts">
import type { Channel } from '@/graphql/graphql-operations'

defineProps<{
  channel: Channel
}>()

</script>

<style scoped lang="sass">
.channel-item-container
  padding: 10px
  background-color: red
  margin: 10px 
</style>