import { ProjectsFeed } from "./components/ProjectsFeed";
import { Shell } from "./components/Shell";

export default function Home() {
  return (
    <Shell>
      <ProjectsFeed />
    </Shell>
  );
}
