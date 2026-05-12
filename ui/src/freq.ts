import Chart, { ChartTypeRegistry } from "chart.js/auto"
import { attachGraph, colors } from "./utils"
import { Meter } from "./meters"

export class CpuFreqMeter implements Meter{
  canvas: HTMLCanvasElement = document.createElement("canvas")

  chart: Chart<keyof ChartTypeRegistry, number[]> = new Chart(this.canvas, {
    type: "bar",
    data: {
      datasets: []
    },
    options: {
      indexAxis: 'y',
      maintainAspectRatio: false,
      backgroundColor: colors[1],
      plugins: {
        legend: {
          display: false
        }
      },
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
    attachGraph(container, this.canvas, "cpu", "freq", "Частота")
  }

  /**
    * Сбрасывает график
    */
  reset(cores: number) {
    // Добавляем новые массивы в график
    this.chart.data.datasets = [{ label: "Частота", data: [] }]

    this.chart.data.labels = []
    // Создаём датасеты
    for (let i = 0; i < cores; i++) {
      this.chart.data.labels.push(`Ядро ${i}`)
      this.chart.data.datasets[0].data.push(0)
    }

    // И датасет для среднего
    this.chart.data.labels.push(`Средняя`)
    this.chart.data.datasets[0].data.push(0)
  }

  /**
    * @param freqs Новые частоты. Должен быть массивом с частотами каждого ядра в текущий момент. При несовпадении количества ядер с внутренним состоянием произойдёт сброс графика.
    */
  pushCpuFreq(freqs: number[]) {

    let chart = this.chart;
    // Сбрасываем график при изменении количества ядер
    if (chart.data.datasets.length == 0 || chart.data.datasets[0].data.length != freqs.length + 1) {
      this.reset(freqs.length)
    }

    let sum = 0
    for (let i = 0; i < freqs.length; i++) {
      sum += freqs[i]
      chart.data.datasets[0].data[i] = freqs[i]
    }



    chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1] = sum / freqs.length
    chart.update()
  }
}
