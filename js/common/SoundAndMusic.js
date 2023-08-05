var audioFormat;

function setFormat() {
  var audio = new Audio();
  if (audio.canPlayType("audio/mp3")) {
    audioFormat = ".mp3";
  } else {
    audioFormat = ".ogg";
  }
}

function SoundOverlapsClass(filenameWithPath) {
  // calling this to ensure that audioFormat is set before needed
  setFormat();

  altSoundTurn = false;
  mainSound = new Audio(filenameWithPath + audioFormat);
  altSound = new Audio(filenameWithPath + audioFormat);

  play = function() {
    if (altSoundTurn) {
      this.altSound.currentTime = 0;
      this.altSound.play();
    } else {
      this.mainSound.currentTime = 0;
      this.mainSound.play();
    }
    // toggle between sounds
    this.altSoundTurn = !this.altSoundTurn;
  }
}

function BackgroundMusicClass() {
  var musicSound = null;

  this.loopSong = function(filenameWithPath) {
    // calling this to ensure that audioFormat is set before needed
    setFormat();

    if (musicSound != null) {
      musicSound.pause();
      musicSound = null;
    }
    musicSound = new Audio(filenameWithPath + audioFormat);
    musicSound.loop = true;
    musicSound.play();
  }
  
  this.startOrStopMusic = function() {
    if (musicSound.paused) {
      musicSound.play();
    } else {
      musicSound.pause();
    }
  }
}
