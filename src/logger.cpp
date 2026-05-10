#include <ctime>
#include <iostream>
#include <sstream>
#include "logger.hpp"
using std::cout;
using std::endl;
using std::ios;
using std::string;

namespace Logger {
void log(LogLevel level, const string &message) {
  time_t now = time(0);
  tm *timeinfo = localtime(&now);
  char timestamp[20];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%d %H:%M:%S", timeinfo);

  std::ostringstream logEntry;
  logEntry << "[" << timestamp << "] " << levelToString(level) << ": "
           << message << endl;

  cout << logEntry.str();
}

}; // namespace Logger
string levelToString(LogLevel level) {
  switch (level) {
  case DEBUG:
    return "DEBUG";
  case INFO:
    return "INFO";
  case WARNING:
    return "WARNING";
  case ERROR:
    return "ERROR";
  case CRITICAL:
    return "CRITICAL";
  default:
    return "UNKNOWN";
  }
}
