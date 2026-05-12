#include "ram_meter.hpp"

MemInfo RamMeter::getInfo() {
    MemInfo info = {0};

    ifstream meminfo("/proc/meminfo");
    if (meminfo.good()) {
      for (string label; meminfo.peek() != 'D' and meminfo >> label;) {
        if (label == "MemAvailable:") {
          meminfo >> info.ram_avail;
        } else if (label == "MemTotal:") {
          meminfo >> info.ram_total;
        } else if (label == "SwapTotal:") {
          meminfo >> info.swap_total;
        } else if (label == "SwapFree:") {
          meminfo >> info.swap_free;
        }
        meminfo.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
      }
    }
    return info;
  }
