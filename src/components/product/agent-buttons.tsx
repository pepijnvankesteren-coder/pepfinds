"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { ArrowUpRight, Check, Copy, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { getAgent, SOURCE_FLOW_AGENT_LIST } from "@/lib/agents";
import type { AgentId, AgentLinkView } from "@/lib/types";

interface AgentButtonsProps {
  links: AgentLinkView[];
  /** Original marketplace URL; enables the source-flow agent buttons. */
  sourceUrl?: string | null;
  /** Product slug, recorded with buy-click analytics events. */
  productSlug?: string;
  className?: string;
}

/** Shared pill styling so direct links and source-flow triggers look alike. */
const pillClass = cn(
  "group flex h-13 w-full items-center justify-between rounded-full bg-ink px-6",
  "text-[0.95rem] font-medium text-canvas shadow-soft",
  "transition-all duration-300 ease-[var(--ease-out-expo)]",
  "hover:bg-ink-soft hover:shadow-float active:scale-[0.98]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2",
);

function PillContent({ label, hint }: { label: string; hint: string }) {
  return (
    <>
      <span>
        {label}
        <span className="ml-2 text-xs font-normal text-canvas/60">{hint}</span>
      </span>
      <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );
}

/**
 * The product page's primary call to action. Direct agents open their listing
 * in a new tab; source-flow agents (BaseTao, ACBuy) open a popup that shows the
 * product's source link to copy alongside the affiliate sign-up link, because
 * those agents work by pasting the original URL into their own search.
 */
export function AgentButtons({
  links,
  sourceUrl,
  productSlug,
  className,
}: AgentButtonsProps) {
  const [activeAgent, setActiveAgent] = React.useState<AgentId | null>(null);

  const sourceAgents = sourceUrl ? SOURCE_FLOW_AGENT_LIST : [];

  if (links.length === 0 && sourceAgents.length === 0) return null;

  // Record which agent/product a visitor clicks through to buy. A no-op until
  // the visitor has accepted analytics (Vercel Analytics isn't loaded before).
  // Wrapped so a telemetry hiccup can never break the buy flow.
  const trackBuy = (agent: AgentId, kind: "direct" | "source") => {
    try {
      track("buy_click", { agent, kind, product: productSlug ?? "" });
    } catch {
      // Ignore — analytics must never interrupt a purchase.
    }
  };

  return (
    <>
      <div className={cn("flex flex-col gap-3", className)}>
        {links.map((link) => {
          const agent = getAgent(link.agent);
          return (
            <a
              key={link.agent}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              onClick={() => trackBuy(link.agent, "direct")}
              className={pillClass}
            >
              <PillContent label={`Buy via ${agent.name}`} hint={agent.domain} />
            </a>
          );
        })}

        {sourceAgents.map((agent) => (
          <button
            key={agent.id}
            type="button"
            onClick={() => {
              trackBuy(agent.id, "source");
              setActiveAgent(agent.id);
            }}
            className={pillClass}
          >
            <PillContent label={`Buy via ${agent.name}`} hint={agent.domain} />
          </button>
        ))}
      </div>

      <SourceAgentDialog
        agentId={activeAgent}
        sourceUrl={sourceUrl ?? ""}
        onClose={() => setActiveAgent(null)}
      />
    </>
  );
}

interface SourceAgentDialogProps {
  agentId: AgentId | null;
  sourceUrl: string;
  onClose: () => void;
}

/** Popup explaining how to order through a source-flow agent. */
function SourceAgentDialog({ agentId, sourceUrl, onClose }: SourceAgentDialogProps) {
  const [copied, setCopied] = React.useState(false);
  const agent = agentId ? getAgent(agentId) : null;

  // Close on Escape and lock background scroll while the dialog is open.
  React.useEffect(() => {
    if (!agent) return;
    setCopied(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [agent, onClose]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sourceUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context) — the link stays selectable.
    }
  };

  return (
    <AnimatePresence>
      {agent && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Buy via ${agent.name}`}
            className="relative w-full max-w-md rounded-3xl border border-line bg-canvas p-6 shadow-float sm:p-8"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted transition-colors duration-300 hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2"
            >
              <X className="size-4" />
            </button>

            <h3 className="text-lg font-semibold text-ink">
              Buy via {agent.name}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Paste this source link into {agent.name} below to find this exact
              item.
            </p>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-soft">
                Step 1 — Copy the source link
              </p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  readOnly
                  value={sourceUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="min-w-0 flex-1 truncate rounded-xl border border-line bg-surface-soft px-3.5 py-2.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                  aria-label="Source link"
                />
                <button
                  type="button"
                  onClick={copy}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium",
                    "border border-line bg-canvas text-ink transition-colors duration-300",
                    "hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2",
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="size-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-soft">
                Step 2 — Open {agent.name} and paste it in the search bar
              </p>
              <a
                href={agent.signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(pillClass, "mt-2")}
              >
                <PillContent label={`Open ${agent.name}`} hint={agent.domain} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
