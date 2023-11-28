<template>
      <div class="player-stat" :class="{ 'active': userPublic }">
		<img src="../../../../assets/person-icon.svg"/>
		<h1 style="margin-bottom:0px; margin-top: 5px">{{displayName}}</h1>
		<p style="margin-top: 3px; color: #979797">{{ userPublic?.username || "-" }}</p>
		<div v-if="userPublic" class="progress-wrapper">
			<div class="progress-element" :class="{'inactive-progress': userPublic.ratio <= 0.25}"></div>
			<div class="progress-element" :class="{'inactive-progress': userPublic.ratio <= 0.5}"></div>
			<div class="progress-element" :class="{'inactive-progress': userPublic.ratio <= 0.75}"></div>
			<div class="progress-element" :class="{'inactive-progress': userPublic.ratio <= 1}"></div>
		</div>
		<el-icon v-if="!userPublic" :size="40"><Plus/></el-icon>
      </div>
</template>

<script lang="ts">
 
import { useFindPublicGameInfosForUserQuery, type UserPublicGameInfos } from '@/graphql/graphql-operations'
import { ref, computed, type ComputedRef } from "vue"


export default {
  props: {
	idPlayer:String,
	name:String
  },
  setup(props) {
    let userPublicRef = ref<ComputedRef<UserPublicGameInfos | undefined>>()
	let displayName = ref(props.name)
	if (props.idPlayer) {
		const { result:resultForUserPlayer } = useFindPublicGameInfosForUserQuery({ userId: props.idPlayer})
		userPublicRef.value = computed(() => resultForUserPlayer.value?.findPublicGameInfosForUser)
	}
	const userPublic = userPublicRef.value
	return {
	  userPublic,
	  displayName
	}
}
}

</script>

<style scoped lang="sass">
.player-stat
	height: 100%
	width: 45%
	background: #151519
	border-radius: 10px
	display: flex
	justify-content: center
	align-items: center
	flex-direction: column
	font-family: "roboto"
	.progress-wrapper
		display: flex
		.progress-element
			height: 35px
			width: 10px
			background: rgba(66, 255, 0, 0.13)
			border: 1px solid rgba(66, 255, 0, 1)
			margin: 5px
			&.inactive-progress
				background: transparent
				border: 1px solid rgba(249, 249, 249, 0.14)
	&.active
		border: solid 1px #EDB15A

</style>
