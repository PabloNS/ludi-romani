/*
 * LUDI ROMANI EUROPA — catálogo de eventos
 *
 * Las entradas con demo: true son marcadores de prueba.
 * No representan festivales confirmados.
 *
 * Para publicar un evento real:
 * - Completa dateStart y dateEnd con fechas YYYY-MM-DD.
 * - Incluye una sourceUrl pública y verificable.
 * - Cambia demo a false.
 * - Comprueba las coordenadas y el lugar.
 */

window.ROMAN_EVENTS = [
    {
        id: "demo-tarraco-viva",
        name: "Recreación romana en Tarraco",
        city: "Tarragona",
        country: "España",
        lat: 41.1189,
        lng: 1.2445,
        category: "festival",
        dateStart: "2026-05-11",
        dateEnd: "2026-05-24",
        description:
            "Ficha de demostración para un posible evento de recreación romana en el entorno histórico de Tarraco.",
        organizer: "Tarraco Viva",
        sourceUrl: "https://tarracoviva.com/es/",
        demo: false
    },
    {
        id: "demo-emerita-lvdica",
        name: "Recreación romana en Emerita Augusta",
        city: "Mérida",
        country: "España",
        lat: 38.91802,
        lng: -6.34292,
        category: "festival",
        dateStart: "2026-05-18",
        dateEnd: "2026-05-24",
        description:
            "Ficha de demostración para un posible evento de recreación romana en el entorno histórico de Tarraco.",
        organizer: "Emerita Lvdica",
        sourceUrl: "https://emerita-lvdica.es/",
        demo: false
    },
    {
        id: "demo-rome",
        name: "Jornadas de historia romana",
        city: "Roma",
        country: "Italia",
        lat: 41.8902,
        lng: 12.4922,
        category: "living-history",
        dateStart: "",
        dateEnd: "",
        description:
            "Ficha de ejemplo para actividades de historia viva y divulgación de la antigua Roma.",
        organizer: "",
        sourceUrl: "",
        demo: true
    },
    {
        id: "demo-nimes",
        name: "Encuentro de legiones",
        city: "Nimes",
        country: "Francia",
        lat: 43.8367,
        lng: 4.3601,
        category: "military",
        dateStart: "",
        dateEnd: "",
        description:
            "Marcador de prueba para mostrar una posible ficha de recreación militar romana.",
        organizer: "",
        sourceUrl: "",
        demo: true
    },
    {
        id: "demo-xanten",
        name: "Campamento romano",
        city: "Xanten",
        country: "Alemania",
        lat: 51.6588,
        lng: 6.4538,
        category: "military",
        dateStart: "",
        dateEnd: "",
        description:
            "Ejemplo de ficha para un encuentro de recreadores en un entorno arqueológico romano.",
        organizer: "",
        sourceUrl: "",
        demo: true
    },
    {
        id: "demo-carnuntum",
        name: "Vida cotidiana en Roma",
        city: "Petronell-Carnuntum",
        country: "Austria",
        lat: 48.1095,
        lng: 16.8647,
        category: "living-history",
        dateStart: "",
        dateEnd: "",
        description:
            "Marcador de demostración para actividades de vida cotidiana, artesanía e historia viva.",
        organizer: "",
        sourceUrl: "",
        demo: true
    },
    {
        id: "demo-southwark",
        name: "Gladiadores y espectáculos",
        city: "Londres",
        country: "Reino Unido",
        lat: 51.5079,
        lng: -0.0877,
        category: "gladiators",
        dateStart: "",
        dateEnd: "",
        description:
            "Ficha de ejemplo para una actividad divulgativa sobre gladiadores y espectáculos romanos.",
        organizer: "",
        sourceUrl: "",
        demo: true
    }
];