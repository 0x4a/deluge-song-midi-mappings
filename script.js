/*
 * Copyright (c) 2025, Daniel Jackel
 * MIT License, http://opensource.org/licenses/MIT
 */

const uploadButton = document.getElementById("loadfile");
contents = "";
uploadButton.value = "";
uploadButton.addEventListener("change", handleFiles, false);

//var savestate = JSON.parse(localStorage.getItem('midi-mappings'));

var savestate = [
  "16_14=lcxl_T2Pot1","16_30=lcxl_T2Pot2","16_50=lcxl_T2Pot3","16_78=lcxl_T2Fader",
  "16_15=lcxl_T3Pot1","16_31=lcxl_T3Pot2","16_51=lcxl_T3Pot3","16_79=lcxl_T3Fader",
  "16_16=lcxl_T4Pot1","16_32=lcxl_T4Pot2","16_52=lcxl_T4Pot3","16_80=lcxl_T4Fader",
  "16_17=lcxl_T5Pot1","16_33=lcxl_T5Pot2","16_53=lcxl_T5Pot3","16_81=lcxl_T5Fader",
  "16_18=lcxl_T6Pot1","16_34=lcxl_T6Pot2","16_54=lcxl_T6Pot3","16_82=lcxl_T6Fader",
  "16_19=lcxl_T7Pot1","16_35=lcxl_T7Pot2","16_55=lcxl_T7Pot3","16_83=lcxl_T7Fader",
  "16_20=lcxl_T8Pot1","16_36=lcxl_T8Pot2","16_56=lcxl_T8Pot3","16_84=lcxl_T8Fader"
  ];

var saved_map = new Map(savestate.map(item => {
  const [key, value] = item.split('=');
  return [key, isNaN(value) ? value : Number(value)]; // Convert numeric values
}));

function handleFiles() {
  var file = this.files[0];

  // no valid file
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

        // empty output of loaded file if exists
        if (typeof loaded_file !== 'undefined') {
          loaded_file.innerHTML = "";
        }

        // output loaded file
        the_button.insertAdjacentHTML("afterend", "<span id='loaded_file'>loaded file: <em>" + file.name + "</em></span>");

        // empty main output
        output.innerHTML = "<span id=\"target\"></span>";

        // no mapping found error
        if (!node) {
          target.insertAdjacentHTML("afterend", "No MIDI mappings found!<br>");
        }

        // iterate nodes
        while (node) {
          myObjArr = Array.prototype.slice.call(node.attributes);
          myStrArr = myObjArr.map(function(item){return item.name+'='+item.value})
          nodeText = JSON.stringify(myStrArr)
          
          // decide instrument type
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
          
          // map over node contents
          map = new Map(JSON.parse(nodeText).map(item => {
            const [key, value] = item.split('=');
            return [key, isNaN(value) ? value : Number(value)]; // Convert numeric values
          }));

          // get needed parameters
          ch = map.get("channel") + 1;
          cc = map.get("ccNumber");
          param = map.get("controlsParam");
          mapping_text = "<code>CH: </code><kbd>" + ch + "</kbd><code> CC: </code><kbd>" + cc + "</kbd>";
          
          // search saved mappings
          myKey = ch + "_" + cc;
          if (saved_map.get(myKey)) {
            found_mapping = "<span class='mapping_found'>--> " + saved_map.get(myKey) + "</span>";
          }
          else {
            found_mapping = "<span class='mapping_found'>???</span>";
          }
          
          // output instrument mapping
          target.insertAdjacentHTML("afterend", "<p class='mapping_main'><strong>" + title + ":</strong> <mark>" + param + "</mark></p>" + mapping_text + found_mapping + "<br><hr>");
          node = result.iterateNext();
        }
      } catch (e) {
        console.error(`Document tree modified during iteration: ${e}`);
      }
      // todo: sort elements
    },
    false,
  );
  console.log("loading file: " + file.name + "\ntype: " + file.type);
  reader.readAsText(file);
}