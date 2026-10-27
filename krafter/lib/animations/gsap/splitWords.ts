"use client";

/**
 * Editorial word splitter.
 *
 * Wraps every word in a mask (`overflow: hidden`) plus an inner span, while
 * preserving inline markup such as `<em>` or `<strong>`: the walker only
 * touches text nodes, so the serif italics of a heading keep their styles.
 *
 * The masks carry a little bottom padding so descenders (g, j, p, q, y) are
 * never clipped while the word sits at its start position.
 *
 * Returns the inner spans to animate, and a `revert()` that restores the
 * original markup exactly.
 */
export type WordSplit = {
  words: HTMLElement[];
  revert: () => void;
};

export function splitWords(root: HTMLElement): WordSplit {
  const original = root.innerHTML;
  const words: HTMLElement[] = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest("svg")) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  textNodes.forEach((node) => {
    const value = node.nodeValue ?? "";
    const fragment = document.createDocumentFragment();

    value.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
        return;
      }
      const mask = document.createElement("span");
      mask.className = "split-word";
      const inner = document.createElement("span");
      inner.className = "split-word__inner";
      inner.textContent = part;
      mask.appendChild(inner);
      fragment.appendChild(mask);
      words.push(inner);
    });

    node.replaceWith(fragment);
  });

  return {
    words,
    revert: () => {
      root.innerHTML = original;
    },
  };
}
