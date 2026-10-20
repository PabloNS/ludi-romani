(() => {
    "use strict";

    if (!document.getElementById("event-list")) {
        console.error("No se encuentra #event-list en events-list.html");
        return;
    }

    if (!window.RomanEventsCommon) {
        console.error("No se ha cargado events-common.js");
        return;
    }

    window.RomanEventsCommon.init({ showCards: true });
})();
