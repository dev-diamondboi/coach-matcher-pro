import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function Card({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("rounded-2xl bg-white shadow-soft border border-gray-100", className)}>{children}</div>;
}

export function Button({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium hover:shadow-soft transition", 
    "bg-brand-600 text-white hover:bg-brand-700", className)} {...props}>{children}</button>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-300", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-300", props.className)} />;
}

export function Badge({ children }: React.PropsWithChildren) {
  return <span className="inline-flex items-center rounded-xl bg-brand-50 text-brand-700 px-2 py-1 text-xs font-medium">{children}</span>;
}
