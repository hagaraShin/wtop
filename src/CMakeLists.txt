AUX_SOURCE_DIRECTORY(. SOURCES)

add_executable(app ${SOURCES})

add_library(webui-2 STATIC IMPORTED GLOBAL)

set_target_properties(webui-2 PROPERTIES
    IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/webui/dist/libwebui-2-static.a
    INTERFACE_INCLUDE_DIRECTORIES ${CMAKE_SOURCE_DIR}/include
)

set_target_properties(app PROPERTIES
    BUILD_RPATH "$ORIGIN"
)

target_link_libraries(app webui-2)
