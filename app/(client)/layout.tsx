'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
    LayoutDashboard, ArrowLeftRight, Send, Settings, Wallet, Bell, Menu, X,
    Globe, PiggyBank, Landmark, FileText, CreditCard, LifeBuoy, LogOut, User, ChevronDown, ChevronUp, Settings2
} from "lucide-react";

type UserData = { firstname?: string; lastName?: string; firstName?: string; lastname?: string; email?: string };

type NavSection = {
    title: string;
    items: { href: string; label: string; icon: React.ComponentType<{ size?: number }> }[];
};

const NAV_SECTIONS: NavSection[] = [
    {
        title: "Main Menu",
        items: [
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
        ],
    },
    {
        title: "Transfers",
        items: [
            { href: "/do-transfer", label: "Local Transfer", icon: Send },
            { href: "/international-transfer", label: "International Transfer", icon: Globe },
        ],
    },
    {
        title: "Services",
        items: [
            { href: "/fund-account", label: "Deposit", icon: PiggyBank },
            { href: "/loans", label: "Loan Request", icon: Landmark },
            { href: "/tax-refunds", label: "IRS Tax Refund", icon: FileText },
            { href: "/virtual-cards", label: "Cards", icon: CreditCard },
            { href: "/support-ticket", label: "Support Ticket", icon: LifeBuoy },
        ],
    },
    {
        title: "Account Settings",
        items: [
            { href: "/settings", label: "Settings", icon: Settings },
        ],
    },
];

// Flatten for bottom nav
const BOTTOM_NAV = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/transactions", label: "History", icon: ArrowLeftRight },
    { href: "/do-transfer", label: "Transfer", icon: Send },
    { href: "/fund-account", label: "Deposit", icon: Wallet },
    { href: "/settings", label: "Settings", icon: Settings },
];

// Page titles for the top bar
const PAGE_TITLES: Record<string, string> = {
    "/dashboard": "",
    "/transactions": "Transactions",
    "/do-transfer": "Local Transfer",
    "/international-transfer": "International Transfer",
    "/fund-account": "Fund Account",
    "/loans": "Loans",
    "/tax-refunds": "IRS Tax Refund",
    "/virtual-cards": "Cards",
    "/support-ticket": "Support Ticket",
    "/settings": "Settings",
    "/transfer": "Transfer",
};

function getPageTitle(pathname: string | null): string {
    if (!pathname) return "";
    for (const [key, val] of Object.entries(PAGE_TITLES)) {
        if (pathname === key || (key !== "/dashboard" && pathname.startsWith(key))) return val;
    }
    return "";
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileExpanded, setProfileExpanded] = useState(true);
    const [notifOpen, setNotifOpen] = useState(false);

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) { router.replace("/login"); return; }
        api.get("/api/me").then(res => setUser(res.data)).catch(() => {
            localStorage.removeItem("token");
            router.replace("/login");
        });
    }, [router]);

    const firstName = user?.firstname || user?.firstName || "";
    const lastName = user?.lastname || user?.lastName || "";
    const initials = firstName ? firstName.charAt(0).toUpperCase() : "U";

    const isDashboard = pathname === "/dashboard";
    const pageTitle = getPageTitle(pathname);

    function getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    }

    function handleLogout() {
        api.post("/api/auth/logout").catch(() => { }).finally(() => {
            localStorage.removeItem("token");
            router.push("/");
        });
    }

    function isActive(href: string) {
        return pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
    }

    const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
        <>
            {/* Profile Section */}
            <div className="px-4 py-5 border-b border-slate-800">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setProfileExpanded(p => !p)}
                >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-blue-400/30 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-500/20">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold truncate">{firstName || "Welcome"} {lastName}</p>
                        <p className="text-slate-500 text-xs truncate">{user?.email || ""}</p>
                    </div>
                    {profileExpanded ? <ChevronUp size={16} className="text-slate-500 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
                </div>
                {profileExpanded && (
                    <div className="mt-3 flex gap-2">
                        <Link
                            href="/settings"
                            onClick={onLinkClick}
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
                        >
                            <User size={14} /> Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold py-2.5 rounded-xl border border-red-500/20 transition-colors"
                        >
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-5">
                {NAV_SECTIONS.map((section) => (
                    <div key={section.title}>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">{section.title}</p>
                        <div className="space-y-0.5">
                            {section.items.map(({ href, label, icon: Icon }) => {
                                const active = isActive(href);
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={onLinkClick}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                            ${active
                                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
                                    >
                                        <Icon size={18} />
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="px-6 py-4 border-t border-slate-800">
                <p className="text-xs text-slate-600">St. Georges Trust Bank</p>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white font-sans flex flex-col">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col bg-[#0F172A] border-r border-slate-800 z-30">
                <SidebarContent />
            </aside>

            {/* Mobile drawer overlay */}
            {drawerOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setDrawerOpen(false)}>
                    <div className="absolute left-0 top-0 h-full w-72 bg-[#0F172A] border-r border-slate-800 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800 shrink-0">
                            <p className="text-white font-bold text-sm">Menu</p>
                            <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <SidebarContent onLinkClick={() => setDrawerOpen(false)} />
                    </div>
                </div>
            )}

            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 md:left-64 right-0 z-20 h-16 flex items-center justify-between px-4 md:px-6 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <button onClick={() => setDrawerOpen(true)} className="md:hidden text-slate-400 hover:text-white transition-colors">
                        <Menu size={22} />
                    </button>
                    <div>
                        {isDashboard ? (
                            <div>
                                <p className="text-white text-sm font-semibold">{getGreeting()}, {firstName || "there"}</p>
                                <p className="text-slate-500 text-[11px]">Welcome to your dashboard</p>
                            </div>
                        ) : (
                            <p className="text-white text-base font-bold">{pageTitle || "St. Georges"}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/settings" className="w-9 h-9 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 flex items-center justify-center transition-colors">
                        <Settings2 size={16} className="text-slate-400" />
                    </Link>
                    <button
                        onClick={() => setNotifOpen(true)}
                        className="w-9 h-9 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 flex items-center justify-center transition-colors relative"
                    >
                        <Bell size={16} className="text-slate-400" />
                    </button>
                    <Link href="/settings" className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-blue-400/30 flex items-center justify-center font-bold text-white text-xs ml-1">
                        {initials}
                    </Link>
                </div>
            </header>

            {/* Main content */}
            <main className="md:ml-64 pt-16 flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="md:ml-64 bg-[#0F172A] border-t border-slate-800 py-6 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-slate-600 text-xs">© {new Date().getFullYear()} St. Georges Trust Bank. All rights reserved.</p>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                        <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-slate-400 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>

            {/* Mobile bottom nav */}
            <nav className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#0F172A]/95 border border-slate-700/60 backdrop-blur-md w-[92vw] max-w-md rounded-2xl flex justify-around py-3 px-1 shadow-2xl z-20">
                {BOTTOM_NAV.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link key={href} href={href}
                            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all
                ${active ? "bg-blue-600/20 text-blue-400" : "text-slate-500 hover:text-white"}`}>
                            <Icon size={20} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Notification Modal */}
            {notifOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNotifOpen(false)} />
                    <div className="relative bg-[#1a2540] border border-slate-700 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center">
                        <button onClick={() => setNotifOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={28} className="text-blue-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Notifications</h3>
                        <p className="text-slate-400 text-sm">No Notifications At This Time</p>
                    </div>
                </div>
            )}
        </div>
    );
}