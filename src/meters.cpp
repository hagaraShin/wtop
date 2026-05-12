#include "ram_meter.hpp"
#include "meters.hpp"
#include "logger.hpp"
#include <sstream>
namespace Meters {
string getAllJson() {
  std::ostringstream json;
  json << "{";
  // CPU
  json << "\"cpu\": {";
  // Частоты ядер
  json << "\"freqs\": [";
  vector<double> freqs = cpu.getFreqs();
  for (int i = 0; i < freqs.size(); i++) {
    json << freqs[i];
    if (i != freqs.size() - 1)
      json << ',';
  }
  json << "],";
  // Загрузка ядер
  json << "\"loads\": [";
  vector<double> loads = cpu.getLoads();
  for (int i = 0; i < loads.size(); i++) {
    json << loads[i];
    if (i != loads.size() - 1)
      json << ',';
  }
  json << "]";
  json << "},";
  // Конец CPU
  // Ram
  json << "\"mem\": {";
  auto mem_info = RamMeter::getInfo();
  json << "\"ram_total\": " <<mem_info.ram_total << ',';
  json << "\"ram_avail\": " <<mem_info.ram_avail<< ',';
  json << "\"swap_total\": " <<mem_info.swap_total << ',';
  json << "\"swap_free\": " <<mem_info.swap_free;
  json << "}";
  json << "}";
  return json.str();
}
void getAllJsonBindable(webui::window::event *e) {
  string json = getAllJson();
  Logger::log(DEBUG, json);

  e->return_string(json);
}
} // namespace Meters
