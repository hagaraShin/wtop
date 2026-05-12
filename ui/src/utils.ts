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
  }
}

export async function parsedUpdates(): Promise<Update>{
  const str = await get_update()
  return JSON.parse(str)
}
