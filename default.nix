with import <nixpkgs> {};

mkShell {
  buildInputs = [
    cmake
  ];
  packages = [
    xdg-utils
    firefox
    procps
  ];
}
