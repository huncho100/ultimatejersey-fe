import { Link } from "react-router-dom";
import { Info } from "lucide-react";

import type { InfoSection } from "../../constants/siteContent";

/**
 * ===========================================
 * Info Sections
 * ===========================================
 *
 * The one way informational content is drawn --
 * help, about, policies, and the policy summary on
 * the product page.
 *
 * Content itself lives in constants/siteContent.ts.
 * Keeping the rendering here means a new section is
 * a data change, and means an unpublished section
 * looks the same wherever it appears rather than
 * being explained away differently on each page.
 */

interface InfoSectionsProps {
  sections: InfoSection[];
}

export default function InfoSections({
  sections,
}: InfoSectionsProps) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <article
          key={section.id}
          id={section.id}
          className="
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
            sm:p-8
          "
        >
          <h2 className="text-2xl font-bold text-slate-900">
            {section.heading}
          </h2>

          {section.paragraphs?.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 leading-7 text-slate-600"
            >
              {paragraph}
            </p>
          ))}

          {section.bullets &&
            section.bullets.length > 0 && (
              <ul className="mt-4 space-y-3">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-3 leading-7 text-slate-600"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                    />

                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

          {/*
            Said plainly, and in a shape that reads as
            a gap rather than as small print under an
            answer -- because there is no answer yet.
          */}
          {section.awaiting && (
            <div
              className="
                mt-5
                flex
                gap-3
                rounded-xl
                border
                border-amber-200
                bg-amber-50
                p-4
              "
            >
              <Info
                size={20}
                className="mt-0.5 shrink-0 text-amber-600"
                aria-hidden="true"
              />

              <p className="text-sm leading-6 text-amber-900">
                {section.awaiting}
              </p>
            </div>
          )}

          {section.links &&
            section.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="
                      font-semibold
                      text-blue-600
                      underline-offset-4
                      transition-colors
                      hover:text-blue-700
                      hover:underline
                    "
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
        </article>
      ))}
    </div>
  );
}
