

function komaChar(pc, isSente, isPromote){
  var char = '';
  if(isPromote){
    char += '*';  // 本来なら + だが、 * で代用
  }
  switch(pc){
    case 0: char += isSente? 'P' : 'p'; break;
    case 1: char += isSente? 'L' : 'l'; break;
    case 2: char += isSente? 'N' : 'n'; break;
    case 3: char += isSente? 'S' : 's'; break;
    case 4: char += isSente? 'G' : 'g'; break;
    case 5: char += isSente? 'B' : 'b'; break; // 角
    case 6: char += isSente? 'R' : 'r'; break; // 飛
    case 7: char += isSente? 'K' : 'k'; break;
  }
  return char;
}


// k4 は　3312 みたいな４つの数字 最初の二つは駒の場所　３つめは先手かどうか、４つめは成駒かどうか
function setFirstKoma(pos, sente, gote, k4, pc){
  if(k4){
    const file = numFromChar(k4.slice(0,1))
    const rank = numFromChar(k4.slice(1,2))
    const isSente = k4.slice(2,3) == '0';
    const isPromote = k4.slice(3,4) == '2';
  
    if(file == 0){
      // 持ち駒
      if(isSente){
        sente[rank-1] += 1;
      }
      else{
        gote[rank-1] += 1;
      }
      return;
    }
    pos[rank-1][9-file] = komaChar(pc, isSente, isPromote);
  }
}

function sfenFromFirstCsv(firstCsv){

  var sente = new Array(7).fill(0);
  var gote = new Array(7).fill(0);
  var pos = [];
  for(var i =0; i<9; i++){
    pos.push(new Array(9).fill(''));
  }
  for(var i=0; i<18; i++){
    const k4 = firstCsv.slice(5*i, 5*i + 4);
    setFirstKoma(pos, sente, gote, k4, 0); // 歩
  }
  for(var i=18; i<22; i++){
    const k4 = firstCsv.slice(5*i, 5*i + 4);
    setFirstKoma(pos, sente, gote, k4, 1);  // 香
  }
  for(var i=22; i<26; i++){
    const k4 = firstCsv.slice(5*i, 5*i + 4);
    setFirstKoma(pos, sente, gote, k4, 2);  // 桂
  }
  for(var i=26; i<30; i++){
    const k4 = firstCsv.slice(5*i, 5*i + 4);
    setFirstKoma(pos, sente, gote, k4, 3);  // 銀
  }
  for(var i=30; i<34; i++){
    const k4 = firstCsv.slice(5*i, 5*i + 4);
    setFirstKoma(pos, sente, gote, k4, 4);  // 金
  }
  for(var i=34; i<36; i++){
    const k4 = firstCsv.slice(5*i, 5*i + 4);
    setFirstKoma(pos, sente, gote, k4, 6);  // 飛
  }
  for(var i=36; i<38; i++){
    const k4 = firstCsv.slice(5*i, 5*i + 4);
    setFirstKoma(pos, sente, gote, k4, 5);  // 角
  }
  // 玉は無い可能性があるので
  if(firstCsv.length >= 195){
    var i = 38;
    var k4 = firstCsv.slice(5*i, 5*i + 4);
    setFirstKoma(pos, sente, gote, k4, 7);  // 玉
  }
  if(firstCsv.length >= 200){
    var i = 39;
    var k4 = firstCsv.slice(5*i, 5*i + 4);
    setFirstKoma(pos, sente, gote, k4, 7);  // 玉
  }
  console.log(pos);
  console.log(sente);
  console.log(gote);

  var sfen = '';
  for(var i=0; i<9; i++){
    var line = ''
    var brankCount = 0;
    for(var j=0; j<9; j++){
      if(pos[i][j]){
        if(brankCount){
          line += brankCount;
          brankCount = 0;
        }
        line += pos[i][j];
      }
      else{
        brankCount += 1;
      }
    }
    if(brankCount){
      line += brankCount;
      brankCount = 0;
    }
    if(i<8){
      line += '$'; // 本来は / で区切るが、urlだと上手く表示されないので、$ で代用
    }
    sfen += line;
  }

  sfen += '_w';  // spaceも使えないので、_ で代用、先手から始まるものとする

  var mochi = '';
  for(var i = 8; i>=0; i--){
    if(sente[i]){
      const koma = komaChar(i, true, false);
      mochi += koma;
      if(sente[i] > 1){
        mochi += sente[i];
      }
    }
  }
  for(var i = 8; i>=0; i--){
    if(gote[i]){
      const koma = komaChar(i, false, false);
      mochi += koma;
      if(gote[i] > 1){
        mochi += gote[i];
      }
    }
  }

  if(mochi){
    sfen += "_" + mochi;
  }
  else{
    sfen += "_-";
  }

  sfen += '_1'; // お決まりの最後の 1 いらないけど一応つけとく

  console.log(sfen);
  if(sfen == 'lnsgkgsnl$1r5b1$ppppppppp$9$9$9$PPPPPPPPP$1B5R1$LNSGKGSNL_w_-_1'){
    // 平手の場合は省略
    sfen = '';
  }
  return sfen;
}

function numFromChar(char){
  switch(char){
    case '1': return 1;
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
    case '5': return 5;
    case '6': return 6;
    case '7': return 7;
    case '8': return 8;
    case '9': return 9;
  }
  return 0;
}

