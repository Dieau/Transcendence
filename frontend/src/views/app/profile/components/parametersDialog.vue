<template>
	<div>
		<el-dialog v-model="paramDialogVisible" class="dialog" title="Parameters" width="42%"
			style="border-radius: var(--el-border-radius-base)">
			<el-tabs v-model="activeTab" class="demo-tabs">
				<el-tab-pane label="Account" name="first">
					<el-form label-width="30%" :label-position="`left`" status-icon ref="updateUserFormRef"
						:model="updateUserForm" :rules="rules" size="default">
						<el-form-item label="Profile Picture" class="form-item">
							<div class="avatar-section">
								<el-upload class="avatar-uploader"
									action="https://api.cloudinary.com/v1_1/dtb5x2jvv/image/upload?upload_preset=cokkbj6i"
									:show-file-list="false" :on-success="handleAvatarSuccess"
									:before-upload="beforeAvatarUpload">
									<div class="avatar-container">
										<el-avatar :src="loggedInUser?.avatarUrl" class="avatar" />
										<div class="avatar-overlay">
											<span>Upload</span>
										</div>
									</div>
								</el-upload>
							</div>
						</el-form-item>

						<el-form-item label="Pseudo" prop="pseudo" class="form-item">
							<el-input v-model="updateUserForm.pseudo" :placeholder="loggedInUser?.username"></el-input>
							<el-button v-if="updateUserForm.pseudo" @click="onUsernameUpdated()">Confirm</el-button>
						</el-form-item>

						<el-form-item label="Password" prop="password" class="form-item">
							<el-alert v-if="loggedInUser?.isOauth" title="OAuth " type="warning" show-icon
								:closable="false" />
							<el-input v-if="!loggedInUser?.isOauth" v-model="updateUserForm.password" show-password
								placeholder="new password"></el-input>
						</el-form-item>
						<el-form-item v-if="updateUserForm.password" label="Retype Password" prop="retypePassword"
							class="form-item">
							<el-input v-if="updateUserForm.password" v-model="updateUserForm.retypePassword"
								show-password></el-input>
							<el-button v-if="updateUserForm.retypePassword" @click="onPasswordUpdated()">Confirm</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="2fa" name="second">
					<el-alert v-if="loggedInUser?.isOauth" title="This account is OAuth, it cannot register to 2FA."
						type="info" show-icon :closable="false" />
					<div class="pitier" v-if="!loggedInUser?.isOauth">
						<el-alert v-if="activateTwoFactorInput"
							title="Scan the QR-code and enter the code given by Google Authenticator:" type="warning"
							:closable="false" />
						<el-form label-width="50%" status-icon>
							<el-form-item label="Activate two-factor authentication" class="form-item">
								<el-switch v-model="activateTwoFactorInput" @click="disabledoubleAuthOrNot"></el-switch>
							</el-form-item>
							<div v-if="activateTwoFactorInput">
								<el-form-item class="form-item">
									<el-input v-model="authSecretCode" placeholder="code"></el-input>
									<el-button @click="validateGoogleSecret(authSecretCode)">Submit</el-button>
								</el-form-item>
								<el-form-item class="form-item">
									<img :src="twoFaQrCodeBase64" alt="QR Code" class="qr-code-image" />
								</el-form-item>
							</div>
						</el-form>
					</div>
				</el-tab-pane>
				<el-tab-pane label="Blocklist" name="third">
					<blockUsersDialog />
				</el-tab-pane>
				<el-tab-pane label="Misc." name="fourth">
					<el-form label-width="30%" :label-position="`left`" status-icon>
						<el-form-item label="Free Discord Nitro" class="form-item">
							<el-button @click="openDiscordNitroLink">Free Discord Nitro</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
	</div>
</template>
  
<script setup lang="ts">
import { ref, computed, reactive, inject, watch, type Ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, type UploadProps, type FormRules } from 'element-plus'
import blockUsersDialog from './blockUsersDialog.vue'
import {
	useFindUserTwoFaSettingsQuery,
	useUpdateMyUserMutation,
	useIsGoogleAuthCodeValidMutation,
	useUpdateMyPasswordMutation,
	type User
} from '@/graphql/graphql-operations'

