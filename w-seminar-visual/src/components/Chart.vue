<template>
    <canvas :id="'canvas-' + index"></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { Chart } from 'chart.js'

export default defineComponent({
    props: {
        jsonFile: {
            type: String,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        let chart: Chart | undefined = undefined

        onMounted(async () => {
            const canvas = document.querySelector<HTMLCanvasElement>(
                '#canvas-' + props.index
            ) as HTMLCanvasElement

            const json: {
                data: [{ date: string; time: string; [key: string]: any }]
            } = await import('./../assets/json/' + props.jsonFile)

            const filtered = json.data.filter(
                (v) =>
                    v.date == '15.08.2019' &&
                    v.time >= '12:00' &&
                    v.time <= '13:00'
            )
            getDatasets(filtered)
            new Chart(canvas, {
                type: 'line',
                data: {
                    labels: getLables(filtered),
                    datasets: getDatasets(filtered),
                },
            })
        })

        return {
            chart,
        }
    },
})

function getDatasets(array: { [key: string]: any }[]) {
    const datasets: { label: string; data: number[]; [key: string]: any }[] = []
    for (const key of Object.keys(array[0])) {
        if (key == 'date' || key == 'time') continue
        datasets.push({
            label: key,
            data: array.map((v) =>
                Number(v[key].replace('\r', '').replace(',', '.'))
            ),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        })
    }

    console.log(datasets)

    return datasets
}
function getLables(array: { [key: string]: any }[]) {
    let datasets: string[] = []

    datasets = array.map((v) => v['time'])

    return datasets
}
</script>
