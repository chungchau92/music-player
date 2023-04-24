const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playerStorageKey = "setting"

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  isRepeat: false,
  isPlaying: false,
  isRandom: false,
  currentIndex: 0,
  config: JSON.parse(localStorage.getItem(playerStorageKey)) || {},
  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(playerStorageKey, JSON.stringify(this.config))
  },
  songs: [
    {
      name: "Love me like you do",
      singer: "Ellie_Goulding",
      path: "./assets/music/Ellie_Goulding_-_Love_Me_Like_You_Do.mp3",
      image: "./assets/img/loveMeLikeYouDo.jpg",
    },
    {
      name: "Cupid",
      singer: "FIFTY FIFTY",
      path: "./assets/music/Fifty_Fifty_-_Cupid.mp3",
      image: "./assets/img/cupid.jpg",
    },
    {
      name: "Summer Time",
      singer: "Cinnamons-x-Evening-Cinema",
      path: "./assets/music/Summertime-Cinnamons-x-Evening-Cinema-Remix.mp3",
      image: "./assets/img/summerTime.jpg",
    },
    {
      name: "Summer Time",
      singer: "Cinnamons-x-Evening-Cinema",
      path: "./assets/music/Summertime-Cinnamons-x-Evening-Cinema-Remix.mp3",
      image: "./assets/img/summerTime.jpg",
    },
    {
      name: "Summer Time",
      singer: "Cinnamons-x-Evening-Cinema",
      path: "./assets/music/Summertime-Cinnamons-x-Evening-Cinema-Remix.mp3",
      image: "./assets/img/summerTime.jpg",
    },
    {
      name: "Summer Time",
      singer: "Cinnamons-x-Evening-Cinema",
      path: "./assets/music/Summertime-Cinnamons-x-Evening-Cinema-Remix.mp3",
      image: "./assets/img/summerTime.jpg",
    },
    {
      name: "Summer Time",
      singer: "Cinnamons-x-Evening-Cinema",
      path: "./assets/music/Summertime-Cinnamons-x-Evening-Cinema-Remix.mp3",
      image: "./assets/img/summerTime.jpg",
    },
    {
      name: "Summer Time",
      singer: "Cinnamons-x-Evening-Cinema",
      path: "./assets/music/Summertime-Cinnamons-x-Evening-Cinema-Remix.mp3",
      image: "./assets/img/summerTime.jpg",
    },
    {
      name: "Summer Time",
      singer: "Cinnamons-x-Evening-Cinema",
      path: "./assets/music/Summertime-Cinnamons-x-Evening-Cinema-Remix.mp3",
      image: "./assets/img/summerTime.jpg",
    },
    {
      name: "Cupid",
      singer: "FIFTY FIFTY",
      path: "./assets/music/Fifty_Fifty_-_Cupid.mp3",
      image: "./assets/img/cupid.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
            <div
                class="thumb"
                style="
                background-image: url('${song.image}')
                "
            ></div>
            <div class="body">
                <div class="title">${song.name}</div>
                <div class="author">${song.singer}</div>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
        `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // handle rotate cd thumb
    const cdThumbAnimation = cdThumb.animate(
      [{ transform: "rotate(360deg) scale(1)" }],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );

    cdThumbAnimation.pause();

    // handle scroll
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
    };

    // handle play music
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Handle Playing song
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimation.play();
    };

    // Handle Pause song
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimation.pause();
    };

    // Handle time change of song
    audio.ontimeupdate = function () {
      const progressPercent = Math.floor(
        (audio.currentTime / audio.duration) * 100
      );
      progress.value = progressPercent;
    };

    // handle fast forward
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // handle next Song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // handle prev Song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // handle random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom)
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // handle repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat)
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    //  handle onend
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // handle when click on playlist
    playlist.onclick = function (e) {
      if (
        e.target.closest(".song:not(.active)") || e.target.closest(".option")
      ) {
        if(e.target.closest(".song:not(.active)")) {
          _this.currentIndex = Number(e.target.closest(".song:not(.active)").dataset.index)
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  },

  start: function () {

    this.loadConfig();

    // define propertties object
    this.defineProperties();

    // handle Events
    this.handleEvents();

    // render playlist
    this.render();

    this.loadCurrentSong();

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);

  },
};

app.start();