const { mutate: updateusermutate } = useUpdateMyUserMutation()
const { mutate: validategooglesecretmutate } = useIsGoogleAuthCodeValidMutation()
const { mutate: updatemypasswordmutate } = useUpdateMyPasswordMutation()
const { result: resultForTwoFaSettings } = useFindUserTwoFaSettingsQuery()

interface ruleForm {
	pseudo: string
	password: string
	retypePassword: string
}

const paramDialogVisible = ref(false)

const loggedInUser = inject<Ref<User>>('loggedInUser')
const activateTwoFactorInput = loggedInUser ? loggedInUser.value?.doubleAuth ? ref(true) : ref(false) : null
const twoFaQrCodeBase64 = computed(() => resultForTwoFaSettings.value?.findUserTwoFaSettings.googleAuthenticatorQrCode)
const activeTab = ref(`first`)
const authSecretCode = ref(``)
const updateUserFormRef = ref<FormInstance>()
const updateUserForm = reactive<ruleForm>({
	pseudo: '',
	password: '',
	retypePassword: ''
})

watch(paramDialogVisible, () => {
	if (activateTwoFactorInput) {
		activateTwoFactorInput.value = loggedInUser ? loggedInUser.value?.doubleAuth ? true : false : false
	}
})

const changeDialogVisibility = () => {
	paramDialogVisible.value = true
}

const openDiscordNitroLink = () => {
	const link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
	window.open(link, '_blank')
}

interface AvatarResponse {
	secure_url: string;
}

const handleAvatarSuccess = (response: AvatarResponse) => {
	if (response && response.secure_url) {
		updateUserAvatar(response.secure_url)
	} else {
		ElMessage.error(`Error loading image.`)
	}
}

const updateUserAvatar = (url: string) => {
	updateusermutate({
		args: {
			avatarUrl: url
		}
	}).then(
		() => {
			ElMessage.info('your avatar have been updated')
		}).catch
		(
			(err) => {
				ElMessage.error(err.message)
			}
		)
}

const manageDoubleAuth = async (status: boolean) => {
	await updateusermutate({
		args: {
			doubleAuth: status
		}
	}).then(
		(res) => {
			if (res?.data?.updateMyUser.doubleAuth == true) {
				ElMessage.info('2fa is now activated')
			}
			else {
				ElMessage.info('2fa is now deactivated')
			}
		}).catch
		(
			(err) => {
				ElMessage.error(err.message)
			}
		)
}

const onUsernameUpdated = async () => {
	if (updateUserFormRef.value) {
		await updateUserFormRef.value.validateField('pseudo')
			.then(async () => {
				await updateusermutate({
					args: {
						username: updateUserForm.pseudo
					}
				})
					.then((res) => {
						if (res?.data?.updateMyUser.username) {
							ElMessage.info('your username have been updated')
							updateUserForm.pseudo = ''
						}
					})
			})
			.catch(() => {
				ElMessage.error("your new pseudo doesn't match requiered fields")
			})
	}
}

