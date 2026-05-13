#pragma once
#include "logger.hpp"
#include <vector>
typedef struct {
  string mount;
  unsigned long long total, free, avail;
} DiskInfo;
namespace DisksMeter {
  std::vector<DiskInfo> getDisks();
};
