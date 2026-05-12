#include "meters.hpp"
#include "disks_meter.hpp"
#include "logger.hpp"
#include "ram_meter.hpp"
#include <exception>
#include <sstream>

namespace Meters {
string getAllJson() {
  std::ostringstream json;
  json << "{";

  // CPU
  json << "\"cpu\": {";

  { // Частоты ядер
    json << "\"freqs\": [";
    vector<double> freqs = cpu.getFreqs();
    for (int i = 0; i < freqs.size(); i++) {
      json << freqs[i];
      if (i != freqs.size() - 1)
        json << ',';
    }
    json << "],";
  }

  { // Загрузка ядер
    json << "\"loads\": [";
    vector<double> loads = cpu.getLoads();
    for (int i = 0; i < loads.size(); i++) {
      json << loads[i];
      if (i != loads.size() - 1)
        json << ',';
    }
    json << "]";
    json << "},";
  }
  // Конец CPU

  { // Ram
    json << "\"mem\": {";
    auto mem_info = RamMeter::getInfo();
    json << "\"ram_total\": " << mem_info.ram_total << ',';
    json << "\"ram_avail\": " << mem_info.ram_avail << ',';
    json << "\"swap_total\": " << mem_info.swap_total << ',';
    json << "\"swap_free\": " << mem_info.swap_free;
    json << "},";
  } // Конец RAM

  { // Диски
    json << "\"disks\": [";
    vector<DiskInfo> disks = DisksMeter::getDisks();
    for (int i = 0; i < disks.size(); i++) {
      json << '{';
      json << "\"path\":\"" << disks[i].mount << "\",";
      json << "\"total\":" << disks[i].total << ",";
      json << "\"free\":" << disks[i].free << ",";
      json << "\"avail\":" << disks[i].avail;
      json << '}';
      if (i != disks.size() - 1)
        json << ',';
    }
    json << "],";

  } // Конец дисков
  { // Сеть

    json << "\"net\": [";
    vector<Speeds> nets = net.getSpeed();
    for (int i = 0; i < nets.size(); i++) {
      json << '{';
      json << "\"interface\":\"" << nets[i].interface << "\",";
      json << "\"download\":" << nets[i].download << ",";
      json << "\"upload\":" << nets[i].upload;
      json << '}';
      if (i != nets.size() - 1)
        json << ',';
    }
    json << "]";
  } // Конец сети

  json << "}";
  return json.str();
}
void getAllJsonBindable(webui::window::event *e) {

  string json;
  try {
    json = getAllJson();
  } catch (std::exception e) {
    Logger::log(ERROR, e.what());
    return;
  }

  e->return_string(json);
}
} // namespace Meters
