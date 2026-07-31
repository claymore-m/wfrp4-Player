/* ============================================================
   PLAYLIST — remplace chaque url par le lien direct MP3 de ton
   fichier sur Internet Archive (clic droit sur le lien de
   téléchargement du fichier > copier l'adresse du lien),
   et title par le nom du morceau tel que tu veux qu'il s'affiche.
   Ajoute/retire des lignes selon le nombre de morceaux.
   ============================================================ */
const TRACKS = [
    { title: "Sous les cieux de l'Empire", url: "https://archive.org/download/TON-IDENTIFIANT/01-sous-les-cieux-de-lempire.mp3" },
    { title: "Morceau 2", url: "https://archive.org/download/TON-IDENTIFIANT/02-morceau-2.mp3" },
    { title: "Morceau 3", url: "https://archive.org/download/TON-IDENTIFIANT/03-morceau-3.mp3" },
    { title: "Morceau 4", url: "https://archive.org/download/TON-IDENTIFIANT/04-morceau-4.mp3" },
    { title: "Morceau 5", url: "https://archive.org/download/TON-IDENTIFIANT/05-morceau-5.mp3" },
    { title: "Morceau 6", url: "https://archive.org/download/TON-IDENTIFIANT/06-morceau-6.mp3" },
    { title: "Morceau 7", url: "https://archive.org/download/TON-IDENTIFIANT/07-morceau-7.mp3" },
    { title: "Morceau 8", url: "https://archive.org/download/TON-IDENTIFIANT/08-morceau-8.mp3" },
    { title: "Morceau 9", url: "https://archive.org/download/TON-IDENTIFIANT/09-morceau-9.mp3" },
    { title: "Morceau 10", url: "https://archive.org/download/TON-IDENTIFIANT/10-morceau-10.mp3" },
    { title: "Morceau 11", url: "https://archive.org/download/TON-IDENTIFIANT/11-morceau-11.mp3" },
    { title: "Morceau 12", url: "https://archive.org/download/TON-IDENTIFIANT/12-morceau-12.mp3" }
];

let currentIndex = 0;

const audio = document.getElementById("audio-player");
const btnPlay = document.getElementById("btn-play");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const trackTitleEl = document.getElementById("track-title");
const timeCurrentEl = document.getElementById("time-current");
const timeDurationEl = document.getElementById("time-duration");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const volumeSlider = document.getElementById("volume-slider");
const playlistEl = document.getElementById("playlist");

function formatTime(seconds)
{
    if (!isFinite(seconds) || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function buildPlaylist()
{
    playlistEl.innerHTML = "";

    TRACKS.forEach((track, index) =>
    {
        const item = document.createElement("div");
        item.className = "playlist-item";
        item.textContent = `${index + 1}. ${track.title}`;
        item.addEventListener("click", () => loadTrack(index, true));
        playlistEl.appendChild(item);
    });

    highlightActiveTrack();
}

function highlightActiveTrack()
{
    const items = playlistEl.querySelectorAll(".playlist-item");
    items.forEach((item, index) =>
    {
        item.classList.toggle("active", index === currentIndex);
    });
}

function loadTrack(index, autoplay)
{
    currentIndex = (index + TRACKS.length) % TRACKS.length;

    const track = TRACKS[currentIndex];
    audio.src = track.url;
    trackTitleEl.textContent = track.title;

    highlightActiveTrack();

    if (autoplay)
    {
        audio.play();
        btnPlay.textContent = "⏸";
    }
}

function togglePlay()
{
    if (audio.paused)
    {
        audio.play();
        btnPlay.textContent = "⏸";
    }
    else
    {
        audio.pause();
        btnPlay.textContent = "▶";
    }
}

btnPlay.addEventListener("click", togglePlay);

btnPrev.addEventListener("click", () => loadTrack(currentIndex - 1, true));

btnNext.addEventListener("click", () => loadTrack(currentIndex + 1, true));

audio.addEventListener("ended", () => loadTrack(currentIndex + 1, true));

audio.addEventListener("timeupdate", () =>
{
    timeCurrentEl.textContent = formatTime(audio.currentTime);

    if (audio.duration)
    {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${pct}%`;
    }
});

audio.addEventListener("loadedmetadata", () =>
{
    timeDurationEl.textContent = formatTime(audio.duration);
});

progressBar.addEventListener("click", (ev) =>
{
    const rect = progressBar.getBoundingClientRect();
    const pct = (ev.clientX - rect.left) / rect.width;

    if (audio.duration)
        audio.currentTime = pct * audio.duration;
});

volumeSlider.addEventListener("input", () =>
{
    audio.volume = volumeSlider.value / 100;
});

audio.volume = volumeSlider.value / 100;

buildPlaylist();
loadTrack(0, false);

buildPlaylist();
loadTrack(0, false);
