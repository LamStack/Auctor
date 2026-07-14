import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCurrentCompany } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { LogoutButton } from "@/components/dashboard/LogoutButton";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/tracks", label: "Assessment tracks" },
  { href: "/dashboard/candidates", label: "Candidates" },
  { href: "/dashboard/packages", label: "Packages" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const company = await getCurrentCompany();
  if (!company) redirect("/login");

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image src="/Auctorlogo-transparent.png" alt="AUCTOR" width={32} height={32} className="rounded-md" />
            <span className="font-display text-base font-bold text-ink">AUCTOR</span>
          </Link>
          <div className="flex items-center gap-4">
            <Badge tone="accent">{company.credits?.assessmentsRemaining ?? 0} assessments left</Badge>
            <span className="hidden text-sm font-medium text-muted sm:inline">{company.name}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <aside className="w-56 shrink-0">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-ink hover:bg-brand-50 hover:text-brand-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
