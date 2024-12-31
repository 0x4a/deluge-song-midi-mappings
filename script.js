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
        output.innerText = "";
        while (node) {
          myObjArr = Array.prototype.slice.call(node.attributes);
          myStrArr = myObjArr.map(function(item){return item.name+'='+item.value})
          nodeText = JSON.stringify(myStrArr)
          
          if(node.parentNode.parentElement.getAttribute("name") != null) {
            nodeParent = "[KIT] " + node.parentNode.parentElement.getAttribute("name");
          }
          else
          {
            nodeParent = "[SYNTH] " + node.parentNode.parentElement.getAttribute("presetName");
          }

          output.insertAdjacentHTML("afterend", "<strong>" + nodeParent + ":</strong> " + nodeText + "<br><br>"); 
          //output.append("<strong>" + nodeParent + ":</strong> " + nodeText + "<br><br>"); 
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