export type { ComponentProps } from './Panel/SplitView/index';

export type ViewData = {
  /** View唯一id */
  id: string;
  /** View名称 */
  name: string;
  [keys: string]: any;
};

/** 研发模块分栏 */
export interface IView<I extends ViewData[] = ViewData[]> {
  parentViewKey: string;
  isRoot?: boolean;
  viewKey: string;
  items: I;
  v?: IView<I>[];
  h?: IView<I>[];
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
