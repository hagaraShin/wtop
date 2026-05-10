#pragma once
#include <iostream>
using std::cout;
using std::endl;
using std::ios;
using std::string;

// Уровни логирования
enum LogLevel { DEBUG, INFO, WARNING, ERROR, CRITICAL };

/// Логгер, который выводит всё в stdout
namespace Logger {
// Логгирует сообщение с уровнем
void log(LogLevel level, const string &message);

}; // namespace Logger
// Converts log level to a string for output
string levelToString(LogLevel level);
