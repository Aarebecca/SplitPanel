import React from 'react';
import type { IView, ViewData } from '../../typing';
import { ResizeHandleHorizontal, ResizeHandleVertical } from '../Resize';
import './index.less';

export type ComponentProps<T extends ViewData[] = ViewData[]> = {
  view: IView<T>;
  rootView: IView<T>;
  activeViewKey: string;
};
interface Props extends ComponentProps {
  renderComponent: (props: ComponentProps) => JSX.Element;
}

const SplitView = (props: Props) => {
  const { rootView, view = rootView, activeViewKey, renderComponent } = props;

  const { v: vertical = [], h: horizontal = [] } = view;

  if (vertical.length === 0 && horizontal.length === 0) {
    return renderComponent({ view, rootView, activeViewKey });
  }

  let defaultChildrentyle = {};
  const children: React.ReactNode[] = [];

  if (vertical.length !== 0) {
    defaultChildrentyle = { width: 100 / vertical.length + '%' };

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
          rootView={rootView}
          activeViewKey={activeViewKey}
          renderComponent={renderComponent}
        />
      );
      const cls = `view-view-horizontal-child ${index === 0 ? 'first' : ''}`;
      if (child) {
        children.push(
          <div
            className={cls}
            style={defaultChildrentyle}
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
    defaultChildrentyle = { height: 100 / horizontal.length + '%' };

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
          rootView={rootView}
          activeViewKey={activeViewKey}
          renderComponent={renderComponent}
        />
      );
      const cls = `view-view-vertical-child ${index === 0 ? 'first' : ''}`;
      if (child) {
        children.push(
          <div
            className={cls}
            style={defaultChildrentyle}
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
