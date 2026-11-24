import type { Brand } from "../content/profile";
import {
  CoverbaseLogo,
  FigmaLogo,
  FigmaMono,
  MercadoLibreColor,
  MercadoLibreMono,
  RainforestLogo,
  RedValleyLogo,
  ToptalLogo,
} from "./logos";
import { CoverbaseLoop } from "./CoverbaseLoop";
import styles from "./panel.module.css";

/**
 * A 40px logo slot with two layers: the muted white version (default) and the
 * brand-color version, which fades in when the parent row is hovered or active.
 */
export function BrandMark({ brand, id }: { brand: Brand; id: string }) {
  let mono: React.ReactNode;
  let color: React.ReactNode;

  switch (brand) {
    case "coverbase":
      mono = <CoverbaseLogo id={`${id}-m`} className={styles.silhouette} />;
      color = (
        <>
          <CoverbaseLogo id={`${id}-c`} />
          <CoverbaseLoop size={24} className={styles.loopRow} />
        </>
      );
      break;
    case "mercadolibre":
      mono = <MercadoLibreMono className={styles.mono} />;
      color = <MercadoLibreColor />;
      break;
    case "toptal":
      mono = <ToptalLogo className={styles.silhouette} />;
      color = <ToptalLogo />;
      break;
    case "redvalley":
      mono = <RedValleyLogo className={styles.silhouette} />;
      color = <RedValleyLogo />;
      break;
    case "figma":
      mono = <FigmaMono className={styles.mono} />;
      color = <FigmaLogo />;
      break;
    case "rainforest":
      mono = <RainforestLogo className={styles.silhouette} />;
      color = <RainforestLogo />;
      break;
  }

  return (
    <span className={styles.mark}>
      <span className={styles.markMono}>{mono}</span>
      <span className={styles.markColor}>{color}</span>
    </span>
  );
}
