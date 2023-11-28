<template>
	<div class="active-game-item">
		<div class="vs-container">
			<div class="avatar-container">
				<el-avatar :src="gameMember1Ref?.userGameInfos?.avatarUrl"/>
			</div>
			<h1 class="vs-text">Vs</h1>
			<div class="avatar-container">
				<el-avatar :src="gameMember2Ref?.userGameInfos?.avatarUrl"/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { ref, defineComponent } from "vue"
	import type { GameMember } from "@/graphql/graphql-operations"
	import type { PropType } from "vue"

	export default defineComponent({
		name: `statistic-card`,
		props: {
			GameMember1: {
				type: Object as PropType<GameMember | undefined>,
				required: false,
			},
			GameMember2: {
				type: Object as PropType<GameMember | undefined>,
				required: false,
			}
		},
		setup(props) {
			const gameMember1Ref = ref(props.GameMember1)
			const gameMember2Ref = ref(props.GameMember2)
			return {
				gameMember1Ref,
				gameMember2Ref,
			}
		}
	})
</script>


<style scoped lang="sass">
.active-game-item
	height: 7vh
	width: 20vw
	background: #111115
	display: flex
	justify-content: center
	align-items: center
	border-radius: var(--el-border-radius-base)
	flex-direction: column
	transition: height 0.3s ease

	.vs-container
		margin: 10px
		display: flex
		justify-content: space-evenly
		align-items: center
		height: 7vh
		width: 20vw
	.vs-text
		font-family: "Roboto"
		font-weight: 400
		color: #00FF0A
		font-size: 24px
		margin-top: -7px
		-webkit-font-smoothing: antialiased
		-moz-osx-font-smoothing: grayscale
		margin: 0px
</style>