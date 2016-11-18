window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var rythmsA;
var gainNode = audioContext.createGain();

// Audio 用の buffer を読み込む
var getAudioBuffer = function(url, fn) {
    var req = new XMLHttpRequest();
    // array buffer を指定
    req.responseType = 'arraybuffer';

    req.onreadystatechange = function() {
        if (req.readyState === 4) {
            if (req.status === 0 || req.status === 200) {
                // array buffer を audio buffer に変換
                audioContext.decodeAudioData(req.response, function(buffer) {
                    // コールバックを実行
                    fn(buffer);
                });
            }
        }
    };

    req.open('GET', url, true);
    req.send('');
};

// サウンドを再生
var playSound = function(buffer,gain) {
    // source を作成



    var source = audioContext.createBufferSource();
    // buffer をセット
    source.buffer = buffer;
    // context に connect
    source.connect(audioContext.destination);
    // 再生


    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = gain;

    source.start(0);
};



// main
window.onload = function() {
    // サウンドを読み込む
    getAudioBuffer('./sounds/rhythm.wav', function(buffer) {
        rythmsA = buffer;
    });
};

window.document.onkeydown = function (event) {
    console.log('pusu');
    playSound(rythmsA,5);
}