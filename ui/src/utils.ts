import Chart, { CartesianScaleOptions, ChartDataset, ChartTypeRegistry } from "chart.js/auto";

export const colors = ["#fe8019", "#83a598", "#8ec07c", "#d3869b"]

/**
  *Глубокая копия типа с опциональностью всех полей и всех их подполей
  */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

/**
  * Берёт Timestamp и превращает в локальное время
  */
export function formatTime(tickValue: string | number) {
  let value = 0
  if (typeof tickValue == 'string') {
    value = parseInt(tickValue)
  } else {
    value = tickValue
  };
  // У нас время в UTC, так что надо сделать оффсет
  const totalSec = Math.floor(value / 1000) - (new Date()).getTimezoneOffset() * 60;

  // Форматирование
  const h = Math.floor(totalSec % 86400 / 3600)
    .toString()
    .padStart(2, "0");

  const m = Math.floor((totalSec % 3600) / 60)
    .toString()
    .padStart(2, "0");

  const s = (totalSec % 60)
    .toString()
    .padStart(2, "0");

  return `${h}:${m}:${s}`;
}


type Update = {
  cpu: {
    freqs: number[]
    loads: number[]
  },
  mem: {
    ram_total: number,
    ram_avail: number,
    swap_total: number,
    swap_free: number,
  },
  disks: Disk[],
  net: NetSpeed[],
}

export type Disk = {
  path: string,
  total: number,
  free: number,
  avail: number,
}

export type NetSpeed = {
  interface: string,
  upload: number,
  download: number,
}

export async function parsedUpdates(): Promise<Update>{
  const str = await get_update()
  return JSON.parse(str)
}

export function attachGraph(container: HTMLElement,canvas: HTMLElement, category: string, id: string, name: string){
    const h2 = document.createElement('h2')
    const span =  document.createElement('span')
    span.className = `category ${category}`
    span.appendChild(document.createTextNode(category.toLocaleUpperCase()))
    h2.appendChild(span)
    h2.appendChild(document.createTextNode(name))
    const div = document.createElement("div")
    div.id = id
    div.appendChild(canvas)
    container.replaceChildren(h2, div)
}
