#include "meters.hpp"
#include <sstream>
namespace Meters {
  string getAllJson() {
    std::ostringstream json;
    json <<"{";
    json << "\"cpu\": {";
    json << "\"freqs\": [";
    vector<double> freqs = cpu.getFreqs();
    for (int i = 0; i < freqs.size(); i++) {
      json << freqs[i];
      if(i != freqs.size() - 1) json << ',';
    }
    json << ']';
    json <<"}";
    json <<"}";
    return json.str();
  }
  void getAllJsonBindable(webui::window::event *e){
    e->return_string(getAllJson());
  }
}
