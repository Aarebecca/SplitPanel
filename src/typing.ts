export type { ComponentProps } from './Panel/SplitView/index';

export interface ViewData {
  /** View唯一id */
  id: string;
  /** View名称 */
  name: string;
}

/** 研发模块分栏 */
export interface IView {
  parentViewKey: string;
  isRoot?: boolean;
  viewKey: string;
  items: any[];
  v?: IView[];
  h?: IView[];
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
