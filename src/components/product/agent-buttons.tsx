import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { getAgent } from "@/lib/agents";
import type { AgentLinkView } from "@/lib/types";

interface AgentButtonsProps {
  links: AgentLinkView[];
  className?: string;
}

/**
 * The product page's primary call to action: one prominent button per
 * available purchasing agent, opening the listing in a new tab.
 */
export function AgentButtons({ links, className }: AgentButtonsProps) {
  if (links.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {links.map((link) => {
        const agent = getAgent(link.agent);
        return (
          <a
            key={link.agent}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={cn(
              "group flex h-13 items-center justify-between rounded-full bg-ink px-6",
              "text-[0.95rem] font-medium text-canvas shadow-soft",
              "transition-all duration-300 ease-[var(--ease-out-expo)]",
              "hover:bg-ink-soft hover:shadow-float active:scale-[0.98]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2",
            )}
          >
            <span>
              Buy via {agent.name}
              <span className="ml-2 text-xs font-normal text-canvas/60">
                {agent.domain}
              </span>
            </span>
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        );
      })}
    </div>
  );
}
