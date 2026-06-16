"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { CookieConsent } from "./ui/CookieConsent";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide Navbar and Footer on admin, panel, and login routes
    const isHidden =
        pathname?.startsWith("/panel") ||
        pathname?.startsWith("/login");

    return (
        <>
            {!isHidden && <Navigation />}
            {children}
            {!isHidden && <Footer />}
            <CookieConsent />
        </>
    );
}
