cmake_minimum_required(VERSION 3.16)

project(wtop)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

add_subdirectory(src)

add_custom_target(
    build_webui
    COMMAND make
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/webui
)

add_dependencies(app build_webui)

add_custom_target(frontend_build ALL
    COMMAND npm install
    COMMAND npm run build
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/ui
)
add_custom_command(TARGET frontend_build POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
        ${CMAKE_SOURCE_DIR}/ui/dist
        ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/dist
)
add_dependencies(app frontend_build)
