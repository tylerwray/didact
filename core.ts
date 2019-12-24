type ElementType = any;

export interface Props {
  nodeValue?: string;
  children: Fiber[];
}

export interface Fiber {
  dom?: HTMLElement;
  parent?: Fiber;
  child?: Fiber;
  sibling?: Fiber;
  alternate?: Fiber;
  type?: ElementType;
  effectTag?: "PLACEMENT" | "UPDATE" | "DELETION";
  props: Props;
}

function createTextFiber(text): Fiber {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

export function createFiber(
  type: ElementType,
  props?: Props,
  ...children
): Fiber {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextFiber(child)
      )
    }
  };
}

export const Fragment = null;
