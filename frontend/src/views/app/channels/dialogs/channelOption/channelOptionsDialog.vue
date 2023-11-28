<template>
    <el-dialog v-model="dialog" v-loading="queryChannel.loading" title="Channel options" width="52%"
        style="border-radius: var(--el-border-radius-base)" :before-close="handleClose" close-on-press-escape>
        <el-tabs v-model="activeTab" style="margin-top: -20px; margin-bottom: -10px;">
            <el-tab-pane label="Edit channel" name="first">
                <TabDetails v-if="channel" :channel="channel" />
            </el-tab-pane>
            <el-tab-pane label="Change visibility" name="second">
                <TabVisibility v-if="channel" :channel="channel" />
            </el-tab-pane>
            <el-tab-pane label="Manage members" name="third">
                <TabMembers v-if="channel" :channel="channel" />
            </el-tab-pane>
            <el-tab-pane label="Add members" name="fourth">
                <TabAdd v-if="channel" :channel="channel" />
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useFindChannelQuery } from '@/graphql/graphql-operations'

import TabDetails from './channelOptionsDialog_Details.vue'
import TabVisibility from './channelOptionsDialog_Visibility.vue'
import TabMembers from './channelOptionsDialog_Members.vue'
import TabAdd from './channelOptionsDialog_Add.vue'

const props = defineProps<{
    modelValue: boolean
    channelId: string
}>()


const emit = defineEmits<{
    (e: `update:modelValue`, value: boolean): void
}>()

onMounted(() => {
    queryChannel.refetch()
})

const queryChannel = useFindChannelQuery({
    args: {
        id: props.channelId
    }
})

const activeTab = ref(`first`)
const channel = computed(() => queryChannel.result.value?.findChannel)
const dialog = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit(`update:modelValue`, value)
    }
})

const handleClose = () => dialog.value = false

</script>

<style scoped lang="sass">


</style>