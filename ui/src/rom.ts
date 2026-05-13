import Chart, { ChartTypeRegistry } from "chart.js/auto"
import { attachGraph, colors, Disk } from "./utils"
import { Meter } from "./meters"

export class DisksMeter implements Meter {
  canvas: HTMLCanvasElement = document.createElement("canvas")

  chart: Chart<keyof ChartTypeRegistry, number[]> = this.defaultChart()
  /**
    * Функция для внедрения графика в дерево элементов. График заменит все дочерние элементы контейнера.
    */
  public attach(container: HTMLElement) {
    this.canvas.remove()
    this.canvas = document.createElement('canvas');
    this.chart = this.defaultChart()
    attachGraph(container, this.canvas, "rom", "disks", "Разделы")
  }

  defaultChart() {

    return new Chart(this.canvas, {
      type: "bar",
      data: {
        labels: [],
        datasets: [{ label: "Доступно (%)", data: [], backgroundColor: colors[0] }, { label: "Свободно (%)", data: [], backgroundColor: colors[1] }]
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
  }


  /**
    * @param freqs Новые частоты. Должен быть массивом с частотами каждого ядра в текущий момент. При несовпадении количества ядер с внутренним состоянием произойдёт сброс графика.
    */
  pushDisks(disks: Disk[]) {

    let chart = this.chart;

    if (disks.length != chart.data.labels?.length || disks.length != chart.data.datasets[0].data.length) {
      chart.data.labels = []
      chart.data.datasets[0].data = []
      for (let i = 0; i < disks.length; i++) {
        chart.data.labels.push(disks[i].path)
        chart.data.datasets[0].data.push(disks[i].avail / disks[i].total * 100)
        chart.data.datasets[1].data.push(disks[i].free / disks[i].total * 100)
      }
    }
    chart.update()
  }
}
