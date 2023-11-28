<template>
  <div style="display: flex; width:100%">
    <el-empty v-if="!loading && !error && !gameRatios.length" style="display: flex; width:100%"
      description="No data">
    </el-empty>
    <div v-if="loading">Loading...</div>
    <Line v-if="!loading && !error && gameRatios.length" :data="chartDataComputed" :options="options"/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRef, onMounted} from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'
import 'chartjs-adapter-moment'
import { useFindPublicGameRatiosQuery, type GameRatio } from '@/graphql/graphql-operations'
import { Line } from "vue-chartjs"

const props = defineProps({
  userId: {
    type: String,
    required: true,
  }
})
const userIdProp = toRef(props, 'userId')
const gameRatios = ref<GameRatio[]>([])

const { result, loading, error, refetch, variables } = useFindPublicGameRatiosQuery({ userid: '' })

watch(result, newResult => {
  if (newResult && newResult.findPublicGameRatios && Array.isArray(newResult.findPublicGameRatios)) {
    gameRatios.value = newResult.findPublicGameRatios
  }
}, { immediate: true })

onMounted(() => {
  if (props.userId) {
    variables.value = { userid : props.userId}
    refetch()
  }
})

watch(userIdProp, async (newValue) => {
  if (newValue) {
    try {
      await refetch({ userid: newValue })
    } catch (refetchError) {
    }
  }
}, { immediate: true })


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

const chartDataComputed = computed(() => {
  if (gameRatios.value && Array.isArray(gameRatios.value) && gameRatios.value.length > 0) {
    return {
      labels: gameRatios.value.map(item => item.date),
      datasets: [
        {
          label: `Global Ratio`,
          data: gameRatios.value.map(item => item.ratio),
          borderColor: `rgba(250,38,247, 1)`,
          fill: true,
        },
      ],
    }
  } else {
    return {
      labels: [],
      datasets: [{
        label: ``,
        data: [],
        borderColor: ``,
        fill: false
      }]
    }
  }
})


const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: `time`,
      time: {
        unit: `day`,
      },
    },
    y: {
      beginAtZero: true,
      suggestedMax: 1,
    },
  },
} as any
</script>


<style scoped lang="scss"></style>