var audioFormats = []
var audioMute = false;
var buttonClickSound = null;
var buttonHoverSound = null;
var armyMarchingSound = null;
var battleSound1 = null;
var battleSound2  = null;
var currentMusic = null;
var startupMusic = null;
var startupLoopMusic = null;
var battleMusic = null;
var worldMusic = null;
var mainMenuMusic = null;

var userHasInteractedWithGame = false; // no sound allowed until the first click

function setFormat() {
    if (audioFormats.length === 0) {
        var audio = new Audio();
        if (audio.canPlayType("audio/wav")) {
            audioFormats.push(".wav");
        } 
        if (audio.canPlayType("audio/mp3")) {
            audioFormats.push(".mp3");
        }
        if (audio.canPlayType("audio/ogg")) {
            audioFormats.push(".ogg");
        }
    }
}

function loadAudioFile(filenameWithPath) {
    // check to see if filenameWithPath contains the extension at the end
    // assuming a 3 character extention (ie. wav, mp3, ogg, etc.) plus dot
    // at the beginning
    setFormat(); // called often, but executes once per game
    var newAudio = null;
    var last4CharsOfFileName = filenameWithPath.slice(-4).toLocaleLowerCase();
    if (last4CharsOfFileName.slice(0, 1) === ".") {
        if (audioFormats.length > 0) {
            // check file name extension for playable audio formats
            for(i = 0;i < audioFormats.length && newAudio === null; i++) {
                var audioFormat = audioFormats[i].toLocaleLowerCase();
                if (last4CharsOfFileName === audioFormat) {
                    newAudio = new Audio(filenameWithPath);
                }
            }
        }
    }
    // no extension in fileName so check if file loads with any our browser's 
    // playable formats
    if (newAudio === null && audioFormats.length > 0) {
        // check file name extension for playable audio formats
        for(i = 0;i < audioFormats.length && newAudio === null; i++) {
            newAudio = new Audio(filenameWithPath + audioFormats[i]);
        }
    }
    return newAudio;
}

function SoundOverlapsClass(filenameWithPath) {
    var altSoundTurn = false;
    var mainSound = loadAudioFile(filenameWithPath);
    var altSound = loadAudioFile(filenameWithPath);

    this.play = function() {
        // avoid browser errors due to autoplay permissions
        if (!userHasInteractedWithGame) return;

        if (!audioMute) {
            if (altSoundTurn) {
                altSound.currentTime = 0;
                this.playWithPausability(altSound);
            } else {
                mainSound.currentTime = 0;
                this.playWithPausability(mainSound);
            }
            // toggle between sounds
            altSoundTurn = !altSoundTurn;
        }
    };

    // adapted from https://developer.chrome.com/blog/play-request-was-interrupted/
    this.playWithPausability = function(audioFile) {
        var playPromise = audioFile.play();
        if (playPromise !== undefined) {
          playPromise.then(_ => {
            // playback starts, no code necessary
          })
          .catch(error => {
            // playback prevented, in case of pause before play returns
          });
        }   
    }

    this.paused = function() {
        // avoid browser errors due to autoplay permissions
        if (!userHasInteractedWithGame) return false;
        return ((!altSound || altSound.paused) && (!mainSound || mainSound.paused));
    };

    this.pause = function() {
        // TODO: find a good place to pause the SoundOverlapsClass objects
        // such as the marching sound

        // avoid browser errors due to autoplay permissions
        if (!userHasInteractedWithGame) return;

        if (altSound && !altSound.paused) {
            altSound.pause();
        }
        if (mainSound && !mainSound.paused) {
            mainSound.pause();
        }
    };
}

