import { CpuFreqMeter } from "./freq";
import { parsedUpdates } from "./utils";
import { CpuLoadMeter } from "./loads";
import { RamMeter } from "./ram";
import { SwapMeter } from "./swap";
import { DisksMeter } from "./rom";
import { NetMeter } from "./net";


export interface Meter {
  attach(container: HTMLElement): void
}

type MeterRecord = {
  category: string,
  name: string,
  meter: Meter,
}


export class Meters {
  cpu = new CpuFreqMeter()
  load = new CpuLoadMeter()
  mem = new RamMeter()
  swap = new SwapMeter()
  disks = new DisksMeter()
  network = new NetMeter()
  meters: MeterRecord[] = [{
    category: "cpu",
    name: "Частота",
    meter: this.cpu,
  },
  {
    category: "cpu",
    name: "Загрузка",
    meter: this.load,
  },
  {
    category: "mem",
    name: "Оперативная память",
    meter: this.mem,
  },
  {
    category: "mem",
    name: "swap",
    meter: this.swap,
  },
  {
    category: "rom",
    name: "Разделы",
    meter: this.disks,
  },
  {
    category: "net",
    name: "Трафик",
    meter: this.network,
  },
  ]
  config: Meter[] = [this.cpu, this.load, this.mem, this.swap]
  async update() {
    const parsed = await parsedUpdates();
    const freqs = parsed.cpu.freqs;
    this.cpu.pushCpuFreq(freqs)
    const loads = parsed.cpu.loads;
    this.load.pushCpuLoads(loads)
    const mem = parsed.mem;
    this.mem.pushRam(mem.ram_total, mem.ram_avail)
    this.swap.pushSwap(mem.swap_total, mem.swap_free)
    const disks = parsed.disks
    this.disks.pushDisks(disks)
    const speeds = parsed.net
    this.network.pushSpeeds(speeds)
  }

  attachAll() {
    console.log(this.config)
    const sections = document.getElementsByTagName("section")
    for (let i = 0; i < sections.length; i++) {
      const item = sections.item(i)!
      this.config[parseInt(item.dataset.section!)-1].attach(item)
      sections.item(i)?.addEventListener('click', ()=>this.chooseMeters(parseInt(item.dataset.section!)-1))
    }
  }

  unhideMeters() {
    const nav = document.getElementsByTagName('nav').item(0)!;
    nav.classList.add("hidden")

    const main = document.getElementsByTagName("main").item(0)!;
    main.classList.remove("hidden")
  }

  meterButton(category: string, name: string, meter: Meter, index: number): HTMLElement {
    const full = document.createElement("h2")
    full.classList.add(category)
    const cat = document.createElement("span")
    cat.className = `category ${category}`
    cat.textContent = category.toLocaleUpperCase()
    full.replaceChildren(cat, document.createTextNode(name))
    full.addEventListener('click', () => {
      for(let i = 0; i<this.config.length; i++) {
        if(this.config[i] == meter) this.config[i] = this.config[index]

      }
      this.config[index] = meter
      this.unhideMeters()
      this.attachAll()
    })
    return full;
  }

  chooseMeters(index: number) {
    console.log(this.meters)
    const nav = document.getElementsByTagName('nav').item(0)!;
    nav.innerHTML = ""
    for (let i = 0; i < this.meters.length; i++) {
      const rec = this.meters[i]
      nav.appendChild(this.meterButton(rec.category, rec.name, rec.meter, index))
    }
    nav.classList.remove("hidden")

    const main = document.getElementsByTagName("main").item(0)!;
    main.classList.add("hidden")
  }
}



