import { AGENT_IDS, type AgentId, type AgentInfo } from "@/lib/types";

/**
 * The supported purchasing agents. Single source of truth for agent names
 * and domains — admin form inputs and public buy buttons both derive from it.
 */
export const AGENTS: Record<AgentId, AgentInfo> = {
  OOPBUY: { id: "OOPBUY", name: "Oopbuy", domain: "oopbuy.com" },
  KAKOBUY: { id: "KAKOBUY", name: "Kakobuy", domain: "kakobuy.com" },
  ACBUY: {
    id: "ACBUY",
    name: "ACBuy",
    domain: "acbuy.com",
    signupUrl: "https://www.acbuy.com/login?loginStatus=register&code=PQFC2S",
  },
  ORIENTDIG: { id: "ORIENTDIG", name: "OrientDig", domain: "orientdig.com" },
  SUPERBUY: { id: "SUPERBUY", name: "Superbuy", domain: "superbuy.com" },
  BASETAO: {
    id: "BASETAO",
    name: "BaseTao",
    domain: "basetao.com",
    signupUrl: "https://www.basetao.com/?LmwXJ6ujH+MTpqMIARA",
  },
  MULEBUY: { id: "MULEBUY", name: "MuleBuy", domain: "mulebuy.com" },
};

/** Ordered list for rendering forms and button stacks. */
export const AGENT_LIST: AgentInfo[] = AGENT_IDS.map((id) => AGENTS[id]);

export function getAgent(id: AgentId): AgentInfo {
  return AGENTS[id];
}

/**
 * Source-flow agents have no per-product link. Their buy button opens a popup
 * that shows the product's source URL to copy and their affiliate sign-up URL
 * to open — so one source link drives every source-flow agent at once.
 */
export function usesSourceFlow(id: AgentId): boolean {
  return Boolean(AGENTS[id].signupUrl);
}

/** Agents that take a direct per-product listing URL (rendered as inputs). */
export const DIRECT_AGENT_LIST: AgentInfo[] = AGENT_LIST.filter(
  (agent) => !usesSourceFlow(agent.id),
);

/** Agents driven by the product's source URL (BaseTao, ACBuy). */
export const SOURCE_FLOW_AGENT_LIST: AgentInfo[] = AGENT_LIST.filter((agent) =>
  usesSourceFlow(agent.id),
);
