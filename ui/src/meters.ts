import { CartesianScaleOptions, CartesianScaleTypeRegistry, Chart, ChartDataset, ChartTypeRegistry, DatasetChartOptions, Point, ScaleOptionsByType } from "chart.js/auto"
import { CpuFreqMeter } from "./freq";



export class Meters {
  cpu: CpuFreqMeter = new CpuFreqMeter()
  async update() {
    const update = await get_update();
    const parsed = JSON.parse(update) as any;
    const freqs = parsed.cpu.freqs;
    this.cpu.pushCpuFreq(freqs)
  }
}



