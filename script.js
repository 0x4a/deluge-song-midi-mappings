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
          
          if (node.parentNode.parentElement.getAttribute("name") != null) {
            nodeParent = "[Kit] " + node.parentNode.parentElement.getAttribute("name");
          }
          else if (node.parentNode.parentElement.getAttribute("presetName") != null) {
            nodeParent = "[Synth] " + node.parentNode.parentElement.getAttribute("presetName");
          }
          else if (node.parentNode.parentNode.nodeName == "song") {
            nodeParent = "[Global]"
          }
          else {
            nodeParent = "[???]"
          }

          
          map = new Map(JSON.parse(nodeText).map(item => {
            const [key, value] = item.split('=');
            return [key, isNaN(value) ? value : Number(value)]; // Convert numeric values
          }));
          ch = map.get("channel");
          cc = map.get("ccNumber");
          
          myKey = ch + "_" + cc
          // console.log("tpl: " + saved_map.get("16_78"));
          console.log("ch = " + ch + " cc = " + cc);
          
          mapping = "<code>CH: </code><kbd>" + ch + "</kbd><code> CC: </code><kbd>" + cc + "</kbd>"

          output.insertAdjacentHTML("afterend", "<strong>" + nodeParent + ":</strong><br>" + mapping + "<br><br>");
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