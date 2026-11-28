import Site from "@/components/Site";
import { config } from "@/content/profile";
// The home page uses config.theme. Other presets live at /<theme> (see app/[variant]).
export default function Home() {
  return <Site theme={config.theme} />;
}
