cmake_minimum_required(VERSION 3.16)

project(wtop)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

add_subdirectory(./src)

add_custom_target(
    build_webui
    COMMAND make
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/webui
)

add_dependencies(wtop build_webui)

install(FILES assets/wtop.desktop
    DESTINATION share/applications
)

