/*
 * Copyright (c) 2025, Daniel Jackel
 * MIT License, http://opensource.org/licenses/MIT
 */

const uploadButton = document.getElementById("loadfile");
contents = "";
uploadButton.value = "";

uploadButton.addEventListener("change", handleFiles, false);

//var savestate = JSON.parse(localStorage.getItem('midi-mappings'));

var savestate = ["16_78=lcxl_fad02","16_79=lcxl_fad03","16_80=lcxl_fad04","16_81=lcxl_fad05"];

var saved_map = new Map(savestate.map(item => {
  const [key, value] = item.split('=');
  return [key, isNaN(value) ? value : Number(value)]; // Convert numeric values
}));

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
        
        output.innerHTML = "<span id=\"target\"></span>";
        if (!node) {
          target.insertAdjacentHTML("afterend", "No MIDI mappings found in file <code>" + file.name + "</code><br");
        }

        while (node) {
          myObjArr = Array.prototype.slice.call(node.attributes);
          myStrArr = myObjArr.map(function(item){return item.name+'='+item.value})
          nodeText = JSON.stringify(myStrArr)
          
          if (node.parentNode.parentElement.getAttribute("name") != null) {
            title = "[Kit] " + node.parentNode.parentNode.parentNode.parentNode.getAttribute("presetName") + " - " + node.parentNode.parentElement.getAttribute("name");
          }
          else if (node.parentNode.parentElement.getAttribute("presetName") != null) {
            title = "[Synth] " + node.parentNode.parentElement.getAttribute("presetName");
          }
          else if (node.parentNode.parentNode.nodeName == "song") {
            title = "[Global]"
          }
          else {
            title = "[???]"
          }
          
          map = new Map(JSON.parse(nodeText).map(item => {
            const [key, value] = item.split('=');
            return [key, isNaN(value) ? value : Number(value)]; // Convert numeric values
          }));
          ch = map.get("channel") + 1;
          cc = map.get("ccNumber");
          param = map.get("controlsParam");
          
          myKey = ch + "_" + cc;
          if (saved_map.get(myKey)) {
            found_mapping = "<span class='mapping_found'> --> " + saved_map.get(myKey) + "</span>";
          }
           else {
            found_mapping = "<span class='mapping_found'> ???</span>";
           }

          mapping_text = "<code>CH: </code><kbd>" + ch + "</kbd><code> CC: </code><kbd>" + cc + "</kbd>";
          
          target.insertAdjacentHTML("afterend", "<p class='mapping_main'><strong>" + title + ":</strong> <mark>" + param + "</mark></p>" + mapping_text + found_mapping + "<br><hr>");
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