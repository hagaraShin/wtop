#include <webui.hpp>

#include "main.hpp"
#include "logger.hpp"
#include "meters.hpp"

int main() {
  webui::window window{};

  indexPage(window);
  webui::wait();
  webui::delete_all_profiles();
  webui::clean();

  return 0;
}

void indexPage(webui::window &window) {
  Logger::log(DEBUG, Meters::getAllJson());

  window.set_root_folder("./dist");
  window.bind("get_update", Meters::getAllJsonBindable);

  window.show("index.html");

}
