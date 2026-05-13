AUX_SOURCE_DIRECTORY(. SOURCES)

add_executable(wtop ${SOURCES})


add_library(webui-2 STATIC IMPORTED GLOBAL)

file(GLOB "${CMAKE_SOURCE_DIR}/ui/src/*" ts_sources)

set_target_properties(webui-2 PROPERTIES
    IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/webui/dist/libwebui-2-static.a
    INTERFACE_INCLUDE_DIRECTORIES ${CMAKE_SOURCE_DIR}/webui/include
)

target_link_libraries(wtop webui-2)
set(UI_DIST "${CMAKE_BINARY_DIR}/share/wtop/dist")
set(UI_STAMP "${UI_DIST}/.built")

add_custom_command(
    OUTPUT ${UI_STAMP}
    COMMAND npm install
    COMMAND npm run build
    COMMAND ${CMAKE_COMMAND} -E rm -rf ${UI_DIST}
    COMMAND ${CMAKE_COMMAND} -E copy_directory
        ${CMAKE_SOURCE_DIR}/ui/dist
        ${UI_DIST}
    COMMAND ${CMAKE_COMMAND} -E touch ${UI_STAMP}
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/ui
    DEPENDS ${CMAKE_SOURCE_DIR}/ui/package.json
    DEPENDS ${ts_sources}
)

add_custom_target(ui_build DEPENDS ${UI_STAMP})

add_dependencies(wtop ui_build)

install(TARGETS wtop)
install(DIRECTORY ${CMAKE_SOURCE_DIR}/ui/dist/
    DESTINATION share/wtop/dist
)
