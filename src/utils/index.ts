import { v4 } from 'uuid';
import { IView, DragOverPosition } from '../typing';

/**
 * 处理分屏(Split)逻辑
 * @param view 原始分屏数据
 * @param targetViewKey 从哪个view拖拽的
 * @param targetViewKey 拖拽到哪个view去
 * @param position 分屏方向
 * @param dragNode 拖拽的节点
 */
export function handleViewSplit(
  view: IView,
  sourceViewKey: string,
  targetViewKey: string,
  position: DragOverPosition,
  dragNode: any
) {
  const newView = { ...view };

  const sourceView = findViewByKey(newView, sourceViewKey);

  /** 从source view中删除拖拽节点 */
  removeDragNodeSourceView(sourceView, dragNode, newView);

  /** 找到target view */
  const targetView = findViewByKey(newView, targetViewKey);
  /** 往target view中添加拖拽节点 */
  addDragNodeInTargetView(targetView, dragNode, position);

  return newView;
}

/**
 * 从原始view数据中寻找目标view
 * @param view 原始view数据
 * @param key 需要寻找的目标View的key
 * @returns 返回目标view
 */
export function findViewByKey(view: IView, key: string) {
  let targetView: IView | undefined = undefined;

  if (view.viewKey === key) {
    targetView = view;
  }

  if (view.viewKey !== key) {
    const splitDirection = view.v.length > 0 ? 'v' : 'h';
    targetView = view[splitDirection].find((view) => view.viewKey === key);
    if (targetView) {
      return targetView;
    }
    if (!targetView) {
      for (let i = 0; i < view[splitDirection].length; i++) {
        targetView = findViewByKey(view[splitDirection][i], key);
        if (targetView) {
          break;
        }
      }
    }
  }

  return targetView;
}

/** 获取全部 view items */
export function getAllViewItems(view: IView | IView[]): IView['items'] {
  const internalView = Array.isArray(view) ? view : [view];
  let items: IView['items'] = [];

  for (const view of internalView) {
    items = items.concat(view.items);
    if (view.v) items = items.concat(getAllViewItems(view.v));
    if (view.h) items = items.concat(getAllViewItems(view.h));
  }

  return items;
}

/** 获取 item 的直接父视图 */
export function getParentView(
  rootView: IView,
  item: IView['items'][number]
): IView {
  if (rootView.items.includes(item)) return rootView;

  // search from view.v
  const search = (views: IView[]) => {
    for (const v of views) {
      const parent = getParentView(v, item);
      if (parent) return parent;
    }
  };

  const fromV = search(rootView.v);
  if (fromV) return fromV;

  const fromH = search(rootView.h);
  if (fromH) return fromH;

  return null;
}

/** 从source view中删除拖拽节点 */
export function removeDragNodeSourceView(
  sourceView: IView,
  dragNode: any,
  view: IView
) {
  const findNode = sourceView.items.find((node) => node.id === dragNode.id);
  if (findNode) {
    sourceView.items = sourceView.items.filter(
      (node) => node.id !== dragNode.id
    );

    /** 如果当前view的childs为空, 则需要将该view从父亲中删除 */
    if (sourceView.items.length === 0) {
      removeViewFromParent(sourceView, view);
    }
  }
}

/** 从view的父亲中删除该view */
export function removeViewFromParent(sourceView: IView, view: IView) {
  /** 已经到顶部view, 直接返回 */
  if (sourceView.isRoot) {
    return;
  }

  const parentView = findViewByKey(view, sourceView.parentViewKey);
  const splitDirection = parentView.v.length > 0 ? 'v' : 'h';

  /** 从父亲view中删除当前view */
  parentView[splitDirection] = parentView[splitDirection].filter(
    (view) => view.viewKey !== sourceView.viewKey
  );

  if (parentView[splitDirection].length === 0) {
    removeViewFromParent(parentView, view);
  }
}

/** 往target view中添加拖拽节点 */
function addDragNodeInTargetView(
  view: IView,
  dragNode: any,
  position: DragOverPosition
) {
  if (!view?.items) return;
  const viewKey_1 = v4();
  const viewKey_2 = v4();
  const dragChild = [dragNode];
  const lastChilds = view.items;
  /** 向左 or 向右分割 */
  if ([DragOverPosition.LEFT, DragOverPosition.RIGHT].includes(position)) {
    const isLeft = position === DragOverPosition.LEFT;
    view.items = [];
    view.v = [
      {
        parentViewKey: view.viewKey,
        viewKey: viewKey_1,
        items: isLeft ? dragChild : lastChilds,
        v: [],
        h: [],
      },
      {
        parentViewKey: view.viewKey,
        viewKey: viewKey_2,
        items: isLeft ? lastChilds : dragChild,
        v: [],
        h: [],
      },
    ];
    view.h = [];
    return view;
  }

  /** 向上 or 向下分割 */
  if ([DragOverPosition.TOP, DragOverPosition.BOTTOM].includes(position)) {
    const isTop = position === DragOverPosition.TOP;
    view.items = [];
    view.v = [];
    view.h = [
      {
        parentViewKey: view.viewKey,
        viewKey: viewKey_1,
        items: isTop ? dragChild : lastChilds,
        v: [],
        h: [],
      },
      {
        parentViewKey: view.viewKey,
        viewKey: viewKey_2,
        items: isTop ? lastChilds : dragChild,
        v: [],
        h: [],
      },
    ];
    return view;
  }

  /** 相当于移动(DragOverPosition === Center), 不分割新的view */
  view.items = [...view.items, dragChild[0]];
  return view;
}

/**
 * 更新View分栏数据
 * @param view 原始分栏数据
 * @param view 需要更新的目标view
 * @param newChilds 需要更新的目标view的childs
 */
export function updateViewData(view: IView, viewKey: string, newChilds: any) {
  const newView = { ...view };
  const targetView = findViewByKey(newView, viewKey);

  targetView.items = newChilds;

  /** 如果当前view的childs为空, 则需要将该view从父亲中删除 */
  if (targetView.items.length === 0) {
    removeViewFromParent(targetView, newView);
  }

  return newView;
}

export function addClass(element: HTMLElement, className: string) {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
}

export function removeClass(element: HTMLElement, className: string) {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
}

export function decorateDragOverElement(
  element: HTMLElement,
  position: DragOverPosition
) {
  addClass(element, 'drag-over');

  [
    DragOverPosition.LEFT,
    DragOverPosition.RIGHT,
    DragOverPosition.TOP,
    DragOverPosition.BOTTOM,
  ]
    .filter((pos) => pos !== position)
    .forEach((pos) => {
      removeClass(element, 'drag-over-' + pos);
    });
  addClass(element, 'drag-over-' + position);
}

export function removeDecorateDragOverElement(element: HTMLElement) {
  removeClass(element, 'drag-over');
  [
    DragOverPosition.LEFT,
    DragOverPosition.RIGHT,
    DragOverPosition.TOP,
    DragOverPosition.BOTTOM,
  ].forEach((pos) => {
    removeClass(element, 'drag-over-' + pos);
  });
}

export function getDragOverPosition(
  e: DragEvent,
  element: HTMLElement
): DragOverPosition {
  const rect = element.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  if (x <= width * 0.15) {
    return DragOverPosition.LEFT;
  }
  if (x >= width * 0.85) {
    return DragOverPosition.RIGHT;
  }
  if (y <= height * 0.15) {
    return DragOverPosition.TOP;
  }
  if (y >= height * 0.85) {
    return DragOverPosition.BOTTOM;
  }
  return DragOverPosition.CENTER;
}
