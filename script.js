/*
 * Copyright (c) 2025, Daniel Jackel
 * MIT License, http://opensource.org/licenses/MIT
 */

const uploadButton = document.getElementById("loadfile");
contents = "";
uploadButton.value = "";

uploadButton.addEventListener("change", handleFiles, false);

function handleFiles() {
  var file = this.files[0];

  if (!file.type.endsWith("xml")) {
    alert("not an XML file");
    this.value = "";
    return;
  }
 
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    () => {
      // this will then display a text file
      output.innerText = "<h2>file has been loaded</h2>";
    },
    false,
  );

  reader.readAsText(file);

  alert("loaded: " + file.name + "\ntype: " + file.type);

  contents = reader.result;

  var doc = new DOMParser();
  var xmlstring = doc.parseFromString(contents, "text/xml");
  const result = xmlstring.evaluate('//midiKnob', xmlstring, null, 6, null);
  console.log(result);

  output.innerText = result;

}

