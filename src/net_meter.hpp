#include "logger.hpp"
#include <ctime>
#include <fstream>
#include <ifaddrs.h>
#include <map>
#include <string>
#include <vector>

typedef struct {
  std::string interface;
  double download, upload;
} Speeds;

class NetMeter {
public:
  NetMeter() { this->last_time = time(NULL); }
  std::vector<Speeds> getSpeed(); 

private:
  std::map<std::string, unsigned long long> last_rx;
  std::map<std::string, unsigned long long> last_tx;
  unsigned long long last_time;
};
