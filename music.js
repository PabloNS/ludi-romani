document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("background-music");
    const musicToggle = document.getElementById("music-toggle");

    if (!music || !musicToggle) return;

    const POSITION_KEY = "ludiMusicPosition";
    const PLAYING_KEY = "ludiMusicPlaying";

    const savedPosition = sessionStorage.getItem(POSITION_KEY);

    if (savedPosition !== null) {
        music.addEventListener("loadedmetadata", () => {
            const position = Number(savedPosition);

            if (
                Number.isFinite(position) &&
                position >= 0 &&
                position < music.duration
            ) {
                music.currentTime = position;
            }

            if (sessionStorage.getItem(PLAYING_KEY) === "true") {
                music.play().catch(() => {
                    musicToggle.textContent = "♫ Activar música";
                });
            }
        }, { once: true });
    }

    function updateButton() {
        if (music.paused) {
            musicToggle.textContent = "♫ Activar música";
            musicToggle.setAttribute("aria-pressed", "false");
        } else {
            musicToggle.textContent = "♫ Pausar música";
            musicToggle.setAttribute("aria-pressed", "true");
        }
    }

    musicToggle.addEventListener("click", async () => {
        if (music.paused) {
            try {
                await music.play();
            } catch (error) {
                musicToggle.textContent = "Error al reproducir";
            }
        } else {
            music.pause();
        }

        updateButton();
    });

    music.addEventListener("play", updateButton);
    music.addEventListener("pause", updateButton);

    music.addEventListener("timeupdate", () => {
        if (Number.isFinite(music.currentTime)) {
            sessionStorage.setItem(
                POSITION_KEY,
                String(music.currentTime)
            );
        }
    });

    window.addEventListener("pagehide", () => {
        sessionStorage.setItem(
            POSITION_KEY,
            String(music.currentTime || 0)
        );
        sessionStorage.setItem(
            PLAYING_KEY,
            String(!music.paused && !music.ended)
        );
    });

    updateButton();
});
