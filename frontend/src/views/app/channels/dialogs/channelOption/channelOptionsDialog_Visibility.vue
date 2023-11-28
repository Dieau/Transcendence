<template>
    <el-alert v-if="channel?.channelType === EChannelType.Protected" title="Protected channel" type="info"
        description="This channel is protected by a password" :closable="false" show-icon style="margin-bottom: 3%;" />
    <el-form ref="editChannelFormRef" :model="editChannelForm" label-width="50%" :label-position="'left'" status-icon>

        <ElRow :gutter="12">
            <ElCol :span="12">
                <el-form-item label="Visibility" prop="channelType">
                    <el-select v-model="editChannelForm.channelType" @change="onVisibilityChange()" :loading="loadingUpdate"
                        style="margin-right: 3%;">
                        <el-option :key="EChannelType.Public" :label="EChannelType.Public.toString()"
                            :value="EChannelType.Public"></el-option>
                        <el-option :key="EChannelType.Protected" :label="EChannelType.Protected.toString()"
                            :value="EChannelType.Protected"></el-option>
                        <el-option :key="EChannelType.Private" :label="EChannelType.Private.toString()"
                            :value="EChannelType.Private"></el-option>
                    </el-select>
                </el-form-item>
            </ElCol>
            <ElCol :span="12">
                <el-form-item label="Edit password" v-if="editChannelForm.channelType === EChannelType.Protected">

                    <el-button @click="onSetPassword" :loading="loadingUpdate"><el-icon>
                            <Edit />
                        </el-icon></el-button>
                </el-form-item>
            </ElCol>
        </ElRow>
    </el-form>
</template>

<script setup lang="ts">
import { EChannelType, type Channel, useUpdateChannelMutation } from '@/graphql/graphql-operations'
import { type FormInstance, ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'

const { mutate, onDone, onError, loading: loadingUpdate } = useUpdateChannelMutation({})

const props = defineProps<{
    channel: Channel
}>()

const lastSelection = ref<EChannelType>(EChannelType.Public)

interface EditChannelForm {
    channelType: EChannelType
    password: string
}

const editChannelFormRef = ref<FormInstance>()
const editChannelForm = reactive<EditChannelForm>({
    channelType: EChannelType.Public,
    password: ``,
})

const onResetForm = () => {
    editChannelForm.channelType = props.channel.channelType
    lastSelection.value = editChannelForm.channelType
}

onMounted(() => {
    onResetForm()
})

const onVisibilityChange = (() => {
    if (editChannelForm.channelType === EChannelType.Protected)
        onSetPassword()
    else {
        mutate({
            args: {
                id: props.channel.id,
                channelType: editChannelForm.channelType,
                password: null
            }
        })
        lastSelection.value = editChannelForm.channelType
    }

})

const onSetPassword = () => {
    ElMessageBox.prompt('Please input your channel password', 'password', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputPattern: /^.{3,}$/,
        inputErrorMessage: 'Invalid password, must be at least 3 characters long',
    }).then(({ value }) => {
        mutate({
            args: {
                id: props.channel.id,
                channelType: editChannelForm.channelType,
                password: value,
            }
        })
        lastSelection.value = editChannelForm.channelType
    })
        .catch(() => {
            editChannelForm.channelType = lastSelection.value
        })
}

onDone(() => {
    ElMessage({
        showClose: true,
        message: `Update complete`,
        type: `success`
    })
})

onError((e) => {
    ElMessage({
        showClose: true,
        message: e.message,
        type: `error`
    })
})

</script>

<style scoped lang="sass">

</style>