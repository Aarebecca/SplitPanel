export interface TabData {
  /** Tab唯一id */
  id: string;
  /** Tab名称 */
  name: string;
}

/** 研发模块分栏 */
export interface ITabs {
  parentTabsKey: string;
  tabsKey: string;
  items: any[] /** 这里应该是Tab的类型 */;
  mixed: boolean;
  v: ITabs[];
  h: ITabs[];
}

/** 分栏 - 水平 or 竖直拆分 */
export enum SplitDirection {
  Horizontal = 'v',
  Vertical = 'h',
}

/** 分栏位置 */
export enum DragOverPosition {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
  CENTER = 'center',
}