function BackgroundMusicClass() {
    this.musicSound = null;

    this.loopSong = function(filenameWithPath) {
        this.playSong(filenameWithPath, true)
    }

    this.playSong = function(filenameWithPath, loop=false) {
        // avoid browser errors due to autoplay permissions
        if (!userHasInteractedWithGame) return;

        if (this.musicSound != null) {
            this.musicSound.pause();
            this.musicSound = null;
        }
        this.musicSound = loadAudioFile(filenameWithPath);
        this.musicSound.loop = loop;
        this.musicSound.muted = audioMute;
        // adapted from https://developer.chrome.com/blog/play-request-was-interrupted/
        // this.musicSound.load();
        // fetch(this.musicSound.src)
        //     .then(response => response.blob())
        //     .then(blob => {
        //       this.musicSound.srcObject = blob;
        //       return video.play();
        //     })
        //     .then(_ => {
        //       // Video playback started ;)
        //     })
        //     .catch(e => {
        //       // Video playback failed ;(
        //     });
        var playPromise = this.musicSound.play();
        if (playPromise !== undefined) {
          playPromise.then(_ => {
            // playback starts, no code necessary
          })
          .catch(error => {
            // playback prevented, in case of pause before play returns
          });
        }
    }

    this.startOrStopMusic = function() {
        // avoid browser errors due to autoplay permissions
        if (!userHasInteractedWithGame) return;

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

    // added definite start/stop functions, because sometimes I need to
    // ensure one state or another explicitly
    this.startMusic = function() {
        // avoid browser errors due to autoplay permissions
        if (!userHasInteractedWithGame) return;

        if (this.musicSound != null) {
            this.musicSound.muted = audioMute;
            this.musicSound.play();
            currentMusic = this;
        } else {
            console.log("error music sound not started")
        }
    }

    this.stopMusic = function() {
        // avoid browser errors due to autoplay permissions
        if (!userHasInteractedWithGame) return;

        if (this.musicSound != null) {
            this.musicSound.muted = audioMute;
            this.musicSound.pause();
        } else {
            console.log("error music sound not stopped");
        }
    }
}

function loadSounds() {
    buttonClickSound = new SoundOverlapsClass("audio/sfx/button_click");
    buttonHoverSound = new SoundOverlapsClass("audio/sfx/button_hover");
    armyMarchingSound = new SoundOverlapsClass("audio/hundreds_marching_clatter");
    battleSound1 = new SoundOverlapsClass("audio/battle_sounds_1");
    battleSound2 = new SoundOverlapsClass("audio/battle_sounds_2");

    battleMusic = new BackgroundMusicClass();
    battleMusic.loopSong("audio/Pixeldeep_Battle_1.mp3");
    battleMusic.startOrStopMusic(); // stop music playing immediately; wait for battle mode to trigger

    worldMusic = new BackgroundMusicClass();
    worldMusic.loopSong("audio/slow_map_Pixeldeep.mp3");
    worldMusic.startOrStopMusic(); // stop music playing immediately; wait for battle mode to trigger

    mainMenuMusic = new BackgroundMusicClass();
    mainMenuMusic.loopSong("audio/world_background_Pixeldeep.mp3");
    mainMenuMusic.startOrStopMusic(); // stop music playing immediately; wait for battle mode to trigger

    // this song will only play once at the beginning of game interaction
    startupMusic = new BackgroundMusicClass();
    startupMusic.playSong("audio/world_background_Pixeldeep.mp3");
    startupMusic.startOrStopMusic(); // stop music at first

    startupLoopMusic = mainMenuMusic;
    // startupLoopMusic.loopSong("audio/slow_map_Pixeldeep.mp3");
    // startupLoopMusic.stopMusic(); // stop music at first
}

function toggleAudioMute() {
    audioMute = !audioMute;

    if (currentMusic && currentMusic.musicSound) {
        currentMusic.musicSound.muted = audioMute;
    }
}

function playStartupMusic() {
    if (!startupMusic.musicSound) {
        console.error("startupMusic.musicSound is null!");
        return;
    }

    // add a ended listener to startup music to play loop music after it finishes
    startupMusic.musicSound.addEventListener("ended", function() {
        if (currentMusic === startupMusic) {
            currentMusic = startupLoopMusic;
            if (currentMusic != null) {
                currentMusic.startMusic();
            }
        }
    });

    currentMusic = startupMusic;
    if (currentMusic != null) {
        currentMusic.startMusic();
    }
}

function stopAllMusic() {
    if(startupMusic) {
        startupMusic.stopMusic();
    }
    if(startupLoopMusic) {
        startupLoopMusic.stopMusic();
    }
    if(battleMusic) {
        battleMusic.stopMusic();
    }
    if(worldMusic) {
        worldMusic.stopMusic();
    }
    if(mainMenuMusic) {
        mainMenuMusic.stopMusic();
    }
}

function stopAllMusicAndPlay(musicToPlayNow) {
    if (musicToPlayNow) {
        if (currentMusic != musicToPlayNow) {
            stopAllMusic();
            currentMusic = musicToPlayNow;
        }
        currentMusic.startMusic();
    }
}
