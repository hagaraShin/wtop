#include "net_meter.hpp"
#include <unordered_set>
#include <fstream>

std::vector<Speeds> NetMeter::getSpeed() {

  std::unordered_set<std::string> set;
  std::vector<Speeds> speeds;
  ifaddrs *addrs;

  getifaddrs(&addrs);
  ifaddrs *cur = addrs;
  while (cur != NULL) {
    if (set.find(cur->ifa_name) != set.end()) {
      cur = cur->ifa_next;
      continue;
    };
    Speeds speed;
    speed.interface = cur->ifa_name;
    speeds.push_back(speed);
    set.insert(speed.interface);
    cur = cur->ifa_next;
  }
  freeifaddrs(addrs);
  auto now = time(NULL);

  for (auto &speed : speeds) {

    unsigned long long rx;
    {
      std::ifstream file("/sys/class/net/" + speed.interface +
                         "/statistics/rx_bytes");
      file >> rx;
    }

    unsigned long long tx;
    {
      std::ifstream file("/sys/class/net/" + speed.interface +
                         "/statistics/tx_bytes");
      file >> tx;
    }

    auto prev_rx_node = this->last_rx.find(speed.interface);
    if (prev_rx_node == last_rx.end()) {
      this->last_rx.insert_or_assign(speed.interface, rx);
      speed.download = 0;
    } else {
      auto prev_rx = prev_rx_node->second;
      auto delta_rx = rx - prev_rx;
      speed.download = (double)delta_rx / (now - this->last_time);
    }

    auto prev_tx_node = this->last_tx.find(speed.interface);
    if (prev_tx_node == last_tx.end()) {
      this->last_tx.insert_or_assign(speed.interface, tx);
      speed.upload = 0;
    } else {
      auto prev_tx = prev_tx_node->second;
      auto delta_tx = tx - prev_tx;
      speed.upload = (double)delta_tx / (now - this->last_time);
    }
  }
  return speeds;
}
