import type { ReactNode } from "react";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import InfoSections from "./InfoSections";

import type { InfoSection } from "../../constants/siteContent";

/**
 * ===========================================
 * Info Page
 * ===========================================
 *
 * The page frame the informational routes share --
 * Help, About Ultimate Kits, Shipping & Returns.
 *
 * They differ only in their content, so they are
 * three small files pointing at this rather than
 * three copies of the same layout drifting apart.
 */

interface InfoPageProps {
  title: string;

  subtitle?: string;

  sections: InfoSection[];

  /** Anything to close the page with. */
  children?: ReactNode;
}

export default function InfoPage({
  title,
  subtitle,
  sections,
  children,
}: InfoPageProps) {
  return (
    <section className="min-h-screen bg-slate-50 py-12">
      <Container>

        <SectionTitle
          title={title}
          subtitle={subtitle}
          align="left"
        />

        <div className="mt-10 max-w-3xl">

          <InfoSections sections={sections} />

          {children}

        </div>

      </Container>
    </section>
  );
}
