import React from 'react';
import { ViewContext } from '..';
import { DragOverPosition } from '../../typing';
import {
  decorateDragOverElement,
  getDragOverPosition,
  handleViewSplit,
  removeDecorateDragOverElement,
} from '../../utils';
import './index.less';

interface Props {
  viewKey: string;
  children: React.ReactNode | undefined;
}

/** View 内容区域的包裹容器，用于处理节点拖拽到该区域后的一些逻辑 */
export const ContentVessel = React.memo((props: Props) => {
  const vesselRef = React.useRef<HTMLDivElement>(null);
  const { rootView, updateRootView } = React.useContext(ViewContext);

  return (
    <div
      ref={vesselRef}
      className={'view-pane-content-vessel'}
      onDragOver={(e) => {
        e.preventDefault();

        if (vesselRef.current) {
          const position = getDragOverPosition(
            e.nativeEvent,
            vesselRef.current
          );
          decorateDragOverElement(vesselRef.current, position);
        }
      }}
      onDragLeave={(e) => {
        if (vesselRef.current) {
          removeDecorateDragOverElement(vesselRef.current);
        }
      }}
      onDrop={(e) => {
        if (vesselRef.current) {
          removeDecorateDragOverElement(vesselRef.current);
        }
        let position = DragOverPosition.CENTER;
        if (vesselRef.current) {
          position = getDragOverPosition(e.nativeEvent, vesselRef.current);
        }
        const transferData = e.dataTransfer.getData('text/plain');
        const { viewKey: sourceViewKey, dragNode } = JSON.parse(transferData);
        const newRootView = handleViewSplit(
          rootView,
          sourceViewKey,
          props.viewKey,
          position,
          dragNode
        );
        updateRootView(newRootView);
      }}
    >
      {props.children}
    </div>
  );
});
