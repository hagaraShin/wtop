#include <stdio.h>
#include <webui.hpp>

#include "main.hpp"

void button_click(webui::window::event *e) { printf("Button clicked!\n"); }

int main() {
  webui::window window{};

  indexPage(window);
  webui::wait();
  webui::delete_all_profiles();
  webui::clean();

  return 0;
}

void indexPage(webui::window &window) {
  window.bind("my_button", button_click);

  window.show("<html>"
              "<head>"
              "<script src=\"webui.js\"></script>"
              "</head>"
              "<body>"
              "<h1>Hello from C++</h1>"
              "</body>"
              "</html>");

}
