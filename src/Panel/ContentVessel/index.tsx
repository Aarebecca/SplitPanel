import React from 'react';
import { PanelContext } from '..';
import { DragOverPosition } from '../../typing';
import {
  decorateDragOverElement,
  getDragOverPosition,
  handleTabsSplit,
  removeDecorateDragOverElement,
} from '../../utils';
import './index.less';

interface Props {
  tabsKey: string;
  children: React.ReactNode | undefined;
}

/** Tab 内容区域的包裹容器，用于处理节点拖拽到该区域后的一些逻辑 */
export const ContentVessel = React.memo((props: Props) => {
  const vesselRef = React.useRef<HTMLDivElement>(null);
  const { rootTabs, updateRootTabs } = React.useContext(PanelContext);

  return (
    <div
      ref={vesselRef}
      className={'tab-pane-content-vessel'}
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
        const { tabsKey: sourceTabsKey, dragNode } = JSON.parse(transferData);
        const newRootTabs = handleTabsSplit(
          rootTabs,
          sourceTabsKey,
          props.tabsKey,
          position,
          dragNode
        );
        updateRootTabs(newRootTabs);
      }}
    >
      {props.children}
    </div>
  );
});
