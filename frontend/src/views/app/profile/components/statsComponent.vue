<template>
	<div class="wrapper" >
		<div class="stat-component">
			<div class="player-stat">
			<p class="header-text"><el-icon><Histogram /></el-icon> Ranking </p>
			<div class="progress-wrapper">
				<p class="single-info-text">{{ wRanking }}</p>
			</div>
		</div>
		</div>
		<div class="stat-component">
			<div class="player-stat">
			<el-tooltip content="Average goals scored per Game." effect="dark">
				<p class="header-text"><el-icon><Operation /></el-icon> Average ⓘ </p>
			</el-tooltip>
			<div class="progress-wrapper">
				<p class="single-info-text">{{ meanPoints?.toFixed(0) }}</p>
			</div>
		</div>
		</div>
		<div class="stat-component">
			<div class="player-stat">
			<el-tooltip content="Win / Lose Ratio." effect="dark">
				<p class="header-text"><el-icon><SwitchFilled /></el-icon> Winrate ⓘ </p>
			</el-tooltip>
			<div class="progress-wrapper">
				<p v-if="winrate" class="single-info-text">{{ (winrate * 100).toFixed(0)}}%</p>
				<p v-if="!winrate" class="single-info-text">0%</p>
			</div>
		</div>
		</div>
		<div class="stat-component">
			<div class="player-stat">
			<p class="header-text"><el-icon><Finished /></el-icon> Played Games </p>
			<div class="progress-wrapper">
				<p class="single-info-text">{{ playedGames }}</p>
			</div>
		</div>
		</div>
		<div class="stat-component">
			<div class="player-stat">
			<el-tooltip content="Performance on last 4 Games." effect="dark">
				<p class="header-text"><el-icon><Sort /></el-icon> Streak ⓘ </p>
			</el-tooltip>
			<div class="progress-wrapper">
				<div class="progress-element" :class="{'inactive-progress': !evolution?.at(0)?.isWinner}"></div>
				<div class="progress-element" :class="{'inactive-progress': !evolution?.at(1)?.isWinner}"></div>
				<div class="progress-element" :class="{'inactive-progress': !evolution?.at(2)?.isWinner}"></div>
				<div class="progress-element" :class="{'inactive-progress': !evolution?.at(3)?.isWinner}"></div>
			</div>
		</div>
		</div>
	</div>
</template>

<script lang="ts">

import { ElTooltip } from 'element-plus'
import type { GameStat } from '@/graphql/graphql-operations'

export default {
  name: 'friend-card-item',
  props: {
	wRanking: Number,
	winrate: Number,
	meanPoints: Number,
	playedGames: Number,
	evolution: [Object as () => GameStat[]]
  },
  setup(props) {
	let userPublic = {ratio: 2}

	return { 
		userPublic
	}
  }
}
</script>



<style scoped lang="sass">

.wrapper
	display: flex
	justify-content: space-evenly
	.stat-component
		.player-stat
			height: 14vh
			width: 13vw
			background: #151519
			border-radius: 10px
			display: flex
			justify-content: center
			align-items: center
			flex-direction: column
			font-family: "roboto"
			.header-text
				margin-top: 3px
				color: white
				justify-content: center
				display: flex
				align-items: center
				font-family:'Vaporfuturism'
				color: #f5721b
			.progress-wrapper
				display: flex
				.progress-element
					height: 35px
					width: 10px
					background: rgba(66, 255, 0, 0.13)
					border: 1px solid rgba(66, 255, 0, 1)
					margin: 5px
					&.inactive-progress
						background: rgba(255, 4, 4, 0.18)
						border: 1px solid red
				.single-info-text
					color: var(--el-color-primary)
					font-size: 13
			&.active
				border: solid 1px #EDB15A


</style>