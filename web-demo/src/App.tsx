import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import MdiIcon from "@/components/Icon";
import PhoneFrame from "@/components/PhoneFrame";
import MiCultivoApp from "@/app/MiCultivoApp";
import { themeToCssVars, type ColorScheme } from "@/theme/colors";

const GITHUB_URL = "https://github.com/BrahianCarrera/IoT-Project";

const FEATURES = [
  {
    icon: "home",
    title: "Inicio",
    subtitle: "Monitoreo en tiempo real",
    description:
      "Temperatura, humedad del aire y del suelo, pH y nivel de agua con estados óptimos/alerta, estado de bomba y válvula, y última conexión.",
  },
  {
    icon: "history",
    title: "Historial",
    subtitle: "Últimas 50 lecturas",
    description:
      "Gráficas de tendencias por métrica con vista detallada a pantalla completa y el listado cronológico de cada medición registrada.",
  },
  {
    icon: "pipe-valve",
    title: "Control",
    subtitle: "Panel de dispositivos",
    description:
      "Enciende la bomba de riego, abre la válvula de llenado o solicita una lectura del sensor de pH bajo demanda.",
  },
];

const STACK = [
  "React Native",
  "Expo SDK 53",
  "Expo Router",
  "TypeScript",
  "react-native-paper (Material 3)",
  "react-native-chart-kit",
  "Firebase Realtime Database",
];

export default function App() {
  const [scheme, setScheme] = useState<ColorScheme>("light");

  const themeVars = useMemo(() => themeToCssVars(scheme), [scheme]);

  return (
    <div className="showcase">
      <header className="showcase-header">
        <a className="showcase-brand" href="#top">
          <img src="logo.png" alt="Mi Cultivo" width={34} height={34} />
          <span>Mi Cultivo</span>
        </a>
        <nav className="showcase-nav">
          <a href="#funcionalidad">Funcionalidad</a>
          <a href="#stack">Stack</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__copy">
            <span className="eyebrow">Demo interactiva · Portfolio</span>
            <h1>
              Mi Cultivo<span className="accent">.</span>
            </h1>
            <p className="hero__lead">
              Sistema IoT de monitoreo y control para cultivos hidropónicos.
            </p>
            <p className="hero__desc">
              Aplicación móvil desarrollada con React&nbsp;Native y Expo que
              recibe datos de sensores en tiempo real a través de Firebase.
              Esta demo recrea la experiencia original —pantallas, estilo y
              comportamiento— con un backend simulado local: sin credenciales,
              sin dispositivos y sin servicios externos.
            </p>

            <div className="badge-row">
              <span className="badge">React Native</span>
              <span className="badge">Expo</span>
              <span className="badge">TypeScript</span>
              <span className="badge">Material 3</span>
              <span className="badge badge--mock">Firebase simulado</span>
            </div>

            <div className="hero__actions">
              <a
                className="btn btn--primary"
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
              >
                <MdiIcon name="github" size={18} />
                Ver código
              </a>
              <a className="btn btn--ghost" href="#funcionalidad">
                Explorar funciones
                <MdiIcon name="chevron-right" size={18} />
              </a>
            </div>

            <ul className="hero__hints">
              <li>
                <MdiIcon name="gesture-tap" size={16} /> Toca las pestañas
                inferiores
              </li>
              <li>
                <MdiIcon name="power-plug" size={16} /> Activa bomba y válvula
                en Control
              </li>
              <li>
                <MdiIcon name="chart-line" size={16} /> Los datos se actualizan
                solos
              </li>
            </ul>
          </div>

          <div className="hero__phone">
            <div className="phone-toolbar">
              <span className="phone-toolbar__live">
                <span className="live-dot" />
                Demo en vivo · datos simulados
              </span>
              <button
                type="button"
                className="theme-toggle"
                onClick={() =>
                  setScheme((current) => (current === "light" ? "dark" : "light"))
                }
                aria-label="Cambiar tema de la app"
              >
                <MdiIcon
                  name={scheme === "light" ? "weather-night" : "weather-sunny"}
                  size={18}
                />
                {scheme === "light" ? "Oscuro" : "Claro"}
              </button>
            </div>

            <PhoneFrame scheme={scheme}>
              <div
                className="app-theme"
                data-scheme={scheme}
                style={themeVars as CSSProperties}
              >
                <MiCultivoApp />
              </div>
            </PhoneFrame>

            <p className="phone-caption">
              La app original — <strong>Inicio</strong>,{" "}
              <strong>Historial</strong> y <strong>Control</strong> — corriendo
              en el navegador
            </p>
          </div>
        </section>

        <section className="features" id="funcionalidad">
          <div className="section-heading">
            <span className="eyebrow">Qué hace la aplicación</span>
            <h2>Tres pantallas, un cultivo bajo control</h2>
          </div>

          <div className="features__grid">
            {FEATURES.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-card__icon">
                  <MdiIcon name={feature.icon} size={26} />
                </div>
                <span className="feature-card__tab">{feature.title}</span>
                <h3>{feature.subtitle}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="stack" id="stack">
          <div className="section-heading">
            <span className="eyebrow">Tecnologías</span>
            <h2>Stack del proyecto original</h2>
          </div>

          <div className="stack__chips">
            {STACK.map((item) => (
              <span className="stack-chip" key={item}>
                {item}
              </span>
            ))}
          </div>

          <div className="stack__note">
            <MdiIcon name="database" size={20} />
            <p>
              En el repositorio original, los datos provienen de{" "}
              <strong>Firebase Realtime Database</strong>. Para esta demo, el
              backend está simulado tras la misma API de lectura/escritura{" "}
              <code>ref / onValue / set</code>, por lo que puede sustituirse
              por el SDK real sin modificar las pantallas ni los hooks.
            </p>
          </div>
        </section>
      </main>

      <footer className="showcase-footer">
        <div className="showcase-footer__brand">
          <img src="logo.png" alt="" width={34} height={34} />
          <div>
            <strong>Mi Cultivo</strong>
            <span>Sistema IoT Hidropónico v1.0</span>
          </div>
        </div>
        <p>
          Demo web con fines de portafolio · Los datos mostrados son simulados
          localmente en el navegador.
        </p>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          <MdiIcon name="github" size={18} />
          BrahianCarrera/IoT-Project
        </a>
      </footer>
    </div>
  );
}
