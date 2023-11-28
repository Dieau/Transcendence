<template>
    <el-form ref="editChannelFormRef" :model="editChannelForm" :rules="rules" label-width="30%" :label-position="'left'"
        status-icon @submit.prevent="submitForm" :disabled="loadingUpdate">
        <el-form-item label="Channel avatar" prop="imageUrl">
            <el-upload action="https://api.cloudinary.com/v1_1/dtb5x2jvv/image/upload?upload_preset=cokkbj6i"
                :show-file-list="false" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                <el-avatar :size="90" :src="editChannelForm.imageUrl" />
            </el-upload>
        </el-form-item>
        <el-form-item label="Channel name" prop="channelName">
            <el-input @keyup="search" v-model="editChannelForm.channelName" />
        </el-form-item>
        <el-form-item label="Channel description">
            <el-input :disabled="true" />
        </el-form-item>
        <div style="display: flex; justify-content: space-between;">
            <el-button @click="onResetForm()" :disabled="loadingUpdate" style="margin-right: 3%;">Reset</el-button>
            <el-button :disabled="loading || searching" type="primary" :loading="loadingUpdate" native-type="submit"> Update
            </el-button>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { useCheckChannelNameQuery, type Channel, useUpdateChannelMutation } from '@/graphql/graphql-operations'
import { ElMessage, type FormInstance, type FormRules, type UploadProps } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'

const { mutate, onDone, onError, loading: loadingUpdate } = useUpdateChannelMutation({})

const props = defineProps<{
    channel: Channel
}>()

interface EditChannelForm {
    imageUrl?: string | null
    channelName: string
}

const editChannelFormRef = ref<FormInstance>()

const editChannelForm = reactive<EditChannelForm>({
    imageUrl: '',
    channelName: ``,
})

const onResetForm = () => {
    editChannelForm.imageUrl = props.channel.avatarUrl
    editChannelForm.channelName = props.channel.name
}

onMounted(() => {
    onResetForm()
})


const { result: nameChecked, refetch: checkName, loading } = useCheckChannelNameQuery({
    args: { channelName: editChannelForm.channelName }
})

const validateChannelName = (rule: any, value: any, callback: any) => {
    if (editChannelForm.channelName.trim().length === 0) {
        callback(new Error(`Must contain characters`))
    }
    if (nameChecked.value?.checkChannelName) {
        callback(new Error(`This name is already used by another Channel!`))
    } else {
        callback()
    }
}

const rules = reactive<FormRules>({
    channelName: [
        { required: true, message: `Please input Channel name`, trigger: `blur` },
        { max: 16, message: 'Length should be less than 16 characters', trigger: 'blur' },
        { validator: validateChannelName, trigger: `blur` }
    ],
})

const onUpdateChannel = (() => {
    mutate({
        args: {
            id: props.channel.id,
            name: editChannelForm.channelName,
            avatarUrl: editChannelForm.imageUrl,
        }
    })
})

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

const submitForm = async () => {
    if (!editChannelFormRef.value) return
    await editChannelFormRef.value.validate((valid, fields) => {
        if (valid) {
            onUpdateChannel()//.then(() => alert confirm).catch(() => alert error)
        } else {
            ElMessage({
                showClose: true,
                message: `Invalid form`,
                type: `error`
            })
        }
    })
}

interface AvatarResponse {
    secure_url: string;
}

const handleAvatarSuccess = (response: AvatarResponse) => {
    if (response && response.secure_url) {
        editChannelForm.imageUrl = response.secure_url
    } else {
        ElMessage.error(`Error loading image.`)
    }
}


const beforeAvatarUpload: UploadProps[`beforeUpload`] = (rawFile) => {
    if (rawFile.type !== `image/jpeg`) {
        ElMessage.error(`Avatar picture must be JPG format!`)
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error(`Avatar picture size can not exceed 2MB!`)
        return false
    }
    return true
}

let timeout: number | undefined
const searching = ref(false)

const search = () => {
    searching.value = true
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        checkName({ args: { channelName: editChannelForm.channelName } })
        searching.value = false
    }, 1000)
}

</script>

<style scoped lang="sass">

</style>