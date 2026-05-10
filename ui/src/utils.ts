import Chart, { CartesianScaleOptions, ChartDataset, ChartTypeRegistry } from "chart.js/auto";

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


/**
  * Функция, чтобы созать новый график с типом линия.
  * TODO: Разобраться, почему LSP ругается на yScale. Не похоже, чтобы проблема была.
  */
export function createChart<T>(canvas: HTMLCanvasElement, labels: number[],
  datasets: ChartDataset<"line", T>[],
  yScale: DeepPartial<CartesianScaleOptions>): Chart<keyof ChartTypeRegistry, T> {
  const now = (new Date()).getTime()
  const chart = new Chart(
    canvas,
    {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              title(items) {
                return formatTime(items[0].parsed.x!)
              }
            }
          }
        },
        scales: {
          x: {
            type: "linear",
            max: now,
            min: now - 60000,
            ticks: {
              stepSize: 1000,
              callback: formatTime
            }
          },
          y: yScale as any,
        }
      }
    }
  );
  return chart
}

type Update = {
  cpu: {
    freqs: number[]
  }
}

export async function parsedUpdates(): Promise<Update>{
  const str = await get_update()
  return JSON.parse(str)
}
