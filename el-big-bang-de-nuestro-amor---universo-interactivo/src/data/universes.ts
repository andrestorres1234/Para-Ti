export interface UniverseItem {
  id: number;
  name: string;
  subtitle: string;
  emoji: string;
  shortMessage: string;
  fullLetter: string[];
  type: 'galaxy' | 'nebula' | 'planet' | 'constellation' | 'pulsar';
  coordinates: { x: number; y: number };
  color: {
    primary: string;
    secondary: string;
    glow: string;
    accent: string;
    bgRing?: string;
  };
  stats: {
    distance: string;
    luminosity: string;
    gravity: string;
  };
  soundPitch: number;
}

export const INITIAL_UNIVERSES: UniverseItem[] = [
  {
    id: 1,
    name: "Donde empezó todo",
    subtitle: "El inicio",
    emoji: "💫",
    shortMessage: "Desde el primer día supe que contigo todo iba a ser diferente.",
    fullLetter: [
      "Desde el primer día supe que contigo todo iba a ser diferente.",
      "No importa en qué rincón del universo me encuentre; cuando estoy a tu lado, todo el ruido de afuera se apaga.",
      "Si me dieran a elegir entre viajar a mil planetas desconocidos o quedarme contigo, te elegiría mil veces."
    ],
    type: "planet",
    coordinates: { x: 50, y: 13 },
    color: {
      primary: "#ff82c6",
      secondary: "#f472b6",
      glow: "rgba(255, 130, 198, 0.65)",
      accent: "#fce7f3"
    },
    stats: {
      distance: "El primer día",
      luminosity: "Luz de inicio",
      gravity: "Atracción instantánea"
    },
    soundPitch: 1.0
  },
  {
    id: 2,
    name: "Tu risa hermosa",
    subtitle: "Su sonrisa / belleza",
    emoji: "✨",
    shortMessage: "Tienes la risa más linda del mundo y el poder de alegrarme cualquier día.",
    fullLetter: [
      "Tienes la risa más linda del mundo y el poder de alegrarme cualquier día.",
      "Cuando te ríes con ganas, iluminas hasta el día más gris que yo haya tenido.",
      "Cuidar esa sonrisa es de mis cosas favoritas en la vida."
    ],
    type: "planet",
    coordinates: { x: 72, y: 23 },
    color: {
      primary: "#ffba6b",
      secondary: "#f59e0b",
      glow: "rgba(255, 186, 107, 0.65)",
      accent: "#fef3c7"
    },
    stats: {
      distance: "En tu sonrisa",
      luminosity: "Más que el sol",
      gravity: "Magia pura"
    },
    soundPitch: 1.08
  },
  {
    id: 3,
    name: "Mi refugio favorito",
    subtitle: "Tu lugar seguro",
    emoji: "🌙",
    shortMessage: "No importa qué tan pesado haya sido el día, un abrazo tuyo me reinicia la vida.",
    fullLetter: [
      "No importa qué tan pesado haya sido el día, un abrazo tuyo me reinicia la vida.",
      "Hay días en los que el mundo pesa, pero basta un abrazo tuyo para sentir paz.",
      "Gracias por ser mi lugar seguro cuando todo parece complicado."
    ],
    type: "planet",
    coordinates: { x: 84, y: 43 },
    color: {
      primary: "#9b8cff",
      secondary: "#818cf8",
      glow: "rgba(155, 140, 255, 0.65)",
      accent: "#ede9fe"
    },
    stats: {
      distance: "A un abrazo",
      luminosity: "Calma de luna",
      gravity: "Paz que restaura"
    },
    soundPitch: 1.15
  },
  {
    id: 4,
    name: "Nuestras bobadas",
    subtitle: "Un chiste interno",
    emoji: "🧸",
    shortMessage: "Amo que podamos reírnos de cualquier tontería como dos niños chiquitos.",
    fullLetter: [
      "Amo que podamos reírnos de cualquier tontería como dos niños chiquitos.",
      "Esas bromas y ocurrencias que solo nosotros dos entendemos no las cambio por nada.",
      "Nuestra complicidad hace que cada momento juntos sea especial."
    ],
    type: "planet",
    coordinates: { x: 77, y: 69 },
    color: {
      primary: "#69d9ff",
      secondary: "#38bdf8",
      glow: "rgba(105, 217, 255, 0.65)",
      accent: "#e0f2fe"
    },
    stats: {
      distance: "Risas compartidas",
      luminosity: "Alegría pura",
      gravity: "Complicidad única"
    },
    soundPitch: 1.22
  },
  {
    id: 5,
    name: "La mujer que admiro",
    subtitle: "Lo que admiras",
    emoji: "💎",
    shortMessage: "Admiro tus ganas de salir adelante, tu corazón noble y la persona increíble que eres.",
    fullLetter: [
      "Admiro tus ganas de salir adelante, tu corazón noble y la persona increíble que eres.",
      "Veo tu esfuerzo, tu sensibilidad y la mujer maravillosa que eres.",
      "Siempre estaré aquí para aplaudir y apoyar cada una de tus metas."
    ],
    type: "planet",
    coordinates: { x: 60, y: 84 },
    color: {
      primary: "#fb7185",
      secondary: "#f43f5e",
      glow: "rgba(251, 113, 133, 0.65)",
      accent: "#ffe4e6"
    },
    stats: {
      distance: "En tu corazón",
      luminosity: "Brillo incondicional",
      gravity: "Admiración total"
    },
    soundPitch: 1.3
  },
  {
    id: 6,
    name: "Mi mejor equipo",
    subtitle: "Complicidad",
    emoji: "🪐",
    shortMessage: "Gracias por estar en las buenas y en las no tan buenas. Contigo voy a todas.",
    fullLetter: [
      "Gracias por estar en las buenas y en las no tan buenas. Contigo voy a todas.",
      "Tenerte como compañera de vida hace que ningún reto dé miedo.",
      "Juntos somos el mejor equipo de este universo."
    ],
    type: "planet",
    coordinates: { x: 36, y: 84 },
    color: {
      primary: "#78e5ce",
      secondary: "#2dd4bf",
      glow: "rgba(120, 229, 206, 0.65)",
      accent: "#ccfbf1"
    },
    stats: {
      distance: "Lado a lado",
      luminosity: "Fuerza mutua",
      gravity: "Unión inquebrantable"
    },
    soundPitch: 1.38
  },
  {
    id: 7,
    name: "Lo simple contigo",
    subtitle: "Los momentos simples",
    emoji: "☕",
    shortMessage: "Cualquier plan contigo se convierte en mi favorito, incluso no hacer nada.",
    fullLetter: [
      "Cualquier plan contigo se convierte en mi favorito, incluso no hacer nada.",
      "Las tardes de charlas, las caminatas sin prisa y simplemente estar juntos.",
      "En lo sencillo es donde vive la magia más bonita de nuestro amor."
    ],
    type: "planet",
    coordinates: { x: 19, y: 68 },
    color: {
      primary: "#f0a5ff",
      secondary: "#e879f9",
      glow: "rgba(240, 165, 255, 0.65)",
      accent: "#fae8ff"
    },
    stats: {
      distance: "En lo cotidiano",
      luminosity: "Ternura viva",
      gravity: "Calidez constante"
    },
    soundPitch: 1.45
  },
  {
    id: 8,
    name: "Un año que voló",
    subtitle: "El tiempo vuela",
    emoji: "🚀",
    shortMessage: "Parece que fue ayer cuando empezamos, pero qué increíble ha sido cada mes a tu lado.",
    fullLetter: [
      "Parece que fue ayer cuando empezamos, pero qué increíble ha sido cada mes a tu lado.",
      "Este primer año pasó volando porque a tu lado cada día es un regalo.",
      "Gracias por hacer que 365 días se sientan como el mejor suspiro."
    ],
    type: "planet",
    coordinates: { x: 15, y: 43 },
    color: {
      primary: "#7da7ff",
      secondary: "#60a5fa",
      glow: "rgba(125, 167, 255, 0.65)",
      accent: "#dbeafe"
    },
    stats: {
      distance: "365 días",
      luminosity: "Tiempo de oro",
      gravity: "Amor en aceleración"
    },
    soundPitch: 1.52
  },
  {
    id: 9,
    name: "Lo que nos falta",
    subtitle: "El futuro",
    emoji: "🔮",
    shortMessage: "Esto apenas es el comienzo; quiero seguir construyendo recuerdos y metas contigo.",
    fullLetter: [
      "Esto apenas es el comienzo; quiero seguir construyendo recuerdos y metas contigo.",
      "Sueño con viajar a nuevos lugares, celebrar tus triunfos y acompañarte en todo.",
      "Lo mejor de nuestra historia todavía está por escribirse."
    ],
    type: "planet",
    coordinates: { x: 28, y: 23 },
    color: {
      primary: "#ffe28a",
      secondary: "#facc15",
      glow: "rgba(255, 226, 138, 0.65)",
      accent: "#fef9c3"
    },
    stats: {
      distance: "Hacia el futuro",
      luminosity: "Ilusión infinita",
      gravity: "Destino compartido"
    },
    soundPitch: 1.6
  },
  {
    id: 10,
    name: "Mi amor por ti",
    subtitle: "La gran promesa",
    emoji: "❤️‍🔥",
    shortMessage: "Feliz primer año, mi amor. Te elijo hoy y te elegiría mil veces más. Te amo con mi vida entera.",
    fullLetter: [
      "Feliz primer año, mi amor. Te elijo hoy y te elegiría mil veces más. Te amo con mi vida entera.",
      "Esta es la promesa más sincera: te amo por quien eres y por todo lo que somos.",
      "Eres, sin duda alguna, mi universo favorito hoy y siempre. ❤️"
    ],
    type: "planet",
    coordinates: { x: 50, y: 50 },
    color: {
      primary: "#ff8acb",
      secondary: "#ec4899",
      glow: "rgba(255, 138, 203, 0.75)",
      accent: "#fce7f3"
    },
    stats: {
      distance: "Para siempre",
      luminosity: "Fuego eterno",
      gravity: "Amor indestructible"
    },
    soundPitch: 1.7
  }
];

export interface DedicationConfig {
  partnerName: string;
  senderName: string;
  specialDate: string;
  customTitle: string;
  kickerText: string;
  leadText: string;
  noteText: string;
}

export const DEFAULT_DEDICATION: DedicationConfig = {
  partnerName: "Mi persona favorita",
  senderName: "Tu novio",
  specialDate: "Nuestro primer año",
  customTitle: "Un universo para ti ✦",
  kickerText: "Para mi persona favorita · Nuestro primer año",
  leadText: "Si el universo es infinito, imagina todas las formas que existen de amar. Hoy te quiero mostrar diez pequeñas razones por las que mi mundo es más bonito desde que estás en él. Toca un planeta, amor. 💗",
  noteText: "¿Sabes qué es lo más bonito de todo esto? No necesito conocer cada rincón del universo para saber dónde quiero estar. Me basta con seguir descubriendo la vida contigo, un día a la vez. ❤️"
};
