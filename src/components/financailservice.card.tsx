import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  statusLabel: string;
  description: string;
  buttonLabel?: string;
  href: string;
  Icon: LucideIcon;
};

export default function FinanacialServiceCard({
  title,
  statusLabel,
  description,
  buttonLabel = "Apply Now",
  href,
  Icon,
}: Props) {
  return (
    <div
      className="p-5 rounded-2xl
      bg-linear-to-br from-[#0f1c2e] to-[#13243b]
      border border-white/5
      shadow-[0_8px_30px_rgba(0,0,0,0.45)]
      backdrop-blur-xl
      text-white"
    >
      {/* Top Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>

          <div>
            <p className="font-semibold">{title}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-5">{description}</p>

      {/* Button */}
      <Link
        href={href}
        className="w-full py-2.5 rounded-xl
        bg-linear-to-r from-blue-500 to-blue-600
        hover:from-blue-600 hover:to-blue-700
        transition-all duration-300
        text-sm font-medium
        shadow-md shadow-blue-900/40 inline-flex items-center justify-center"
      >
        {buttonLabel}
      </Link>
    </div>
  );
}