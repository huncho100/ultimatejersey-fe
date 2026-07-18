interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
}: SectionTitleProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2 className="text-4xl font-extrabold text-slate-900">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}