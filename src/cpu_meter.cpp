#pragma once

#include "cpu_meter.hpp"
#include "logger.hpp"
#include <exception>
#include <fstream>
#include <iterator>
#include <numeric>
#include <sstream>
#include <string>
#include <string_view>

CpuMeter::CpuMeter() {
  getCoreCount();
  getFreqFiles();
}

auto mhz = "cpu MHz";

vector<double> CpuMeter::getLoads() {
  static vector<uint64_t> last_totals;
  vector<uint64_t> totals;
  static vector<uint64_t> last_idles;
  vector<uint64_t> idles;
  vector<double> loads;
  std::ifstream proc;
  proc.open("/proc/stat");
  string line;

  while (std::getline(proc, line) && line.compare(0, 3, "cpu") == 0) {
    vector<uint64_t> vals;
    std::stringstream ss(line);

    std::string cpu;
    ss >> cpu;

    uint64_t v = 0, total = 0, idle = 0;
    while (ss >> v) {
      total += v;
      vals.push_back(v);
    }
    if (vals.size() > 8) {
      for (int i = 8; i < vals.size(); i++) {
        total -= vals[i];
      }
    }

    if (vals.size() > 4)
      idle = vals[3] + vals[4];

    totals.push_back(total);
    idles.push_back(idle);
  }

  if (last_totals.size() == 0) {
    for (int i = 0; i < core_count; i++) {
      loads.push_back(0);
    }
    for (auto total : totals) {
      last_totals.push_back(total);
    }
    for (auto idle : idles) {
      last_idles.push_back(idle);
    }
    return loads;
  }
  for (int i = 0; i < totals.size(); i++) {
    double calc_totals = totals[i] - last_totals[i];
    double calc_idles = idles[i] - last_idles[i];
    loads.push_back((calc_totals - calc_idles) * 100 / calc_totals);
  }

  last_totals.resize(0);
  for (auto total : totals) {
    last_totals.push_back(total);
  }
  last_idles.resize(0);
  for (auto idle : idles) {
    last_idles.push_back(idle);
  }
  return loads;
}

vector<double> CpuMeter::getFreqs() {
  vector<double> freqs;
  if (core_freq.empty()) {
    std::ifstream proc{"/proc/cpuinfo"};
    std::string line;
    while (std::getline(proc, line)) {
      if (line.compare(0, 7, mhz) == 0) {
        std::cout << line << std::endl;
        int start = 0;
        int end = 0;
        for (char ch : line) {
          if (ch >= '0' && ch <= '9')
            break;
          start++;
        }
        line = line.erase(0, start);
        for (char ch : line) {
          if ((ch < '0' || ch > '9') && ch != '.')
            break;
          end++;
        }
        line = line.erase(end);
        std::cout << line << std::endl;
        freqs.push_back(stod(line));
      }
    }
    return freqs;
  }
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
    for (string readstr; getline(file, readstr); out += readstr)
      ;
  } catch (const std::exception &e) {
    Logger::log(LogLevel::ERROR, e.what());
    return fallback;
  }
  return (out.empty() ? fallback : out);
}
