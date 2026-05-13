import Chart from "chart.js/auto";
import { Meters } from "./meters";

Chart.defaults.color = "#fbf1c7"
Chart.defaults.borderColor = "#fbf1c7"
let meters = new Meters()

meters.attachAll()

setInterval(async () => {
  await meters.update()
}, 1000)
