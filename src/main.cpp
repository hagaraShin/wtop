#include <webui.hpp>
#include "main.hpp"
#include "logger.hpp"
#include "meters.hpp"

int main(int argc, char **argv) {
  webui::window window{};
  std::filesystem::path prefix =
    std::filesystem::canonical("/proc/self/exe").parent_path().parent_path();  

  indexPage(window, prefix/"share"/"wtop"/"dist");
  webui::wait();
  webui::delete_all_profiles();
  webui::clean();

  return 0;
}

void indexPage(webui::window &window, std::filesystem::path root) {

  Logger::log(INFO, "Запускаемся из папки: " + (root/"index.html").string());
  window.set_root_folder((root).string());
  window.bind("get_update", Meters::getAllJsonBindable);

  window.show("index.html");

}
