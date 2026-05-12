#pragma once

#include "net_meter.hpp"
#include "cpu_meter.hpp"
#include <webui.hpp>
namespace Meters {
  static CpuMeter cpu;
  static NetMeter net;
  string getAllJson();
  void getAllJsonBindable(webui::window::event *e);
}
