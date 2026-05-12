import Chart, { ChartTypeRegistry } from "chart.js/auto"
import { attachGraph, colors, Disk, NetSpeed } from "./utils"
import { Meter } from "./meters"

export class NetMeter implements Meter {
  canvas: HTMLCanvasElement = document.createElement("canvas")

  chart: Chart<keyof ChartTypeRegistry, number[]> = new Chart(this.canvas, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{ label: "Входящий (kbps)", data: [], backgroundColor: colors[0] }, { label: "Исходящий (kbps)", data: [], backgroundColor: colors[1] }]
    },
    options: {
      interaction: {
        intersect: false,
        axis: "y"
      },
      plugins: {
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      maintainAspectRatio: false,
      indexAxis: "y"
    }
  })
  /**
    * Функция для внедрения графика в дерево элементов. График заменит все дочерние элементы контейнера.
    */
  public attach(container: HTMLElement) {
    attachGraph(container, this.canvas, "net", "network", "Трафик")
  }


  /**
    * @param freqs Новые частоты. Должен быть массивом с частотами каждого ядра в текущий момент. При несовпадении количества ядер с внутренним состоянием произойдёт сброс графика.
    */
  pushSpeeds(speeds: NetSpeed[]) {

    let chart = this.chart;

    if (speeds.length != chart.data.labels?.length || speeds.length != chart.data.datasets[0].data.length|| speeds.length != chart.data.datasets[1].data.length) {
      chart.data.labels = []
      for (let i = 0; i < speeds.length; i++) {
        chart.data.labels.push(speeds[i].interface)
      }
      chart.data.datasets[0].data = []
      chart.data.datasets[1].data = []
    }
    for (let i = 0; i < speeds.length; i++) {
      chart.data.datasets[0].data.push(speeds[i].download / 1024)
      chart.data.datasets[1].data.push(speeds[i].upload / 1024)
    }
    chart.update()
  }
}
