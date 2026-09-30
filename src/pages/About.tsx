import InfoPage from "../components/info/InfoPage";

import { ABOUT_SECTIONS } from "../constants/siteContent";

export default function About() {
  return (
    <InfoPage
      title="About Ultimate Kits"
      subtitle="What we sell and how the store works."
      sections={ABOUT_SECTIONS}
    />
  );
}
