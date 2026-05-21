"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { marketFromPath } from "@/lib/markets";

const sourceCountryName = "السعودية";
const sourceCountryAdjective = "السعودي";

export function MarketContentRewriter() {
  const pathname = usePathname();
  const market = marketFromPath(pathname);

  useEffect(() => {
    if (market.code === "ksa") return;

    const rewriteText = (node: Node) => {
      if (!node.textContent) return;
      node.textContent = node.textContent
        .replaceAll(sourceCountryName, market.countryNameAr)
        .replaceAll(sourceCountryAdjective, market.countryAdjectiveAr)
        .replaceAll("SAR", market.currency)
        .replaceAll("ريال", market.currency);
    };

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes: Node[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(rewriteText);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) rewriteText(node);
          if (node.nodeType === Node.ELEMENT_NODE) {
            const elementWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
            const elementNodes: Node[] = [];
            while (elementWalker.nextNode()) elementNodes.push(elementWalker.currentNode);
            elementNodes.forEach(rewriteText);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [market.code, market.countryAdjectiveAr, market.countryNameAr, market.currency]);

  return null;
}
