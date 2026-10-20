(() => {
    "use strict";

    const el = (id) => document.getElementById(id);

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function safeExternalURL(value) {
        try {
            const url = new URL(value);

            if (url.protocol === "https:" || url.protocol === "http:") {
                return url.href;
            }
        } catch {
        }

        return "";
    }

    function fillCountryOptions(selectId, items) {
        const select = el(selectId);
        if (!select) return;

        const previousValue = select.value;

        const countries = [...new Set(
            items.map((item) => item.country?.trim()).filter(Boolean)
        )].sort((a, b) => a.localeCompare(b, "es"));

        select.innerHTML = `
            <option value="">Todos los países</option>
            ${countries.map((country) => `
                <option value="${escapeHTML(country)}">${escapeHTML(country)}</option>
            `).join("")}
        `;

        if (countries.includes(previousValue)) {
            select.value = previousValue;
        }
    }

    function renderAssociations() {
        const select = el("association-country");
        const container = el("association-list");
        const empty = el("association-empty");
        const count = el("association-count");

        if (!select || !container || !empty || !count) return;

        const associations = Array.isArray(window.ROMAN_ASSOCIATIONS)
            ? window.ROMAN_ASSOCIATIONS
            : [];

        const country = select.value;

        const filtered = country
            ? associations.filter((item) => item.country?.trim() === country)
            : associations;

        count.textContent =
            `${filtered.length} ${filtered.length === 1 ? "asociación" : "asociaciones"}`;

        container.innerHTML = filtered.map((item) => {
            const website = safeExternalURL(item.website);
            const instagram = safeExternalURL(item.instagram);

            return `
                <article class="directory-card">
                    <p class="eyebrow">${escapeHTML(item.category || "Recreación romana")}</p>
                    <h3>${escapeHTML(item.name)}</h3>
                    <p class="event-location">
                        ${escapeHTML(item.city || "")}${item.city && item.country ? ", " : ""}${escapeHTML(item.country || "")}
                    </p>
                    <p>${escapeHTML(item.description || "")}</p>
                    <div class="directory-actions">
                        ${website ? `
                            <a class="directory-link" href="${escapeHTML(website)}"
                               target="_blank" rel="noopener noreferrer">WEB OFICIAL ↗</a>
                        ` : ""}
                        ${instagram ? `
                            <a class="directory-link" href="${escapeHTML(instagram)}"
                               target="_blank" rel="noopener noreferrer">INSTAGRAM ↗</a>
                        ` : ""}
                    </div>
                </article>
            `;
        }).join("");

        empty.hidden = filtered.length > 0;
    }

    function renderShops() {
        const select = el("shop-country");
        const container = el("shop-list");
        const empty = el("shop-empty");
        const count = el("shop-count");

        if (!select || !container || !empty || !count) return;

        const shops = Array.isArray(window.ROMAN_SHOPS)
            ? window.ROMAN_SHOPS
            : [];

        const country = select.value;

        const filtered = country
            ? shops.filter((item) => item.country?.trim() === country)
            : shops;

        count.textContent =
            `${filtered.length} ${filtered.length === 1 ? "tienda" : "tiendas"}`;

        container.innerHTML = filtered.map((item) => {
            const website = safeExternalURL(item.website);

            return `
                <article class="directory-card shop-card">
                    <span class="shop-label">
                        ${item.sponsored === true ? "PATROCINADO" : "TIENDA DEL DIRECTORIO"}
                    </span>
                    <p class="eyebrow">${escapeHTML(item.category || "Recreación histórica")}</p>
                    <h3>${escapeHTML(item.name)}</h3>
                    <p class="event-location">${escapeHTML(item.country || "")}</p>
                    <p>${escapeHTML(item.description || "")}</p>
                    ${website ? `
                        <a class="directory-link" href="${escapeHTML(website)}"
                           target="_blank"
                           rel="noopener noreferrer${item.sponsored === true ? " sponsored" : ""}">
                           VISITAR TIENDA ↗
                        </a>
                    ` : ""}
                </article>
            `;
        }).join("");

        empty.hidden = filtered.length > 0;
    }

    function start() {
        if (window.RomanEventsCommon) {
            window.RomanEventsCommon.init({ showCards: false });
        } else {
            console.error("No se ha cargado events-common.js");
        }

        const associations = Array.isArray(window.ROMAN_ASSOCIATIONS)
            ? window.ROMAN_ASSOCIATIONS
            : [];

        const shops = Array.isArray(window.ROMAN_SHOPS)
            ? window.ROMAN_SHOPS
            : [];

        if (el("association-country")) {
            fillCountryOptions("association-country", associations);
            renderAssociations();
            el("association-country").addEventListener("change", renderAssociations);
        }

        if (el("shop-country")) {
            fillCountryOptions("shop-country", shops);
            renderShops();
            el("shop-country").addEventListener("change", renderShops);
        }
    }

    start();
})();
