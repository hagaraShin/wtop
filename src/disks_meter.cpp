#include "disks_meter.hpp"
#include "logger.hpp"
#include <string>
#include <sys/statvfs.h>
#include <limits>
#include <fstream>

#define max_stream std::numeric_limits<std::streamsize>::max()

std::vector<DiskInfo> DisksMeter::getDisks() {
  std::ifstream fstab("/etc/fstab");
  std::vector<DiskInfo> infos;
  std::string val;
  while (fstab >> val) {
    if (val[0] == '#') {
      fstab.ignore(max_stream, '\n');
      continue;
    }
    DiskInfo info;
    fstab >> info.mount;
    infos.push_back(info);

    fstab.ignore(max_stream, '\n');
  }
  for (auto &info: infos) {
    struct statvfs64 stat;
    statvfs64(info.mount.c_str(), &stat);
    info.total = stat.f_frsize * stat.f_blocks / 1024 / 1024;
    info.free = stat.f_frsize * stat.f_bfree / 1024 / 1024;
    info.avail = stat.f_frsize * stat.f_bavail / 1024 / 1024;
  }
  return infos;
}
