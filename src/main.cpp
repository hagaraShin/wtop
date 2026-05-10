#include <iostream>
#include <sstream>
#include <string>
#include <webui.hpp>

#include "main.hpp"
#include "logger.hpp"
#include "meters.hpp"

int main(int argc, char **argv) {
  webui::window window{};
  std::string k = argv[0];
  int last = k.find_last_of('/');
  std::ostringstream os;
  os << k.substr(0, last) << "/dist";
  std::cout <<os.str();
  indexPage(window, os.str());
  webui::wait();
  webui::delete_all_profiles();
  webui::clean();

  return 0;
}

void indexPage(webui::window &window, string root) {
  Logger::log(DEBUG, Meters::getAllJson());

  window.set_root_folder(root);
  window.bind("get_update", Meters::getAllJsonBindable);

  window.show("index.html");

}