const onPasswordUpdated = async () => {
	if (updateUserForm.password === updateUserForm.retypePassword) {
		if (updateUserFormRef.value) {
			await updateUserFormRef.value.validateField('password')
				.then(async () => {
					await updatemypasswordmutate({
						args: {
							newPassword: updateUserForm.password
						}
					})
						.then((res) => {
							if (res?.data?.updateMyPassword) {
								ElMessage.info("your password have been updated")
								updateUserForm.password = ''
								updateUserForm.retypePassword = ''
							}
						})
						.catch((error) => {
							ElMessage.error(error)
						})
				})
				.catch(() => {
					ElMessage.error("your new password doesn't match requiered fields")
				})
		}
	} else {
		ElMessage.error("the given passwords does not match !")
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

const validateGoogleSecret = (secret: string) => {
	validategooglesecretmutate({
		args: {
			code: secret
		}
	}).then(
		(res) => {
			if (res && res?.data?.isGoogleAuthCodeValid === true) {
				manageDoubleAuth(true)
			}
			else {
				ElMessage.error(`Invalid code`)
			}
		}
	)
}

const disabledoubleAuthOrNot = () => {
	if (loggedInUser && loggedInUser.value?.doubleAuth) {
		manageDoubleAuth(false)
	}
}


const validatePass = (rule: any, value: any, callback: any) => {
	const hasUppercase = /[A-Z]/.test(value)
	const hasLowercase = /[a-z]/.test(value)
	const hasDigit = /[0-9]/.test(value)
	if (value === '') {
		callback(new Error('Enter your password.'))
	}
	if (!hasUppercase) callback(new Error('Password must contain an uppercase character.'))
	else if (!hasLowercase) callback(new Error('Password must contain a lowercase character.'))
	else if (!hasDigit) callback(new Error('Password must contain a digit.'))
	else {
		if (updateUserForm.retypePassword !== '') {
			if (updateUserFormRef.value) {
				updateUserFormRef.value.validateField('checkPass', () => null)
			}
		}
		callback()
	}
}

const validatePass2 = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('Confirm your password'))
	} else if (value !== updateUserForm.password) {
		callback(new Error("Passwords don't match!"))
	} else {
		callback()
	}
}

const validatePseudo = (rule: any, value: any, callback: any) => {
	if (value === '') {
		callback(new Error('Enter your desired Username'))
	}
	else {
		callback()
	}
}

const rules: FormRules = {
	pseudo: [
		{ required: true, message: 'Enter your desired Pseudo', trigger: 'blur' },
		{ min: 3, max: 12, message: 'Pseudo must be between 3 and 12 characters!', trigger: 'blur' },
		{ validator: validatePseudo, trigger: 'blur' }
	],
	password: [
		{ min: 6, max: 15, message: 'Your password must be between 8 and 16 characters long!', trigger: 'blur' },
		{ validator: validatePass, trigger: 'blur' }
	],
	retypePassword: [
		{ required: true, message: 'You need to confirm your password', trigger: 'blur' },
		{ validator: validatePass2, trigger: 'blur' }
	]
}

defineExpose({ changeDialogVisibility })

</script>
  
<style scoped lang="sass">

$primary-color: #324054
$secondary-color: #465a69
$border-color: #e5e9f2
$hover-color: #2f3e50

.pitier
	display: flex
	flex-direction: column
	justify-items: center
.dialog
	width: 30% 
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center
	padding: 20px
	background-color: $primary-color
	border-radius: var(--el-border-radius-base)
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)
	font-family: 'roboto'
  
	.form-item
		display: flex
		flex-direction: row
		align-items: center
.avatar-section
	position: relative
	flex: 1
  
.avatar-container
	position: relative
	cursor: pointer
  
.avatar-overlay
	position: absolute
	top: 0
	left: 0
	right: 0
	bottom: 0
	display: flex
	align-items: center
	justify-content: center
	background: rgba(0, 0, 0, 0.5)
	border-radius: 100px
	opacity: 0
	transition: opacity 0.2s
  
.qr-code-image
	max-width: 100%
	display: block
	margin: 0 auto
.avatar-container:hover .avatar-overlay
	opacity: 1
  
.avatar
	width: 128px
	height: 128px
	border-radius: 50%
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)
  
.avatar-uploader
	position: relative
  
.info-section
	flex: 2
	display: flex
	flex-direction: column
	align-items: flex-start
	margin-left: 20px
  
.username-container
	position: relative
	cursor: pointer
	font-family: 'roboto'
  
.edit-icon
	position: absolute
	right: -24px
	opacity: 0
	transition: opacity 0.2s
  
.username-container:hover .edit-icon
	opacity: 1
  
.span
	color: $secondary-color
	font-weight: 500
	margin-bottom: 10px
  
.el-button
	margin: 10px
	padding: 8px 12px
	border-radius: 6px
	transition: background-color 0.2s
	&:hover
		background-color: $hover-color
  
.el-input
	width: 50% 
	background-color: $secondary-color
	border: none
	border-radius: 5px
	color: white
  
  </style>
