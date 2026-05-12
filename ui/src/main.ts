import Chart from "chart.js/auto";
import { Meters } from "./meters";

Chart.defaults.color = "#fbf1c7"
Chart.defaults.borderColor = "#fbf1c7"
let meters = new Meters()

let frqs_cont = document.getElementById("freqs")! as HTMLDivElement;
meters.cpu.attach(frqs_cont)
let loads_cont = document.getElementById("loads")! as HTMLDivElement;
meters.load.attach(loads_cont)
let ram_cont = document.getElementById("ram")! as HTMLDivElement;
meters.mem.attach(ram_cont)

setInterval(async () => {
  await meters.update()
}, 1000)
