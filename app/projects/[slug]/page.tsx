import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotionMosaic } from "../../components/MotionMosaic";
import { MotionGrid } from "../../components/MotionGrid";
import { PageVideo } from "../../components/PageVideo";
import { ImageCluster, type Slot } from "../../components/ImageCluster";
import { ProjectMeta } from "../../components/ProjectMeta";
import { Shell } from "../../components/Shell";
import { getProject, projects } from "../../content/projects";
import styles from "../../components/feed.module.css";

// Two tilted images with a portrait clip on top between them (Darwin's Parque Caudal mock).
const TRIO: Slot[] = [
  { x: 0, y: 42, w: 450, rot: -2 },
  { x: 540, y: 18, w: 460, rot: 2 },
  { x: 361, y: 0, w: 277, rot: 0 },
];

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.client} · Darwin Álvarez`, description: p.description };
}

export default async function ProjectPage({ params }: Params) {
  const p = getProject((await params).slug);
  if (!p) notFound();

  let cluster = 0;
  return (
    <Shell page="project">
      <article className={styles.page}>
        <header className={styles.pageHead}>
          <Link href="/" className={styles.back} data-sound-hover="" data-cuelume-tap="">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span className={styles.title}>Projects</span>
          </Link>
        </header>
        <div className={styles.pageBody}>
          <ProjectMeta project={p} withUrl />
          <h1 className={styles.headline}>{p.description}</h1>
          {p.story.map((b, i) => {
            if (b.type === "images")
              return <ImageCluster key={i} images={b.items} layout={b.layout} variant={cluster++} seed={`${p.slug}-${i}`} />;
            if (b.type === "mosaic") return p.mosaic ? <MotionMosaic key={i} clips={p.mosaic} size="page" /> : null;
            if (b.type === "motion") return p.motion ? <MotionGrid key={i} clips={p.motion} size="page" /> : null;
            if (b.type === "trio")
              return (
                <ImageCluster
                  key={i}
                  images={[b.left, b.right, { src: b.video.poster, video: b.video.src, alt: b.video.alt, width: b.video.width, height: b.video.height }]}
                  layout={TRIO}
                  center
                  variant={0}
                  seed={`${p.slug}-${i}`}
                />
              );
            if (b.type === "video") return <PageVideo key={i} {...b} />;
            if (b.type === "h") return <h2 key={i} className={styles.sectionTitle}>{b.text}</h2>;
            return <p key={i} className={styles.paragraph}>{b.text}</p>;
          })}
        </div>
      </article>
    </Shell>
  );
}
