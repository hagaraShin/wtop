import Chart, { ChartTypeRegistry } from "chart.js/auto"
import { attachGraph, colors } from "./utils"
import { Meter } from "./meters"

export class SwapMeter implements Meter {
  canvas: HTMLCanvasElement = document.createElement("canvas")

  chart: Chart<keyof ChartTypeRegistry, number[]> = this.defaultChart()
  /**
    * Функция для внедрения графика в дерево элементов. График заменит все дочерние элементы контейнера.
    */
  public attach(container: HTMLElement) {
    this.canvas.remove()
    this.canvas = document.createElement('canvas')
    this.chart = this.defaultChart()
    attachGraph(container, this.canvas, "mem", "swap", "Swap")
  }

  defaultChart() {

    return new Chart(this.canvas, {
      type: "doughnut",
      data: {
        labels: ["Занято", "Свободно"],
        datasets: [{ label: "KB", data: [0, 0], backgroundColor: [colors[0], colors[1]] }]
      },
      options: {
        maintainAspectRatio: false
      }
    })
  }


  /**
    * @param freqs Новые частоты. Должен быть массивом с частотами каждого ядра в текущий момент. При несовпадении количества ядер с внутренним состоянием произойдёт сброс графика.
    */
  pushSwap(total: number, avail: number) {

    let chart = this.chart;

    chart.data.datasets[0].data[0] = total - avail
    chart.data.datasets[0].data[1] = avail
    chart.update()
  }
}
