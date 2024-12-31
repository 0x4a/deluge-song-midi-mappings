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
      contents = reader.result;

      var doc = new DOMParser();
      var xmlstring = doc.parseFromString(contents, "text/xml");
      const result = xmlstring.evaluate('//midiKnob', xmlstring, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    
      try {
        let node = result.iterateNext();
        while (node) {
          console.log("node", node);

          output.append(JSON.stringify(node));

          node = result.iterateNext();
        }
      } catch (e) {
        console.error(`Document tree modified during iteration: ${e}`);
      }
    },
    false,
  );

  console.log("loading file: " + file.name + "\ntype: " + file.type);
  reader.readAsText(file);

}

