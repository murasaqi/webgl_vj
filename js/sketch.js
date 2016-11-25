/*
 * @name Load and Play Sound
 * @description Load sound during preload(). Play a sound when canvas is clicked.
 * <br><br><em><span class="small"> To run this example locally, you will need the
 * <a href="http://p5js.org/reference/#/libraries/p5.sound">p5.sound library</a>
 * a sound file, and a running <a href="https://github.com/processing/p5.js/wiki/Local-server">local server</a>.</span></em>
 */
var song;
var counter = 0;
var noise01;
var ring,ring00,ring01,ring02,ring03,ring04,ring05;
var drum00,drum01,drum02,drum03,drum04;
var isKeyUp = true;
var start = false;
var rings = [];
var drums = [];
var clock_drum;
var isPlayBGM = [false,false,false,false,false];
var BGM = [];
var play = false;
var bgm00,bgm01,bgm02,bgm03;
function setup() {
    song = loadSound('sounds/rhythm.wav');
    noise01 = loadSound('sounds/noise01.wav');
    ring = loadSound('sounds/ring.wav');
    ring00 = loadSound('sounds/ring00.wav');
    ring01 = loadSound('sounds/ring01.wav');
    ring02 = loadSound('sounds/ring02.wav');
    ring03 = loadSound('sounds/ring03.wav');
    ring04 = loadSound('sounds/ring04.wav');
    // ring05 = loadSound('sounds/ring05.wav');
    drum00 = loadSound('sounds/drum00.wav');
    drum01 = loadSound('sounds/drum01.wav');
    drum02 = loadSound('sounds/drum02.wav');
    drum03 = loadSound('sounds/drum03.wav');
    clock_drum = loadSound('sounds/clock_drum01.wav');
    clock_drum.pan(1.0)
    rings = [ring00,ring01,ring02,ring03,ring04];
    drums = [drum00,drum01,drum02,drum03];

    bgm00 = loadSound('sounds/noise_rythm.wav');
    bgm01 = loadSound('sounds/hollow.wav');
    bgm02 = loadSound('sounds/noise_haunted.wav');
    bgm03 = loadSound('sounds/noise_haunted.wav');
    BGM = [bgm00,bgm01,bgm02];

    for(var i = 0; i < rings.length; i++)
    {
        rings[i].playMode('restart');
    }

    for(var i = 0; i < drums.length; i++)
    {
        drums[i].playMode('restart');
    }




  song.playMode('restart');
  noise01.playMode('restart');
  ring.playMode('restart');
    clock_drum.playMode('restart');
  

  
}
function draw()
{

    if(play)
    {
        // if(!bgm00.isPlaying())
        // {
        //     bgm00.play();
        // }

        for(var i = 0; i < BGM.length; i++)
        {
            if(isPlayBGM[i] == true && !BGM[i].isPlaying())
            {
                BGM[i].play();
            }
        }
    }

    counter++;
    
    if (isKeyUp && start){//&& keyCode == '188') {
    //   song.stop();
        ring.pause();
        if(counter%6 == 0){
            song.play();
        }
        if(!noise01.isPlaying())
        {
          noise01.play();  
        }
      
    }

    
    // if()
    // {
        
    // }
    // console.log(keyCode);
}


function clock()
{
    clock_drum.play();
}

function keyReleased()
{
    isKeyUp = true;
    // song.pause();
    // noise01.pause();
}

function keyPressed() {
    console.log(keyCode);
    isKeyUp = false;
    if (keyCode == '190') {
        //   song.stop();
        noise01.pause();

        if(!ring.isPlaying())
        {
            ring.play();
        }

    }

    if (keyCode == '82') {
        randomRingPlay();

    }

    if (keyCode == '68') {

        randomDrumPlay();
    }

    if (keyCode == '27') {

        start = false;
        song.pause();
        noise01.pause();
    }

    if(keyCode == "80")
    {
        play = true;
    }




    if(keyCode == '188')
    {
        start = !start;
    }
    
}
function randomRingPlay() {
    var num = Math.floor(Math.random()*rings.length);
    rings[num].play();
}

function randomDrumPlay() {
    var num = Math.floor(Math.random()*drums.length);
    drums[num].play();
}