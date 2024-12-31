/*
 * Copyright (c) 2025, Daniel Jackel
 * MIT License, http://opensource.org/licenses/MIT
 */

const uploadButton = document.getElementById("loadfile");

uploadButton.value = "";

uploadButton.addEventListener("change", handleFiles, false);

function handleFiles(object) {
  var file = this.files[0];

  if (!file.type.endsWith("xml")) {
    alert("not an XML file");
    this.value = "";
    return;
  }

  alert("loaded: " + file.name + "\ntype: " + file.type);
}

