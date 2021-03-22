


window.addEventListener("load", main, false);

var div = document.createElement('div');

function main(e) {

  console.log("main");

  var inputKifu = localStorage.getItem("inputKifu");

  console.log(location);
  checkKifyPage();
  setTimeout(() => {
    // github pages のほうで棋譜の解析ができるまで少し待ってから実行
    checkKifyGuide();
  }, 500);
};

// kifyGuide のページだったら棋譜読みちゃんへの移動用ボタンを設置する
function checkKifyGuide(){
  if(location.host != 'biss-git.github.io' && location.hostname != 'localhost'){
    // localhost も含めているのはテスト用。
    return;
  }
  console.log('my git page');
  var button1 = document.getElementById("kif-play-1");
  button1.addEventListener('click', (e) => {
    playButtonClkick();
  }, false);
  var button2 = document.getElementById("kif-play-2");
  button2.addEventListener('click', (e) => {
    playButtonClkick();
  }, false);
}

function playButtonClkick(){
  console.log('clicked');
  this.kifu = localStorage.getItem('kifu');
  this.setNumber = localStorage.getItem("kify_setting_now_set_number");
  this.voiceNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_1");
  this.komaotoNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_2");
  this.playSpeedNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_3");
  this.backNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_5");
  this.senteIconNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_6");
  this.goteIconNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_7");
  this.komaNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_8");
  this.banNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_9");
  this.komadaiNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_11");
  this.mochiNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_12");
  this.markerNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_13");
  this.playButtonNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_14");
  this.selectionNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_16");
  this.logoNumber = localStorage.getItem("kify_setting_" + this.setNumber + "_17");
  console.log(this.kifu);
  console.log(this.setNumber);
  console.log(this.voiceNumber);
  console.log(this.komaotoNumber);
  console.log(this.playSpeedNumber);
  console.log(this.backNumber);
  console.log(this.senteIconNumber);
  console.log(this.goteIconNumber);
  console.log(this.komaNumber);
  console.log(this.banNumber);
  console.log(this.komadaiNumber);
  console.log(this.mochiNumber);
  console.log(this.markerNumber);
  console.log(this.playButtonNumber);
  console.log(this.selectionNumber);
  console.log(this.logoNumber);
  chrome.storage.local.set({'kifu': this.kifu});
  chrome.storage.local.set({'voiceNumber': this.voiceNumber});
  chrome.storage.local.set({'komaotoNumber': this.komaotoNumber});
  chrome.storage.local.set({'playSpeedNumber': this.playSpeedNumber});
  chrome.storage.local.set({'backNumber': this.backNumber});
  chrome.storage.local.set({'senteIconNumber': this.senteIconNumber});
  chrome.storage.local.set({'goteIconNumber': this.goteIconNumber});
  chrome.storage.local.set({'komaNumber': this.komaNumber});
  chrome.storage.local.set({'banNumber': this.banNumber});
  chrome.storage.local.set({'komadaiNumber': this.komadaiNumber});
  chrome.storage.local.set({'mochiNumber': this.mochiNumber});
  chrome.storage.local.set({'markerNumber': this.markerNumber});
  chrome.storage.local.set({'playButtonNumber': this.playButtonNumber});
  chrome.storage.local.set({'selectionNumber': this.selectionNumber});
  chrome.storage.local.set({'logoNumber': this.logoNumber});

  // window.location.href = 'https://kify.rei-yumesaki.net/input.html'; // 通常の遷移
  window.open('https://kify.rei-yumesaki.net/input.html', '_blank');
}

// 棋譜読みちゃんのページを開いたときに設定があればそれを入力して再読み込み
function checkKifyPage(){
  if(location.host != 'kify.rei-yumesaki.net'){
    return;
  }
  chrome.storage.local.get(['kifu'], (items) => {
    if(items.kifu == null){
      return;
    }
    div.innerHTML = '停止';
    div.onclick = () =>{
      chrome.storage.local.set({'autoActive': false}, () => {});
      voiceroidStop();
    }
    localStorage.setItem( "inputKifu", items.kifu);
    chrome.storage.local.get(['voiceNumber',
                              'komaotoNumber',
                              'playSpeedNumber',
                              'backNumber',
                              'senteIconNumber',
                              'goteIconNumber',
                              'komaNumber',
                              'banNumber',
                              'komadaiNumber',
                              'mochiNumber',
                              'markerNumber',
                              'playButtonNumber',
                              'selectionNumber',
                              'logoNumber'], (items) => {
      if(items.voiceNumber != null)
        localStorage.setItem( "inputSound", items.voiceNumber );
      if(items.komaotoNumber != null)
        localStorage.setItem( "inputKomaoto", items.komaotoNumber );
      if(items.playSpeedNumber != null)
        localStorage.setItem( "inputPlaySpeed", items.playSpeedNumber );
      if(items.backNumber != null)
        localStorage.setItem( "inputBack", items.backNumber );
      if(items.senteIconNumber != null)
        localStorage.setItem( "inputSenteIcon", items.senteIconNumber );
      if(items.goteIconNumber != null)
        localStorage.setItem( "inputGoteIcon", items.goteIconNumber );
      if(items.komaNumber != null)
        localStorage.setItem( "inputKoma", items.komaNumber );
      if(items.banNumber != null)
        localStorage.setItem( "inputBan", items.banNumber );
      if(items.komadaiNumber != null)
        localStorage.setItem( "inputKomadai", items.komadaiNumber );
      if(items.mochiNumber != null)
        localStorage.setItem( "inputMochiNumber", items.mochiNumber );
      if(items.markerNumber != null)
        localStorage.setItem( "inputMarker", items.markerNumber );
      if(items.playButtonNumber != null)
        localStorage.setItem( "inputPlayButton", items.playButtonNumber );
      if(items.selectionNumber != null)
        localStorage.setItem( "inputSelection", items.selectionNumber );
      if(items.logoNumber != null)
        localStorage.setItem( "inputLogo", items.logoNumber );
      }
    );

    setTimeout(() => {
      chrome.storage.local.set({'kifu': null});
      chrome.storage.local.set({'voiceNumber': null});
      chrome.storage.local.set({'komaotoNumber': null});
      chrome.storage.local.set({'playSpeedNumber': null});
      chrome.storage.local.set({'backNumber': null});
      chrome.storage.local.set({'senteIconNumber': null});
      chrome.storage.local.set({'goteIconNumber': null});
      chrome.storage.local.set({'komaNumber': null});
      chrome.storage.local.set({'banNumber': null});
      chrome.storage.local.set({'komadaiNumber': null});
      chrome.storage.local.set({'mochiNumber': null});
      chrome.storage.local.set({'markerNumber': null});
      chrome.storage.local.set({'playButtonNumber': null});
      chrome.storage.local.set({'selectionNumber': null});
      chrome.storage.local.set({'logoNumber': null});
      location.reload()
    }, 100);

  });

}





/** バックグラウンドからとんでくるメッセージを受け取る */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  var inputKifu = localStorage.getItem("inputKifu");
  console.log(inputKifu);
  if(inputKifu != null && inputKifu.length > 10){
    sendResponse(inputKifu);
  }
  return;
});




