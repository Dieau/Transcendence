<template>
	<el-dialog v-model="dialog" title="Create channel" width="42%" style="border-radius: var(--el-border-radius-base)"
		:before-close="handleClose" close-on-press-escape>
		<el-form ref="channelFormRef" :model="channelForm" :rules="rules" label-width="30%" :label-position="'left'"
			status-icon>
			<el-form-item label="Channel name" prop="channelName">
				<el-input @keyup="search" v-model="channelForm.channelName" />
			</el-form-item>
			<el-form-item label="Channel visibility" prop="channelType">
				<el-select v-model="channelForm.channelType">
					<el-option :key="EChannelType.Public" :label="EChannelType.Public.toString()"
						:value="EChannelType.Public"></el-option>
					<el-option :key="EChannelType.Protected" :label="EChannelType.Protected.toString()"
						:value="EChannelType.Protected"></el-option>
					<el-option :key="EChannelType.Private" :label="EChannelType.Private.toString()"
						:value="EChannelType.Private"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="channelForm.channelType === EChannelType.Protected" label="Channel Password"
				prop="password">
				<el-input show-password type="'password'" v-model="channelForm.password" />
			</el-form-item>
			<div style="display: flex; justify-content: space-between;">
				<el-button @click="resetForm">Reset</el-button>
				<el-button :disabled="loading || searching" type="primary" @click="submitForm"> Create </el-button>
			</div>
		</el-form>
	</el-dialog>
</template>

<script setup lang="ts">
import {
	EChannelMemberType,
	EChannelType,
	useCheckChannelNameQuery,
	useCreateChannelMutation,
	useCreateMyMemberForChannelMutation,
	useFindAllChannelsForUserQuery
} from '@/graphql/graphql-operations'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import doge from '@/assets/doge.png'

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

const query = useFindAllChannelsForUserQuery({})

const { mutate: mutateChannel, onError: createChannelError } = useCreateChannelMutation({})
const { mutate: mutateChannelMember } = useCreateMyMemberForChannelMutation({})

const router = useRouter()

interface ChannelForm {
	channelName: string
	channelType: EChannelType
	password: string
}

const channelFormRef = ref<FormInstance>()
const channelForm = reactive<ChannelForm>({
	channelName: ``,
	channelType: EChannelType.Public,
	password: ``,
})

const { result: nameChecked, refetch: checkName, loading } = useCheckChannelNameQuery({
	args: { channelName: channelForm.channelName }
})

const validateChannelName = (_rule: any, _value: any, callback: any) => {
	if (channelForm.channelName.trim().length === 0) {
		callback(new Error(`Must contain characters`))
	}
	if (nameChecked.value?.checkChannelName) {
		callback(new Error(`This name is already used by another Channel!`))
	} else {
		callback()
	}
}

const validatePassword = (_rule: any, _value: any, callback: any) => {
	if (channelForm.password.trim().length === 0) {
		callback(new Error(`Must contain characters`))
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
	password: [
		{ required: true, message: `Please input Channel password`, trigger: `blur` },
		{ min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' },
		{ validator: validatePassword, trigger: `blur` }
	],
})

const submitForm = async () => {
	if (!channelFormRef.value) return
	await channelFormRef.value.validate((valid) => {
		if (valid) {
			onCreateChannel()
		} else {
			ElMessage({
				showClose: true,
				message: `Invalid form`,
				type: `error`
			})
		}
	})
}

const resetForm = () => {
	if (!channelFormRef.value) return
	channelFormRef.value.resetFields()
}

let timeout: number | undefined
const searching = ref(false)

const search = () => {
	searching.value = true
	clearTimeout(timeout)
	timeout = setTimeout(() => {
		checkName({ args: { channelName: channelForm.channelName } })
		searching.value = false
	}, 1000)
}

const onCreateChannel = async () => {
	//Protected
	if (channelForm.channelType === EChannelType.Protected) {
		await mutateChannel({
			args: {
				name: channelForm.channelName,
				password: channelForm.password,
				channelType: channelForm.channelType,
				avatarUrl: doge,
			}
		}).then((args) =>
			mutateChannelMember({
				args: {
					channelId: args?.data?.createChannel.id!,
					channelPassword: channelForm.password,
					type: EChannelMemberType.Owner
				}
			}).catch()
		).then((args) => {
			router.replace({ query: { channelId: args?.data?.createMyMemberForChannel.channelId } })
		})
	}
	//Public & Private
	else {
		await mutateChannel({
			args: {
				name: channelForm.channelName,
				channelType: channelForm.channelType,
				avatarUrl: doge,
			}
		}).then((args) =>
			mutateChannelMember({
				args: {
					channelId: args?.data?.createChannel.id!,
					type: EChannelMemberType.Owner
				}
			})
		).then((args) => {
			router.replace({ query: { channelId: args?.data?.createMyMemberForChannel.channelId } })
		})
	}
	query.refetch()
	dialog.value = false
	resetForm()
}

createChannelError((e) => {
	ElMessage({
		showClose: true,
		message: e.message,
		type: `error`
	})
})

const handleClose = () => {
	dialog.value = false
	resetForm()
}
</script>

<style scoped lang="sass"></style>
