import { CartesianScaleOptions, CartesianScaleTypeRegistry, Chart, ChartDataset, ChartTypeRegistry, DatasetChartOptions, Point, ScaleOptionsByType } from "chart.js/auto"
import { CpuFreqMeter } from "./freq";
import { parsedUpdates } from "./utils";



export class Meters {
  cpu: CpuFreqMeter = new CpuFreqMeter()
  async update() {
    const now = new Date()
    const parsed = await parsedUpdates();
    const freqs = parsed.cpu.freqs;
    this.cpu.pushCpuFreq(freqs, now)
  }
}



