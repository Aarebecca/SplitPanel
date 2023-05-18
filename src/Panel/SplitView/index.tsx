import React from 'react';
import type { ITabs } from '../../typing';
import { ResizeHandleHorizontal, ResizeHandleVertical } from '../Resize';
import './index.less';

interface Props {
  tabs: ITabs;
  activeTabsKey: string;
  renderComponent: (tabs: ITabs, activeTabsKey: string) => JSX.Element;
}

const SplitView = (props: Props) => {
  const { tabs, activeTabsKey, renderComponent } = props;

  if (tabs.v.length === 0 && tabs.h.length === 0) {
    return renderComponent(tabs, activeTabsKey);
  }

  let defaultChildStyle = {};
  const children: React.ReactNode[] = [];

  if (tabs.v.length !== 0) {
    defaultChildStyle = { width: 100 / tabs.v.length + '%' };

    tabs.v.forEach((g, index) => {
      if (index !== 0) {
        children.push(
          <ResizeHandleHorizontal
            key={'resize-' + tabs.v[index - 1].tabsKey + '-' + g.tabsKey}
          />
        );
      }
      const child = (
        <SplitView
          tabs={g}
          activeTabsKey={activeTabsKey}
          renderComponent={renderComponent}
        />
      );
      const cls = `tabs-view-horizontal-child ${index === 0 ? 'first' : ''}`;
      if (child) {
        children.push(
          <div
            className={cls}
            style={defaultChildStyle}
            key={g.tabsKey}
            data-min-resize={150}
          >
            {child}
          </div>
        );
      }
    });
  }

  if (tabs.h.length !== 0) {
    defaultChildStyle = { height: 100 / tabs.h.length + '%' };

    tabs.h.forEach((g, index) => {
      if (index !== 0) {
        children.push(
          <ResizeHandleVertical
            key={'resize-' + tabs.h[index - 1].tabsKey + '-' + g.tabsKey}
          />
        );
      }
      const child = (
        <SplitView
          tabs={g}
          activeTabsKey={activeTabsKey}
          renderComponent={renderComponent}
        />
      );
      const cls = `tabs-view-vertical-child ${index === 0 ? 'first' : ''}`;
      if (child) {
        children.push(
          <div
            className={cls}
            style={defaultChildStyle}
            key={g.tabsKey}
            data-min-resize={60}
          >
            {child}
          </div>
        );
      }
    });
  }

  if (children.length === 0) {
    return null;
  }

  const cls = `${tabs.h.length > 0 ? 'tabs-view-vertical' : ''} ${
    tabs.v.length > 0 ? 'tabs-view-horizontal' : ''
  }`;
  return <div className={cls}>{children}</div>;
};

export default SplitView;
