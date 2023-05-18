import React from 'react';
import type { IView } from '../../typing';
import { ResizeHandleHorizontal, ResizeHandleVertical } from '../Resize';
import './index.less';

interface Props {
  view: IView;
  activeViewKey: string;
  renderComponent: (view: IView, activeViewKey: string) => JSX.Element;
}

const SplitView = (props: Props) => {
  const { view, activeViewKey, renderComponent } = props;

  const { v: vertical = [], h: horizontal = [] } = view;

  if (vertical.length === 0 && horizontal.length === 0) {
    return renderComponent(view, activeViewKey);
  }

  let defaultChildStyle = {};
  const children: React.ReactNode[] = [];

  if (vertical.length !== 0) {
    defaultChildStyle = { width: 100 / vertical.length + '%' };

    vertical.forEach((g, index) => {
      if (index !== 0) {
        children.push(
          <ResizeHandleHorizontal
            key={'resize-' + vertical[index - 1].viewKey + '-' + g.viewKey}
          />
        );
      }
      const child = (
        <SplitView
          view={g}
          activeViewKey={activeViewKey}
          renderComponent={renderComponent}
        />
      );
      const cls = `view-view-horizontal-child ${index === 0 ? 'first' : ''}`;
      if (child) {
        children.push(
          <div
            className={cls}
            style={defaultChildStyle}
            key={g.viewKey}
            data-min-resize={150}
          >
            {child}
          </div>
        );
      }
    });
  }

  if (horizontal.length !== 0) {
    defaultChildStyle = { height: 100 / horizontal.length + '%' };

    horizontal.forEach((g, index) => {
      if (index !== 0) {
        children.push(
          <ResizeHandleVertical
            key={'resize-' + horizontal[index - 1].viewKey + '-' + g.viewKey}
          />
        );
      }
      const child = (
        <SplitView
          view={g}
          activeViewKey={activeViewKey}
          renderComponent={renderComponent}
        />
      );
      const cls = `view-view-vertical-child ${index === 0 ? 'first' : ''}`;
      if (child) {
        children.push(
          <div
            className={cls}
            style={defaultChildStyle}
            key={g.viewKey}
            data-min-resize={60}
          >
            {child}
          </div>
        );
      }
    });
  }

  if (children.length === 0) {
    return <div>Empty</div>;
  }

  const cls = `${horizontal.length > 0 ? 'view-view-vertical' : ''} ${
    vertical.length > 0 ? 'view-view-horizontal' : ''
  }`;
  return <div className={cls}>{children}</div>;
};

export default SplitView;
