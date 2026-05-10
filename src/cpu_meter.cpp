#pragma once

#include "cpu_meter.hpp"
#include "logger.hpp"
#include <exception>
#include <fstream>
#include <string>

CpuMeter::CpuMeter() {
  getCoreCount();
  getFreqFiles();
}

vector<double> CpuMeter::getFreqs() {
  vector<double> freqs;
  for (auto file : core_freq) {
    double freq = std::stod(readfile(file, "0.0")) / 1000;
    freqs.push_back(freq);
  }
  return freqs;
};

void CpuMeter::getFreqFiles() {
  for (int i = 0; i < core_count; ++i) {
    core_freq.push_back("/sys/devices/system/cpu/cpufreq/policy" +
                        std::to_string(i) + "/scaling_cur_freq");
    if (not fs::exists(core_freq.back()) or
        access(core_freq.back().c_str(), R_OK) == -1) {
      core_freq.pop_back();
    }
  }
}

void CpuMeter::getCoreCount() { core_count = sysconf(_SC_NPROCESSORS_ONLN); }

string readfile(const std::filesystem::path &path, const string &fallback) {
  if (not fs::exists(path))
    return fallback;
  string out;
  try {
    std::ifstream file(path);
    for (string readstr; getline(file, readstr); out += readstr) ;
  } catch (const std::exception &e) {
    Logger::log(LogLevel::ERROR, e.what());
    return fallback;
  }
  return (out.empty() ? fallback : out);
}
