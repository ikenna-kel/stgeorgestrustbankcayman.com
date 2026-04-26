'use client'
import ButtonRounded from "@/src/components/button.rounded";
import { Plus, Send, Download, CircleEllipsis } from "lucide-react";
import { useState } from "react";
import SendMoneyModal from "./SendMoneyModal";
import Link from "next/link";

export function Options() {
    const [isSendOpen, setIsSendOpen] = useState(false);

    return <>
        <section className="flex flex-wrap items-center justify-between gap-3 md:gap-4 md:justify-start">
            <Link href={'/fund-account'}>
                <ButtonRounded color={"bg-secondary hover:bg-secondary/50"} icon={<Plus className="size-4" />} title={"Top Up"} onClick={undefined} />
            </Link>
            <ButtonRounded color={"bg-primary hover:bg-primary/50"} icon={<Send className="size-4" />} onClick={() => setIsSendOpen(true)} title={"Send"} />

            <Link href={'/fund-account'}>
                <ButtonRounded color={"bg-accent hover:bg-accent/50"} icon={<Download className="size-4" />} onClick={undefined} title={"Receive"} />
            </Link>

            <ButtonRounded color={"bg-yellow-600 hover:bg-yellow-600"} icon={<CircleEllipsis className="size-4" />} onClick={() => { }} title={"More"} />
        </section>
        {/* The Send Modal */}
        <SendMoneyModal isOpen={isSendOpen} onClose={() => setIsSendOpen(false)} />
    </>
}