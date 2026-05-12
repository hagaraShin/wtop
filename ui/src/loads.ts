import Chart, { ChartTypeRegistry } from "chart.js/auto"
import { attachGraph, colors } from "./utils"
import { Meter } from "./meters"

export class CpuLoadMeter implements Meter {
  time_labels: number[] = []

  canvas: HTMLCanvasElement = document.createElement("canvas")

  chart: Chart<keyof ChartTypeRegistry, number[]> = new Chart(this.canvas, {
    type: "bar",
    data: {
      datasets: []
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      maintainAspectRatio: false,
      backgroundColor: colors[0],
      interaction: {
        intersect: false,
        axis: 'y'
      }
    }
  })

  /**
    * Функция для внедрения графика в дерево элементов. График заменит все дочерние элементы контейнера.
    */
  public attach(container: HTMLElement) {
    attachGraph(container, this.canvas, "cpu", "loads", "Загрузка")
  }

  /**
    * Сбрасывает график
    */
  reset(cores: number) {
    // Добавляем новые массивы в график
    this.chart.data.datasets = [{ label: "Загрузка", data: []}]

    this.chart.data.labels = []
    // Создаём датасеты
    for (let i = 0; i < cores; i++) {
      this.chart.data.labels.push(`Ядро ${i}`)
      this.chart.data.datasets[0].data.push(0)
    }

    // И датасет для среднего
    this.chart.data.labels.push(`Общая`)
    this.chart.data.datasets[0].data.push(0)
  }

  /**
    * @param loads Новая загрузка. Должен быть массивом с частотами каждого ядра в момент now. При несовпадении количества ядер с внутренним состоянием произойдёт сброс графика.
    */
  pushCpuLoads(loads: number[]) {

    let chart = this.chart;
    // Сбрасываем график при изменении количества ядер
    if (chart.data.datasets.length == 0  || chart.data.datasets[0].data.length != loads.length) {
      this.reset(loads.length - 1)
    }

    for (let i = 1; i < loads.length; i++) {
      chart.data.datasets[0].data[i - 1] = loads[i]
    }


    chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] = loads[0]
    chart.update()
  }
}