// 移動先の弁8bit を返す 1~81 の数、ふつうは0~80だがまあ
function moveToByte(move){
  // row col のほうが一般的でわかりやすいが、将棋界の風習に合わせておく。まあ右上から数えている点を強調する意味ではいいか？
  var file = numFromChar(move.slice(0, 1)); // 筋の意味
  var rank = numFromChar(move.slice(1, 2)); // 段の意味
  if(file == 0 || rank == 0){
    // 同　の時
    if(move.indexOf('00') != -1){
      return 255;
    }
    return 0;
  }
  return (file - 1) * 9 + rank;
}

// 駒の種別を返す 0~13 の値
function komaToByte(koma){
  if(koma.indexOf('歩') != -1){
    return 0;
  }
  if(koma.indexOf('香') != -1){
    return 1;
  }
  if(koma.indexOf('桂') != -1){
    return 2;
  }
  if(koma.indexOf('銀') != -1){
    return 3;
  }
  if(koma.indexOf('角') != -1){
    return 4;
  }
  if(koma.indexOf('飛') != -1){
    return 5;
  }
  if(koma.indexOf('金') != -1){
    return 6;
  }
  if(koma.indexOf('玉') != -1){
    return 7;
  }
  if(koma.indexOf('と') != -1){
    return 8;
  }
  if(koma.indexOf('成香') != -1){
    return 9;
  }
  if(koma.indexOf('成桂') != -1){
    return 10;
  }
  if(koma.indexOf('成銀') != -1){
    return 11;
  }
  if(koma.indexOf('馬') != -1){
    return 12;
  }
  if(koma.indexOf('龍') != -1){
    return 13;
  }

  return 255;
}

// 右、左、寄、上、成、打　みたいな文字を検出してbyteに直す
function posiToByte(move){
  var lr = 0; // 右または左 2bit
  var tb = 0; // 上、寄、引 2bit
  var pr = 0; // 不成、成、打 2bit
  if(move.indexOf('右') != -1){
    lr = 1;
  }
  else if(move.indexOf('左') != -1){
    lr = 2;
  }
  if(move.indexOf('上') != -1){
    tb = 1;
  }
  else if(move.indexOf('寄') != -1){
    tb = 2;
  }
  else if(move.indexOf('引') != -1){
    tb = 3;
  }
  if(move.indexOf('不成') != -1){
    pr = 1;
  }
  else if(move.slice(-1) == '成'){
    pr = 2;
  }
  else if(move.indexOf('打') != -1){
    pr = 3;
  }
  return lr + 4*tb + 16*pr;
}

// ２ニ角成 みたいな文字を24bit(移動先の弁:8bit, 駒種:8bit, 付属文字:8bit) のbyte列に直す 投了は 0,0,0 とする
function move3bytes(move){
  var bytes = new Uint8Array(3);
  bytes[0] = 0;
  bytes[1] = 0;
  bytes[2] = 0;
  if(move.indexOf('勝ち') != -1){
    // 投了時
    return bytes;
  }
  bytes[0] = moveToByte(move);
  bytes[1] = komaToByte(move);
  bytes[2] = posiToByte(move);
  console.log(move, bytes);
  return bytes;
}


function makeKifLink(kifus){
  console.log(kifus);
  var link = 'https://biss-git.github.io/kify-guide/#/?';

  var sfen = sfenFromFirstCsv(kifus.firstCsv);
  if(sfen != null && sfen.length > 10){
    link += 's=' + sfen + '&';
  }

  var ki2 = kifus.ki2;
  console.log(ki2)
  var moveLength = 0;
  var moveBytes = [];
  for(var i =1; i< 1000000; i++){
    if(ki2[i] == null){
      break;
    }
    move = ki2[i];
    moveLength += 1;
    moveBytes.push(move3bytes(move));
  }
  var byteArray = new Uint8Array(3 * moveLength);
  for(var i = 0; i<moveLength; i++){
    byteArray[i + 0 * moveLength] = moveBytes[i][0];
    byteArray[i + 1 * moveLength] = moveBytes[i][1];
    byteArray[i + 2 * moveLength] = moveBytes[i][2];
  }

  var gzip = new Zlib.Gzip(byteArray);
  var compressed = gzip.compress();

  var base64String = btoa(String.fromCharCode(...compressed));
  

  link += 'm=' + base64String;
  var listener = function(e){

    e.clipboardData.setData("text/plain" , link);    
    // 本来のイベントをキャンセル
    e.preventDefault();
    // 終わったら一応削除
    document.removeEventListener("copy", listener);
    alert('クリップボードに共有リンクをコピーしました。')
  }

  // コピーのイベントが発生したときに、クリップボードに書き込むようにしておく
  document.addEventListener("copy" , listener);

  // コピー
  document.execCommand("copy");
}


function Kif2Csv(str){
  body = {
    'str': str,
  };
  axios.post("https://aws.kukiminsho.com/minsho/kifuyomis/strToCsv", body)
  .then(response => {
    makeKifLink(response.data)
  })
  .catch(error => {
    console.log(error);
  });
}


function getKifu(tab){
  chrome.tabs.sendMessage(tab.id, { command: 'inputKifu' }, function (response) {
    if (response){
      Kif2Csv(response);
    }
  });
}


chrome.contextMenus.create({
  title: 'この棋譜の共有リンクを生成する',
  type: 'normal',
  contexts: ['all'],
  onclick: function (info, tab) {
    getKifu(tab);
  }
});

