var LANGS = [
  ["en","English"],["es","Spanish"],["fr","French"],["de","German"],
  ["it","Italian"],["pt","Portuguese"],["nl","Dutch"],["ru","Russian"],
  ["ar","Arabic"],["zh","Chinese"],["ja","Japanese"],["ko","Korean"],
  ["hi","Hindi"],["ur","Urdu"],["tr","Turkish"],["pl","Polish"],
  ["sv","Swedish"],["el","Greek"],["he","Hebrew"],["id","Indonesian"]
];

var srcSel = document.getElementById("srcLang");
var tgtSel = document.getElementById("tgtLang");
LANGS.forEach(function(l){
  var o1 = document.createElement("option"); o1.value = l[0]; o1.textContent = l[1];
  var o2 = document.createElement("option"); o2.value = l[0]; o2.textContent = l[1];
  srcSel.appendChild(o1);
  tgtSel.appendChild(o2);
});
srcSel.value = "en";
tgtSel.value = "es";

var srcText = document.getElementById("srcText");
var outputText = document.getElementById("outputText");
var translateBtn = document.getElementById("translateBtn");
var statusLine = document.getElementById("statusLine");
var charCount = document.getElementById("charCount");
var copyBtn = document.getElementById("copyBtn");
var speakSrcBtn = document.getElementById("speakSrcBtn");
var speakTgtBtn = document.getElementById("speakTgtBtn");

srcText.addEventListener("input", function(){
  charCount.textContent = srcText.value.length;
});

document.getElementById("clearBtn").addEventListener("click", function(){
  srcText.value = "";
  charCount.textContent = "0";
  srcText.focus();
});

document.getElementById("swapBtn").addEventListener("click", function(){
  var tmp = srcSel.value;
  srcSel.value = tgtSel.value;
  tgtSel.value = tmp;
});

function setStatus(msg, isError){
  statusLine.textContent = msg || "";
  statusLine.className = "status-line" + (isError ? " error" : "");
}

function setOutput(text, isPlaceholder){
  outputText.textContent = text;
  outputText.className = "output-text" + (isPlaceholder ? " placeholder" : "");
  copyBtn.disabled = !!isPlaceholder;
  speakTgtBtn.disabled = !!isPlaceholder;
}

translateBtn.addEventListener("click", function(){
  var text = srcText.value.trim();
  if(!text){
    setStatus("Type something to translate first.", true);
    return;
  }
  var from = srcSel.value, to = tgtSel.value;
  translateBtn.disabled = true;
  setStatus("Translating…");

  // Free translation API, no key required (rate-limited — swap in
  // Google Translate API / Microsoft Translator here for production use)
  var url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=" + from + "|" + to;

  fetch(url)
    .then(function(r){ return r.json(); })
    .then(function(data){
      translateBtn.disabled = false;
      if(data && data.responseData && data.responseData.translatedText){
        setOutput(data.responseData.translatedText, false);
        setStatus("Done.");
      } else {
        setStatus("Couldn't get a translation. Try again.", true);
      }
    })
    .catch(function(err){
      translateBtn.disabled = false;
      setStatus("Translation request failed — check your connection.", true);
    });
});

copyBtn.addEventListener("click", function(){
  navigator.clipboard.writeText(outputText.textContent).then(function(){
    var original = copyBtn.textContent;
    copyBtn.textContent = "Copied";
    setTimeout(function(){ copyBtn.textContent = original; }, 1200);
  });
});

function speak(text, lang){
  if(!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  var utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  window.speechSynthesis.speak(utter);
}

speakSrcBtn.addEventListener("click", function(){
  if(srcText.value.trim()) speak(srcText.value, srcSel.value);
});
speakTgtBtn.addEventListener("click", function(){
  if(outputText.textContent) speak(outputText.textContent, tgtSel.value);
});