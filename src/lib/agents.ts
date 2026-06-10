import { AGENT_IDS, type AgentId, type AgentInfo } from "@/lib/types";

/**
 * The supported purchasing agents. Single source of truth for agent names
 * and domains — admin form inputs and public buy buttons both derive from it.
 */
export const AGENTS: Record<AgentId, AgentInfo> = {
  OOPBUY: { id: "OOPBUY", name: "Oopbuy", domain: "oopbuy.com" },
  KAKOBUY: { id: "KAKOBUY", name: "Kakobuy", domain: "kakobuy.com" },
  ACBUY: { id: "ACBUY", name: "ACBuy", domain: "acbuy.com" },
  ORIENTDIG: { id: "ORIENTDIG", name: "OrientDig", domain: "orientdig.com" },
  SUPERBUY: { id: "SUPERBUY", name: "Superbuy", domain: "superbuy.com" },
  BASETAO: { id: "BASETAO", name: "BaseTao", domain: "basetao.com" },
  MULEBUY: { id: "MULEBUY", name: "MuleBuy", domain: "mulebuy.com" },
};

/** Ordered list for rendering forms and button stacks. */
export const AGENT_LIST: AgentInfo[] = AGENT_IDS.map((id) => AGENTS[id]);

export function getAgent(id: AgentId): AgentInfo {
  return AGENTS[id];
}
