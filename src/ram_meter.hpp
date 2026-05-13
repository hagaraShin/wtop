#pragma once
#include <fstream>

using std::ifstream;
using std::string;

typedef struct {
  unsigned long long ram_total, ram_avail, swap_total, swap_free;
} MemInfo;

class RamMeter {
public:
  static MemInfo getInfo(); 
};
