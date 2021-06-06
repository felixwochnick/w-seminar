<template>
    <Chart
        v-for="(item, index) in [
            'Dendrometer 02 - Diameter.json',
            'SapFlow+ sensor 02 - Sap flux density .json',
            'SapFlow+ sensor 02 - sap velocity.json',
        ]"
        :key="index"
        :jsonFile="item"
        :index="index"
    ></Chart>
</template>

<script lang="ts">
import { CategoryScale, Chart as chart, LinearScale, LineController, LineElement, PointElement, Title } from 'chart.js';
import { defineComponent } from 'vue'
import Chart from './components/Chart.vue'

export default defineComponent({
    name: 'App',
    components: {
        Chart,
    },
    setup() {
        chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);
    }
})
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
