import { Meters } from "./meters";

let meters = new Meters()

let frqs_cont = document.getElementById("freqs")! as HTMLDivElement;
meters.cpu.attach(frqs_cont)

setInterval(async () => {
  await meters.update()
}, 1000)
