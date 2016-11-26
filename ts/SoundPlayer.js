window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var SoundPlayer = (function () {
    function SoundPlayer() {
        this.getAudioBuffer = function (url, fn) {
            var req = new XMLHttpRequest();
            // array buffer を指定
            req.responseType = 'arraybuffer';
            req.onreadystatechange = function () {
                if (req.readyState === 4) {
                    if (req.status === 0 || req.status === 200) {
                        // array buffer を audio buffer に変換
                        audioContext.decodeAudioData(req.response, function (buffer) {
                            // コールバックを実行
                            fn(buffer);
                        });
                    }
                }
            };
            req.open('GET', url, true);
            req.send('');
        };
        this.getAudioBuffer('../sounds/rhythm.wav', function (buffer) {
            this.buffer = buffer;
        });
    }
    SoundPlayer.prototype.play = function () {
        // source を作成
        var source = audioContext.createBufferSource();
        // buffer をセット
        source.buffer = this.buffer;
        // context に connect
        source.connect(audioContext.destination);
        // 再生
        source.start(0);
    };
    return SoundPlayer;
}());
//# sourceMappingURL=SoundPlayer.js.map