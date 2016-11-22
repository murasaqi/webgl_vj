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
var isKeyUp = true;
var start = false;
var rings = [];
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

    rings = [ring00,ring01,ring02,ring03,ring04];

    for(var i = 0; i < rings.length; i++)
    {
        rings[i].playMode('restart');
    }




  song.playMode('restart');
  noise01.playMode('restart');
  ring.playMode('restart');
  
  
//   createCanvas(720, 200);
//   background(255,0,0);
  
}
function draw()
{
    counter++;
    
    if (isKeyUp && start){//&& keyCode == '188') {
    //   song.stop();
        ring.stop();
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




function keyReleased()
{
    isKeyUp = true;
}

function keyPressed() {
    isKeyUp = false;
    if (keyCode == '190') {
        //   song.stop();
        noise01.stop();

        if(!ring.isPlaying())
        {
            ring.play();
        }

    }

    var num = Math.floor(Math.random()*rings.length);
    rings[num].play();

    if(keyCode == '188')
    {
        start = true;
    }
    
}
