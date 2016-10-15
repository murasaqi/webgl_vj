var frequencyData;
var BUNG = false;
var bungValue = 0;
(function () {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

    // Canvas の設定
    var canvas = document.getElementById("world");
    var ctx = canvas.getContext("2d");
    var w = canvas.width = window.innerWidth;
    var h = canvas.height = window.innerHeight - 4;

    // 検索対象の周波数のリスト
    var baseFreq = 442;
    var minNoteOffset = -36;
    var maxNoteOffset = 24;
    var noteList = [];
    for( i = minNoteOffset - 1; i <= maxNoteOffset + 1; i++ ) {
        var noteInfo = {
            "noteOffset": i,
            "freq": baseFreq * Math.pow(2.0, i / 12.0),
            "value": 0.0,
            "posValue": 0.0,
            "negValue": 0.0
        };
        noteList.push(noteInfo);
    }

    // 音名のリスト
    var noteName = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab"];


    // Window の load 時に呼ばれる関数
    var initialize = function() {
        document.body.style.background = "#efefef";

        if( navigator.getUserMedia ) {
            // getUserMedia の第一引数。マイクを利用する。
            var constraints = {"audio":true};

            // getUserMedia の第二引数。成功時に呼ばれるコールバック関数。
            var successCallback = function(mediaStream) {
                var audioContext = new AudioContext();
                var mediastreamsource = audioContext.createMediaStreamSource(mediaStream);
                var analyser = audioContext.createAnalyser();
                frequencyData = new Float32Array(analyser.frequencyBinCount);
                mediastreamsource.connect(analyser);

                // ループ関数
                var animation = function() {
                    analyser.getFloatFrequencyData(frequencyData);
                    for( i = 0; i < frequencyData.length; i++ ) {
                        frequencyData[i] = Math.pow(10.0, 5.0 + 0.05 * frequencyData[i]);
                    }

                    // 周波数成分を計算する関数
                    var getFreqComponentValue = function(freq) {
                        var idxF = (freq * analyser.fftSize) / audioContext.sampleRate;
                        var idx0 = Math.floor(idxF);
                        var idx1 = idx0 + 1;
                        if( idx1 >= frequencyData.length ) return 0.0;
                        return (idx1 - idxF) * frequencyData[idx0] + (idxF - idx0) * frequencyData[idx1];
                    };

                    // 自分自身とその倍音の成分を加算
                    for( i = 0; i < noteList.length; i++ ) {
                        noteList[i].posValue = 0.0;
                        noteList[i].negValue = 0.0;
                        var coeffMax = 20000 / noteList[i].freq;
                        for( var coeff = 1; coeff <= coeffMax; coeff++ ) {
                            noteList[i].posValue += getFreqComponentValue(coeff * noteList[i].freq);
                            for( var subCoeff = 0.1; subCoeff <= 0.9; subCoeff += 0.1 ) {
                                noteList[i].negValue += getFreqComponentValue((coeff - subCoeff) * noteList[i].freq) * 0.1;
                            }
                        }
                        noteList[i].value = noteList[i].posValue - noteList[i].negValue;
                    }

                    // 極大値だけを取り出す
                    var maximalNoteList = [];
                    var maximalValue = -Infinity;
                    for( i = 1; i < noteList.length - 1; i++ ) {
                        if( noteList[i - 1].value <= noteList[i].value && noteList[i].value >= noteList[i + 1].value ) {
                            maximalNoteList.push(noteList[i]);
                            if( noteList[i].posValue > maximalValue ) {
                                maximalValue = noteList[i].value;
                            }
                        }
                    }
                    if( maximalNoteList.length === 0 ) {
                        var lastNote = noteList[noteList.length - 2];
                        if( lastNote.value > maximalValue ) {
                            maximalNoteList.push(lastNote);
                            maximalValue = lastNote.value;
                        } else {
                            maximalNoteList.push(noteList[1]);
                            maximalValue = noteList[1].value;
                        }
                    }

                    // ある程度強い極大値だけを残して強い順に並べ替え
                    var strongNoteList = [];
                    if( maximalValue >= 0 ) {
                        for( i = 0; i < maximalNoteList.length; i++ ) {
                            if( maximalNoteList[i].value >= maximalValue * 0.99 ) {
                                strongNoteList.push(maximalNoteList[i]);
                            }
                        }
                    } else {
                        strongNoteList = maximalNoteList.concat();
                    }
                    var sortFunc = function(a, b) {
                        return b.value - a.value;
                    };
                    strongNoteList.sort(sortFunc);

                    // 最も強い音を倍音に持つ音のうち一番低い音を採用する
                    var currentNote = strongNoteList[0];
                    for( i = 1; i < strongNoteList.length; i++ ) {
                        var noteDistance = strongNoteList[0].noteOffset - strongNoteList[i].noteOffset;
                        if( noteDistance == 12 || noteDistance == 19 || noteDistance == 24 ) {
                            if( strongNoteList[i].noteOffset < currentNote.noteOffset ) {
                                currentNote = strongNoteList[i];
                            }
                        }
                    }


                    var analyzeNum = 8;
                    ctx.clearRect(0, 0, w, h);
                    ctx.fillStyle = "#efefef";
                    ctx.fillRect(0, 0, w, h);
                    //console.log(frequencyData[analyzeNum]);
                    bungValue = frequencyData[analyzeNum];
                    var idx4kHz = Math.floor((4000 * analyser.fftSize) / audioContext.sampleRate);
                    var x0, x1, barWidth, barHeight;


                    for( i = 0; i < idx4kHz; i++ ) {
                        if(i == analyzeNum)
                        {
                            ctx.fillStyle = "red";
                        } else {
                            ctx.fillStyle = "#000000";
                        }
                        x0 = i * w / idx4kHz;
                        x1 = (i + 1) * w / idx4kHz;
                        barWidth = x1 - x0;

                        barHeight = frequencyData[i] * 2;
                        ctx.fillRect(x0, h, barWidth, -barHeight);
                    }
                    for( i = 0; i < noteList.length; i++ ) {
                        ctx.fillStyle = (noteList[i].noteOffset == currentNote.noteOffset) ? "#800000" : "#c08080";
//                            x0 = i * w / noteList.length;
//                            x1 = (i + 1) * w / noteList.length;
//                            barWidth = x1 - x0;
//                            barHeight = noteList[i].value;
//                            ctx.fillRect(x0, h, barWidth, -barHeight);
                    }

                    BUNG = false;
                    if(frequencyData[analyzeNum] > 10)
                    {
                        BUNG = true;
                        ctx.fillStyle = "#000000";
                        ctx.font = "12px sans-serif";
                        ctx.textAlign = "left";
                        ctx.textBaseline = "top";
                        ctx.fillText("Bung!!: " + frequencyData[analyzeNum].toString(), 5, 5);

                    } else {
                        BUNG = false;
                    }


//                        ctx.textBaseline = "top";
//                        ctx.fillText("sampleRate: " + audioContext.sampleRate.toString() + "Hz", 5, 5);
//                        var fontsizePx = Math.ceil(Math.min(w / 5.0, h / 10.0));
//                        ctx.font = fontsizePx.toString() + "px sans-serif";
//                        ctx.textAlign = "center";
//                        ctx.textBaseline = "middle";
//                        var noteText = "---";
//                        if( currentNote.posValue > 10.0 ) {
//                            noteText = noteName[(currentNote.noteOffset + 60) % 12];
//                        }
//                        ctx.fillText(noteText, w / 2, h / 2 - fontsizePx * 0.6);
//                        ctx.fillText(currentNote.posValue.toFixed(1), w / 2, h / 2 + fontsizePx * 0.6);

                    requestAnimationFrame(animation);
                };

                // ループ関数実行開始
                animation();
            };

            // getUserMedia の第三引数。失敗時に呼ばれるコールバック関数。
            var errorCallback = function(err) {
                console.log("getUserMedia error occured: " + err);
            };

            // getUserMedia の呼び出し
            navigator.getUserMedia(constraints, successCallback, errorCallback);
        } else {
            console.log("getUserMedia is not supported.");
        }
    };
    window.addEventListener("load", initialize, false);

})();