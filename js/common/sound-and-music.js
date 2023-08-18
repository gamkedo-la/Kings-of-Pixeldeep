var audioFormat;
var audioMute = false;
var buttonClickSound = null;
var buttonHoverSound = null;
var currentMusic = null;
var startupMusic = null;
var loopMusic = null;

function setFormat() {
    var audio = new Audio();
    if (audio.canPlayType("audio/wav")) {
        audioFormat = ".wav";
    } else if (audio.canPlayType("audio/mp3")) {
        audioFormat = ".mp3";
    } else {
        audioFormat = ".ogg";
    }
}

function SoundOverlapsClass(filenameWithPath) {
    // calling this to ensure that audioFormat is set before needed
    setFormat();

    var altSoundTurn = false;
    var mainSound = new Audio(filenameWithPath + audioFormat);
    var altSound = new Audio(filenameWithPath + audioFormat);

    this.play = function() {
        if (!audioMute) {
            if (altSoundTurn) {
              altSound.currentTime = 0;
              altSound.play();
            } else {
                mainSound.currentTime = 0;
                mainSound.play();
            }
            // toggle between sounds
            altSoundTurn = !altSoundTurn;
        }
    };
}

function BackgroundMusicClass() {
    this.musicSound = null;

    this.loopSong = function(filenameWithPath) {
        // calling this to ensure that audioFormat is set before needed
        setFormat();

        if (this.musicSound != null) {
            this.musicSound.pause();
            this.musicSound = null;
        }
        this.musicSound = new Audio(filenameWithPath + audioFormat);
        this.musicSound.loop = true;
        this.musicSound.muted = audioMute;
        this.musicSound.play();
    }

    this.playSong = function(filenameWithPath) {
        setFormat();

        if (this.musicSound != null) {
            this.musicSound.pause();
            this.musicSound = null;
        }
        this.musicSound = new Audio(filenameWithPath + audioFormat);
        this.musicSound.loop = false;
        this.musicSound.muted = audioMute;
        this.musicSound.play();
    }

    this.startOrStopMusic = function() {
        if (this.musicSound != null) {
            this.musicSound.muted = audioMute;
            if (this.musicSound.paused) {
                this.musicSound.play();
            } else {
                this.musicSound.pause();
            }
        } else {
            console.log("error music sound not toggled")
        }
    }
}

function loadSounds() {
    buttonClickSound = new SoundOverlapsClass("audio/sfx/button_click");
    buttonHoverSound = new SoundOverlapsClass("audio/sfx/button_hover");

    // this song will only play once at the beginning
    startupMusic = new BackgroundMusicClass();
//    startupMusic.playSong("audio/sfx/music_startup");
//    startupMusic.startOrStopMusic(); // stop music at first
    startupMusic.startOrStopMusic(); // stop music at first

    // loop song to play after start up song
    loopMusic = new BackgroundMusicClass();
//    loopMusic.loopSong("audio/sfx/music_world_loop");
//    loopMusic.startOrStopMusic(); // stop music at first
}

function toggleAudioMute() {
    audioMute = !audioMute;

    if (currentMusic != null) {
        currentMusic.startOrStopMusic();
    }
}

function playStartupMusic() {
    // add a ended listener to startup music to play loop music after it finishes
    if (!startupMusic.musicSound) {
        console.error("startupMusic.musicSound is null!");
        return;
    }
    startupMusic.musicSound.addEventListener("ended", function() {
        currentMusic = loopMusic;
        if (currentMusic != null) {
            currentMusic.startOrStopMusic();
        }
    });

    currentMusic = startupMusic;
    if (currentMusic != null) {
        currentMusic.startOrStopMusic();
    }
}