import { findChildren } from "@tiptap/core";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import Prism from "./prism.ts";

import { fromHtml } from "hast-util-from-html";

function parseNodes(
  nodes: any[],
  className: string[] = []
): { text: string; classes: string[] }[] {
  return nodes
    .map((node) => {
      const classes = [
        ...className,
        ...(node.properties ? node.properties.className : []),
      ];

      if (node.children) {
        return parseNodes(node.children, classes);
      }

      return {
        text: node.value,
        classes,
      };
    })
    .flat();
}

function getHighlightNodes(html: string) {
  return fromHtml(html, { fragment: true }).children;
}

function registeredLang(aliasOrLanguage: string) {
  const allSupportLang = Object.keys(Prism.languages).filter(
    (id) => typeof Prism.languages[id] === "object"
  );
  return Boolean(allSupportLang.find((x) => x === aliasOrLanguage));
}

function getDecorations({
  doc,
  name,
  defaultLanguage,
  languageList,
}: {
  doc: ProsemirrorNode;
  name: string;
  defaultLanguage: string | null | undefined;
  languageList: Array<string>;
}) {
  const decorations: Decoration[] = [];

  findChildren(doc, (node) => node.type.name === name).forEach((block) => {
    let from = block.pos + 1;
    const language = block.node.attrs.language || defaultLanguage;
    const langList = block.node.attrs.languageList || languageList;
    let html: string = "";

    try {
      if (registeredLang(language) && langList.includes(language)) {
        html = Prism.highlight(
          block.node.textContent,
          Prism.languages[language],
          language
        );
      } else {
        html = Prism.highlight(
          block.node.textContent,
          Prism.languages.plain,
          "plain"
        );
      }
    } catch (err: any) {
      html = Prism.highlight(
        block.node.textContent,
        Prism.languages.plain,
        "plain"
      );
    }
    const nodes = getHighlightNodes(html);

    parseNodes(nodes).forEach((node) => {
      const to = from + node.text.length;

      if (node.classes.length) {
        const decoration = Decoration.inline(from, to, {
          class: node.classes.join(" "),
        });

        decorations.push(decoration);
      }

      from = to;
    });
  });

  return DecorationSet.create(doc, decorations);
}

export function PrismPlugin({
  name,
  defaultLanguage,
  languageList,
}: {
  name: string;
  defaultLanguage: string | null | undefined;
  languageList: Array<string>;
}) {
  if (!defaultLanguage) {
    throw Error("You must specify the defaultLanguage parameter");
  }

  if (languageList.length <= 0) {
    throw Error("You must provide at least one language");
  }

  const prismjsPlugin: Plugin<any> = new Plugin({
    key: new PluginKey("prism"),

    state: {
      init: (_, { doc }) =>
        getDecorations({
          doc,
          name,
          defaultLanguage,
          languageList,
        }),
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name;
        const newNodeName = newState.selection.$head.parent.type.name;
        const oldNodes = findChildren(
          oldState.doc,
          (node) => node.type.name === name
        );
        const newNodes = findChildren(
          newState.doc,
          (node) => node.type.name === name
        );

        if (
          transaction.docChanged &&
          // Apply decorations if:
          // selection includes named node,
          ([oldNodeName, newNodeName].includes(name) ||
            // OR transaction adds/removes named node,
            newNodes.length !== oldNodes.length ||
            // OR transaction has changes that completely encapsulte a node
            // (for example, a transaction that affects the entire document).
            // Such transactions can happen during collab syncing via y-prosemirror, for example.
            transaction.steps.some((step) => {
              // @ts-ignore
              return (
                // @ts-ignore
                step.from !== undefined &&
                // @ts-ignore
                step.to !== undefined &&
                oldNodes.some((node) => {
                  // @ts-ignore
                  return (
                    // @ts-ignore
                    node.pos >= step.from &&
                    // @ts-ignore
                    node.pos + node.node.nodeSize <= step.to
                  );
                })
              );
            }))
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
            defaultLanguage,
            languageList,
          });
        }

        return decorationSet.map(transaction.mapping, transaction.doc);
      },
    },

    props: {
      decorations(state) {
        return prismjsPlugin.getState(state);
      },
    },
  });

  return prismjsPlugin;
}
