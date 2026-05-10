#pragma once

#include <filesystem>
#include <string>
#include <unistd.h>
#include <vector>

using std::string;
using std::vector;
namespace fs = std::filesystem;

class CpuMeter {
public:
  CpuMeter();
  /**
  Получает частоты ядер в MHz
  */
  vector<double> getFreqs();
private:
  int core_count = 1;
  vector<fs::path> core_freq;
  /// Функция, которая ставит {core_count} к количеству ядер в системе
  void getCoreCount();
  /** Функция, которая заполняет список файлов с частотами
  WARNING: {getCoreCount} должна быть выполнена прежде чем эта
  */
  void getFreqFiles();
};
string readfile(const std::filesystem::path &path, const string &fallback);
