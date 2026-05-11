import Chart, { ChartTypeRegistry } from "chart.js/auto"
import { createChart } from "./utils"

export class CpuFreqMeter {
  time_labels: number[] = []

  // Реальные данные, собираются каждую секунду
  freqs: number[][] = []
  freq_avgs: number[] = []
  canvas: HTMLCanvasElement = document.createElement("canvas")

  chart: Chart<keyof ChartTypeRegistry, number[]>
  scale: number = 5
  tick = 5

  constructor() {
    this.chart = createChart(this.canvas, this.time_labels, [], {
      offset: false,
      title: {
        display: true,
        text: "Частота(MHz)"
      },
      suggestedMax: 6000,
    })
  }
  /**
    * Функция для внедрения графика в дерево элементов. График заменит все дочерние элементы контейнера.
    */
  public attach(container: HTMLElement) {
    container.replaceChildren(this.canvas)
  }

  setTimeBounds(min: number, max: number) {
    this.chart.scales.x.options.max = max
    this.chart.scales.x.options.min = min
  }

  /**
    * Добавляет среднюю из последних scale измерений в график
    */
  updateToScale() {

    const chart = this.chart;
    chart.data.labels?.push(this.time_labels[this.time_labels.length - 1])

    for (let i = 0; i < this.freqs.length; i++) {
      if (this.tick == this.scale) {
        chart.data.datasets[i].data.push(this.freqs[i].slice(-this.scale - 1, -1).reduce((a, b) => a + b) / this.scale)
      }
    }

    chart.data.datasets[this.freqs.length].data.push(this.freq_avgs.slice(-this.scale - 1, -1).reduce((a, b) => a + b) / this.scale)
    chart.update()
    this.tick = 0
    const now = (new Date()).getTime()

    this.setTimeBounds(now - 60000, now)
  }

  /**
    * Сбрасывает график
    */
  reset(cores: number) {
    let aggrfreqs = []
    let aggravgs = [] as number[]
    let aggrtimes = [] as number[]

    // Стираем данные
    this.freqs = []
    this.time_labels = []

    for (let i = 0; i < cores; i++) {
      this.freqs.push([])
      aggrfreqs.push([])
    }
    // Добавляем новые массивы в график
    this.chart.data.labels = aggrtimes
    this.chart.data.datasets = []

    // Создаём датасеты
    for (let i = 0; i < this.freqs.length; i++) {
      this.chart.data.datasets.push({
        label: `Ядро ${i}`,
        data: aggrfreqs[i],
      })
    }

    // И датасет для среднего
    this.chart.data.datasets.push({
      label: `Среднее`,
      data: aggravgs,
    })

    // Сбрасываем тики
    this.tick = 0
  }

  /**
    * @param freqs Новые частоты. Должен быть массивом с частотами каждого ядра в текущий момент. При несовпадении количества ядер с внутренним состоянием произойдёт сброс графика.
    */
  pushCpuFreq(freqs: number[]) {

    let chart = this.chart;
    // Сбрасываем график при изменении количества ядер
    if (this.freqs.length != freqs.length || chart.data.datasets.length != this.freqs.length + 1) {
      this.reset(freqs.length)
      let sum = 0;
      for (let i = 0; i < freqs.length; i++) {
        sum += freqs[i]
        chart.data.datasets[i].data.push(freqs[i])
      }
      chart.data.datasets[freqs.length].data.push(sum / freqs.length)
    }

    this.time_labels.push((new Date()).getTime())

    let sum = 0;
    for (let i = 0; i < freqs.length; i++) {
      sum += freqs[i]
      this.freqs[i].push(freqs[i])
    }
    this.freq_avgs.push(sum / freqs.length)

    if (this.tick == this.scale || this.tick == -1) {
      this.updateToScale()
    }

    this.tick += 1
  }
}
