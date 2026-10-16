(() => {
    "use strict";

    const events = Array.isArray(window.ROMAN_EVENTS)
        ? window.ROMAN_EVENTS
        : [];

    const categoryNames = {
        festival: "Festival romano",
        military: "Legiones y campamentos",
        gladiators: "Gladiadores",
        "living-history": "Vida cotidiana",
        market: "Mercados y ferias"
    };

    const el = (id) => document.getElementById(id);
    const list = el("event-list");
    const emptyState = el("empty-state");
    const resultCount = el("result-count");

    let map;
    let markerLayer;
    let markersById = new Map();

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function parseDate(value) {
        if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return null;
        }

        const date = new Date(`${value}T12:00:00Z`);

        if (Number.isNaN(date.getTime())) return null;

        if (date.toISOString().slice(0, 10) !== value) return null;

        return date;
    }

    function formatDate(value) {
        const date = parseDate(value);

        if (!date) return "";

        return new Intl.DateTimeFormat("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC"
        }).format(date);
    }

    function validEvent(event) {
        return event &&
            typeof event.id === "string" &&
            typeof event.name === "string" &&
            typeof event.city === "string" &&
            typeof event.country === "string" &&
            Number.isFinite(event.lat) &&
            Number.isFinite(event.lng) &&
            event.lat >= -90 &&
            event.lat <= 90 &&
            event.lng >= -180 &&
            event.lng <= 180;
    }

    function eventDateLabel(event) {
        if (event.demo) return "Fecha pendiente de verificar";

        const start = formatDate(event.dateStart);
        const end = formatDate(event.dateEnd);

        if (!start) return "Fecha por anunciar";
        if (!end || event.dateEnd === event.dateStart) return start;

        return `${start} – ${end}`;
    }

    function isPublished(event) {
        if (event.demo === true || !event.sourceUrl) return false;

        const start = parseDate(event.dateStart);
        const end = parseDate(event.dateEnd || event.dateStart);

        if (!start || !end || end < start) return false;

        try {
            const url = new URL(event.sourceUrl);

            return url.protocol === "https:" || url.protocol === "http:";
        } catch {
            return false;
        }
    }


    function createMarkerIcon(event) {
        const demo = event.demo === true || !isPublished(event);

        return L.divIcon({
            className: "roman-marker-container",
            html: demo
                ? `<span style="
                    display:flex;
                    width:28px;
                    height:28px;
                    align-items:center;
                    justify-content:center;
                    border:2px solid #e5c78e;
                    border-radius:50%;
                    background:#8c6b38;
                    color:#fff8e8;
                    font:bold 12px Georgia,serif;
                    box-shadow:0 2px 6px #241b1640;
                ">?</span>`
                : `<img
                    src="event.png"
                    alt=""
                    style="
                        display:block;
                        width:32px;
                        height:32px;
                        border-radius:50%;
                        object-fit:cover;
                        border:2px solid #702e2b;
                        box-shadow:none;
                    "
                >`,
            iconSize: demo ? [32, 32] : [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });
    }


    function popupHTML(event) {
        const published = isPublished(event);

        const label = published
            ? `<a
            class="popup-demo"
            href="${escapeHTML(event.sourceUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: underline; cursor: pointer;"
          >FUENTE OFICIAL ↗</a>`
            : '<span class="popup-demo">POR VERIFICAR</span>';

        return `
        <div class="popup-title">${escapeHTML(event.name)}</div>
        <div>${escapeHTML(event.city)}, ${escapeHTML(event.country)}</div>
        <p>${escapeHTML(eventDateLabel(event))}</p>
        ${label}
    `;
    }

    function initializeMap() {
        if (typeof L === "undefined") {
            document.getElementById("result-count").textContent =
                "No se pudo cargar el mapa";

            document.getElementById("map").textContent =
                "No se ha podido cargar el mapa. Comprueba tu conexión.";

            return false;
        }

        map = L.map("map", {
            scrollWheelZoom: false
        }).setView([49.5, 10], 4);

        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 18,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
            }
        ).addTo(map);

        markerLayer = L.layerGroup().addTo(map);

        return true;
    }

    function fillFilters() {
        const countries = [...new Set(
            events.filter(validEvent).map((event) => event.country)
        )].sort((a, b) => a.localeCompare(b, "es"));

        const countrySelect = el("country");

        countries.forEach((country) => {
            const option = document.createElement("option");
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });

        const years = [...new Set(
            events
                .filter((event) => !event.demo)
                .map((event) => parseDate(event.dateStart))
                .filter(Boolean)
                .map((date) => date.getUTCFullYear())
        )].sort((a, b) => b - a);

        years.forEach((year) => {
            const option = document.createElement("option");
            option.value = String(year);
            option.textContent = String(year);
            el("year").appendChild(option);
        });
    }

    function getFilteredEvents() {
        const search = el("search").value.trim().toLocaleLowerCase("es");
        const country = el("country").value;
        const category = el("category").value;
        const year = el("year").value;

        return events.filter((event) => {
            if (!validEvent(event)) return false;

            const haystack = [
                event.name,
                event.city,
                event.country,
                event.description,
                event.organizer
            ].join(" ").toLocaleLowerCase("es");

            if (search && !haystack.includes(search)) return false;
            if (country && event.country !== country) return false;
            if (category && event.category !== category) return false;

            if (year) {
                const start = parseDate(event.dateStart);
                const end = parseDate(event.dateEnd || event.dateStart);
                const targetYear = Number(year);

                if (!start || !end) return false;

                if (
                    start.getUTCFullYear() > targetYear ||
                    end.getUTCFullYear() < targetYear
                ) return false;
            }

            return true;
        });
    }

    function cardHTML(event) {
        const demo = event.demo === true || !isPublished(event);
        const category = categoryNames[event.category] || "Recreación romana";

        const sourceLink = isPublished(event)
            ? `<a href="${escapeHTML(event.sourceUrl)}"
          target="_blank" rel="noopener noreferrer">Fuente oficial ↗</a>`
            : "";

        const organizer = event.organizer
            ? `<p class="event-location">Organiza: ${escapeHTML(event.organizer)}</p>`
            : "";

        return `
      <article class="event-card">
        <div class="event-tags">
          <span class="tag">${escapeHTML(category)}</span>
          ${demo
                ? '<span class="tag demo">NO CONFIRMADO</span>'
                : '<span class="tag">FUENTE APORTADA</span>'}
        </div>
        <h3>${escapeHTML(event.name)}</h3>
        <p class="event-location">
          ⌖ ${escapeHTML(event.city)}, ${escapeHTML(event.country)}
        </p>
        ${organizer}
        <p class="event-description">
          ${escapeHTML(event.description || "Sin descripción disponible.")}
        </p>
        <div class="event-date">${escapeHTML(eventDateLabel(event))}</div>
        <div class="event-actions">
          <button type="button" data-focus="${escapeHTML(event.id)}">
            Ver en el mapa ↗
          </button>
          ${sourceLink}
        </div>
      </article>
    `;
    }

    function render() {
        const filtered = getFilteredEvents();

        resultCount.textContent =
            `${filtered.length} ${filtered.length === 1 ? "ficha" : "fichas"}`;

        list.innerHTML = filtered.map(cardHTML).join("");
        emptyState.hidden = filtered.length !== 0;

        markerLayer.clearLayers();
        markersById = new Map();

        filtered.forEach((event) => {
            const marker = L.marker([event.lat, event.lng], {
                icon: createMarkerIcon(event),
                title: event.name,
                alt: event.name
            });

            marker.bindPopup(popupHTML(event));
            marker.addTo(markerLayer);
            markersById.set(event.id, marker);
        });
    }

    function focusEvent(id) {
        const event = events.find((item) => item.id === id);
        const marker = markersById.get(id);

        if (!event || !marker || !map) return;

        map.flyTo([event.lat, event.lng], 8, { duration: 0.6 });
        marker.openPopup();

        el("map").scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function resetFilters() {
        el("search").value = "";
        el("country").value = "";
        el("category").value = "";
        el("year").value = "";
        render();
    }

    function start() {
        if (!initializeMap()) return;

        fillFilters();
        render();

        ["search", "country", "category", "year"].forEach((id) => {
            el(id).addEventListener("input", render);
            el(id).addEventListener("change", render);
        });

        el("reset").addEventListener("click", resetFilters);

        list.addEventListener("click", (event) => {
            const button = event.target.closest("[data-focus]");
            if (button) focusEvent(button.dataset.focus);
        });

        window.addEventListener("resize", () => {
            map.invalidateSize();
        });
    }

    start();
})();