#pragma once

#include "cpu_meter.hpp"
#include <webui.hpp>
namespace Meters {
  static CpuMeter cpu;
  string getAllJson();
  void getAllJsonBindable(webui::window::event *e);
}
