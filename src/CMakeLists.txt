AUX_SOURCE_DIRECTORY(. SOURCES)

add_executable(wtop ${SOURCES})


add_library(webui-2 STATIC IMPORTED GLOBAL)

set_target_properties(webui-2 PROPERTIES
    IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/webui/dist/libwebui-2-static.a
    INTERFACE_INCLUDE_DIRECTORIES ${CMAKE_SOURCE_DIR}/webui/include
)

target_link_libraries(wtop webui-2)
add_custom_target(frontend
    COMMAND npm install
    COMMAND npm run build
    COMMAND ${CMAKE_COMMAND} -E copy_directory
        ${CMAKE_SOURCE_DIR}/ui/dist
        ${CMAKE_BINARY_DIR}/share/wtop/dist
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/ui
    BYPRODUCTS ${CMAKE_SOURCE_DIR}/ui/dist)

add_dependencies(wtop frontend)

install(TARGETS wtop)
install(DIRECTORY ${CMAKE_SOURCE_DIR}/ui/dist/
    DESTINATION share/wtop/dist
)
