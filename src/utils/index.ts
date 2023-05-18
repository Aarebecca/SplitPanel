import { v4 } from 'uuid';
import { ITabs, DragOverPosition } from '../typing';

/**
 * 处理分屏(Split)逻辑
 * @param tabs 原始分屏数据
 * @param targetTabsKey 从哪个tabs拖拽的
 * @param targetTabsKey 拖拽到哪个tabs去
 * @param position 分屏方向
 * @param dragNode 拖拽的节点
 */
export function handleTabsSplit(
  tabs: ITabs,
  sourceTabsKey: string,
  targetTabsKey: string,
  position: DragOverPosition,
  dragNode: any
) {
  const newTabs = { ...tabs };

  const sourceTabs = findTabsByKey(newTabs, sourceTabsKey);

  /** 从source tabs中删除拖拽节点 */
  removeDragNodeSourceTabs(sourceTabs, dragNode, newTabs);

  /** 找到target tabs */
  const targetTabs = findTabsByKey(newTabs, targetTabsKey);
  /** 往target tabs中添加拖拽节点 */
  addDragNodeInTargetTabs(targetTabs, dragNode, position);

  return newTabs;
}

/**
 * 从原始tabs数据中寻找目标tabs
 * @param tabs 原始tabs数据
 * @param key 需要寻找的目标Tabs的key
 * @returns 返回目标tabs
 */
export function findTabsByKey(tabs: ITabs, key: string) {
  let targetTabs: ITabs | undefined = undefined;

  if (tabs.tabsKey === key) {
    targetTabs = tabs;
  }

  if (tabs.tabsKey !== key) {
    const splitDirection = tabs.v.length > 0 ? 'v' : 'h';
    targetTabs = tabs[splitDirection].find((tab) => tab.tabsKey === key);
    if (targetTabs) {
      return targetTabs;
    }
    if (!targetTabs) {
      for (let i = 0; i < tabs[splitDirection].length; i++) {
        targetTabs = findTabsByKey(tabs[splitDirection][i], key);
        if (targetTabs) {
          break;
        }
      }
    }
  }

  return targetTabs;
}

/** 获全部 tab items */
export function getAllTabItems(tabs: ITabs | ITabs[]): ITabs['items'] {
  const internalTabs = Array.isArray(tabs) ? tabs : [tabs];
  let items: ITabs['items'] = [];

  for (const tab of internalTabs) {
    items = items.concat(tab.items);
    if (tab.v) items = items.concat(getAllTabItems(tab.v));
    if (tab.h) items = items.concat(getAllTabItems(tab.h));
  }

  return items;
}

/** 从source tabs中删除拖拽节点 */
export function removeDragNodeSourceTabs(
  sourceTabs: ITabs,
  dragNode: any,
  tabs: ITabs
) {
  const findNode = sourceTabs.items.find((node) => node.id === dragNode.id);
  if (findNode) {
    sourceTabs.items = sourceTabs.items.filter(
      (node) => node.id !== dragNode.id
    );

    /** 如果当前tabs的childs为空, 则需要将该tabs从父亲中删除 */
    if (sourceTabs.items.length === 0) {
      removeTabsFromParent(sourceTabs, tabs);
    }
  }
}

/** 从tabs的父亲中删除该tabs */
export function removeTabsFromParent(sourceTabs: ITabs, tabs: ITabs) {
  /** 已经到顶部tabs, 直接返回 */
  if (sourceTabs.tabsKey.startsWith('ROOT')) {
    return;
  }

  const parentTabs = findTabsByKey(tabs, sourceTabs.parentTabsKey);
  const splitDirection = parentTabs.v.length > 0 ? 'v' : 'h';

  /** 从父亲tabs中删除当前tabs */
  parentTabs[splitDirection] = parentTabs[splitDirection].filter(
    (tabs) => tabs.tabsKey !== sourceTabs.tabsKey
  );

  if (parentTabs[splitDirection].length === 0) {
    removeTabsFromParent(parentTabs, tabs);
  }
}

/** 往target tabs中添加拖拽节点 */
function addDragNodeInTargetTabs(
  tabs: ITabs,
  dragNode: any,
  position: DragOverPosition
) {
  if (!tabs?.items) return;
  const tabsKey_1 = v4();
  const tabsKey_2 = v4();
  const dragChild = [dragNode];
  const lastChilds = tabs.items;
  /** 向左 or 向右分割 */
  if ([DragOverPosition.LEFT, DragOverPosition.RIGHT].includes(position)) {
    const isLeft = position === DragOverPosition.LEFT;
    tabs.mixed = true;
    tabs.items = [];
    tabs.v = [
      {
        parentTabsKey: tabs.tabsKey,
        tabsKey: tabsKey_1,
        mixed: false,
        items: isLeft ? dragChild : lastChilds,
        v: [],
        h: [],
      },
      {
        parentTabsKey: tabs.tabsKey,
        tabsKey: tabsKey_2,
        mixed: false,
        items: isLeft ? lastChilds : dragChild,
        v: [],
        h: [],
      },
    ];
    tabs.h = [];
    return tabs;
  }

  /** 向上 or 向下分割 */
  if ([DragOverPosition.TOP, DragOverPosition.BOTTOM].includes(position)) {
    const isTop = position === DragOverPosition.TOP;
    tabs.mixed = true;
    tabs.items = [];
    tabs.v = [];
    tabs.h = [
      {
        parentTabsKey: tabs.tabsKey,
        tabsKey: tabsKey_1,
        mixed: false,
        items: isTop ? dragChild : lastChilds,
        v: [],
        h: [],
      },
      {
        parentTabsKey: tabs.tabsKey,
        tabsKey: tabsKey_2,
        mixed: false,
        items: isTop ? lastChilds : dragChild,
        v: [],
        h: [],
      },
    ];
    return tabs;
  }

  /** 相当于移动(DragOverPosition === Center), 不分割新的tabs */
  tabs.items = [...tabs.items, dragChild[0]];
  return tabs;
}

/**
 * 更新Tabs分栏数据
 * @param tabs 原始分栏数据
 * @param tabs 需要更新的目标tabs
 * @param newChilds 需要更新的目标tabs的childs
 */
export function updateTabsData(tabs: ITabs, tabsKey: string, newChilds: any) {
  const newTabs = { ...tabs };
  const targetTabs = findTabsByKey(newTabs, tabsKey);

  targetTabs.items = newChilds;

  /** 如果当前tabs的childs为空, 则需要将该tabs从父亲中删除 */
  if (targetTabs.items.length === 0) {
    removeTabsFromParent(targetTabs, newTabs);
  }

  return newTabs;
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
