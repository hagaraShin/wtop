import Chart, { ChartTypeRegistry } from "chart.js/auto"
import { colors } from "./utils"

export class RamMeter {
  canvas: HTMLCanvasElement = document.createElement("canvas")

  chart: Chart<keyof ChartTypeRegistry, number[]> = new Chart(this.canvas, {
    type: "doughnut",
    data: {
      labels: ["Занято", "Доступно"],
      datasets: [{ label: "KB", data: [0,0], backgroundColor: [colors[0], colors[1]] }]
    },
  })
  /**
    * Функция для внедрения графика в дерево элементов. График заменит все дочерние элементы контейнера.
    */
  public attach(container: HTMLElement) {
    container.replaceChildren(this.canvas)
  }


  /**
    * @param freqs Новые частоты. Должен быть массивом с частотами каждого ядра в текущий момент. При несовпадении количества ядер с внутренним состоянием произойдёт сброс графика.
    */
  pushRam(total: number, avail: number) {

    let chart = this.chart;

    chart.data.datasets[0].data[0] = total - avail
    chart.data.datasets[0].data[1] = avail
    chart.update()
  }
}
