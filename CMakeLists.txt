cmake_minimum_required(VERSION 3.16)

project(wtop)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

add_subdirectory(./src)
file(GLOB "${CMAKE_SOURCE_DIR}/webui/src" webui_sources)

add_custom_command(OUTPUT ${CMAKE_BINARY_DIR}/webui/dist/libwebui-2-static.a
    COMMAND make
    DEPENDS ${CMAKE_SOURCE_DIR}/webui/src
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/webui
)
set(WEBUI_STAMP "${CMAKE_BINARY_DIR}/.built")

add_custom_command(
    OUTPUT ${WEBUI_STAMP}
    COMMAND make
    COMMAND ${CMAKE_COMMAND} -E touch ${WEBUI_STAMP}
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/webui
    DEPENDS ${CMAKE_SOURCE_DIR}/webui/Makefile
    DEPENDS ${webui_sources}
)

add_custom_target(webui_build DEPENDS ${WEBUI_STAMP})

add_dependencies(wtop webui_build)

install(FILES assets/wtop.desktop
    DESTINATION share/applications
)

