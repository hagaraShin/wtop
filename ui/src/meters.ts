import { CartesianScaleOptions, CartesianScaleTypeRegistry, Chart, ChartDataset, ChartTypeRegistry, DatasetChartOptions, Point, ScaleOptionsByType } from "chart.js/auto"
import { CpuFreqMeter } from "./freq";
import { parsedUpdates } from "./utils";
import { CpuLoadMeter } from "./loads";
import { RamMeter } from "./ram";



export class Meters {
  cpu: CpuFreqMeter = new CpuFreqMeter()
  load: CpuLoadMeter = new CpuLoadMeter()
  mem: RamMeter = new RamMeter()
  async update() {
    const now = new Date()
    const parsed = await parsedUpdates();
    const freqs = parsed.cpu.freqs;
    this.cpu.pushCpuFreq(freqs, now)
    const loads = parsed.cpu.loads;
    this.load.pushCpuLoads(loads, now)
    const mem = parsed.mem;
    this.mem.pushRam(mem.ram_total, mem.ram_avail)
  }
}



