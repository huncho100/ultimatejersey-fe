import InfoPage from "../components/info/InfoPage";

import { HELP_SECTIONS } from "../constants/siteContent";

export default function Help() {
  return (
    <InfoPage
      title="Help"
      subtitle="Ordering, paying, and getting your account working."
      sections={HELP_SECTIONS}
    />
  );
}
