"use client";

import * as React from "react";
import { createPortal } from "react-dom";

type DialogContextValue = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
    const ctx = React.useContext(DialogContext);
    if (!ctx) throw new Error("Dialog components must be used within <Dialog>.");
    return ctx;
}

export function Dialog({
    open,
    onOpenChange,
    children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}) {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            {children}
        </DialogContext.Provider>
    );
}

/**
 * DialogContent renders in a portal when open.
 * - ESC closes
 * - Click on overlay closes
 * - Body scroll is locked while open
 */
export function DialogContent({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { open, onOpenChange } = useDialogContext();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    React.useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onOpenChange(false);
        };

        document.addEventListener("keydown", onKeyDown);

        // lock scroll
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onOpenChange]);

    if (!open || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <button
                type="button"
                aria-label="Close dialog"
                onClick={() => onOpenChange(false)}
                className="absolute inset-0 cursor-default bg-black/40"
            />

            {/* Panel wrapper */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    className={[
                        "w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl",
                        "animate-in fade-in zoom-in-95",
                        className,
                    ].join(" ")}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
    return <div className="px-6 pt-6">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-base font-semibold text-slate-900">{children}</h2>
    );
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
    return <div className="mt-2 text-sm text-slate-600">{children}</div>;
}

export function DialogFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={["px-6 pb-6 pt-4 flex items-center justify-end gap-2", className].join(" ")}>
            {children}
        </div>
    );
}
