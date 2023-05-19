import React, { useCallback } from 'react';
import SplitView, { type ComponentProps } from './SplitView';
import { IView } from '../typing';
import { v4 } from 'uuid';
import './index.less';

export const ViewContext = React.createContext<{
  /** 原始的view数据 */
  rootView: IView;
  /** 更新原始的view数据 */
  updateRootView: (view: IView) => void;
  /** 活跃的viewKey */
  activeViewKey: string;
  /** 更新活跃的viewKey */
  setActiveView: (viewKey: string) => void;
}>({
  rootView: {
    parentViewKey: '',
    viewKey: '',
    items: [],
    v: [],
    h: [],
  },
  updateRootView: () => {},
  activeViewKey: '',
  setActiveView: () => {},
});

export const AlreadyOpenedViewCache = 'already_opened_view_cache';
const RootViewCache = 'top_view_data_cache';
const ActiveViewKeyCache = 'active_view_key_cache';

export type SplitPanelProps = {
  /** 是否缓存当前布局数据 */
  cacheView?: boolean;
  /** 默认布局数据 */
  defaultView?: IView;
  /** 默认激活视图 */
  defaultActiveViewKey?: string;
  /** 激活视图变化 */
  onActiveViewChange?: (key: string) => void;
  /** 视图数据变化 */
  onViewChange?: (view: IView) => void;
  /** 组件渲染 */
  renderComponent: (props: ComponentProps) => JSX.Element;
};

/** 研发模块顶层分栏 */
export const SplitPanel: React.FC<SplitPanelProps> = (props) => {
  const {
    cacheView,
    defaultView,
    defaultActiveViewKey = '',
    onActiveViewChange,
    onViewChange,
    renderComponent,
  } = props;
  const [rootView, _setRootView] = React.useState<IView>(
    defaultView || {
      parentViewKey: '',
      viewKey: '',
      items: [],
      v: [],
      h: [],
    }
  );

  const setRootView = (view: IView) => {
    _setRootView(view);
    onViewChange?.(view);
  };

  const [activeViewKey, _setActiveViewKey] =
    React.useState<string>(defaultActiveViewKey);

  const setActiveViewKey = (key: string) => {
    _setActiveViewKey(key);
    onActiveViewChange?.(key);
  };

  React.useEffect(() => {
    if (!defaultView) getCacheData();
  }, []);

  const getItem = useCallback(
    (key: string) => {
      if (cacheView) return localStorage.getItem(key);
      return null;
    },
    [cacheView]
  );

  const setItem = useCallback(
    (key: string, value: string) => {
      if (cacheView) localStorage.setItem(key, value);
    },
    [cacheView]
  );

  const getCacheData = () => {
    /**
     * 为了兼容没有分屏功能前，已经打开过 view 的场景：
     * 1、默认将浏览器缓存的用户已经打开的 view 作为 topDevView 的view
     * 2、后续以 top_view_data_cache 缓存的数据为准
     */
    const cachedDevRootView = getItem(RootViewCache);
    if (cachedDevRootView) {
      setRootView(JSON.parse(cachedDevRootView));
    } else {
      const cachedView = getItem(AlreadyOpenedViewCache);
      const rootView: IView = {
        parentViewKey: '',
        isRoot: true,
        viewKey: v4(),
        items: JSON.parse(cachedView || '[]'),
        v: [],
        h: [],
      };
      setRootView(rootView);
      setItem(RootViewCache, JSON.stringify(rootView));
    }

    const cachedActiveViewKey = getItem(ActiveViewKeyCache);
    if (cachedActiveViewKey) {
      setActiveViewKey(cachedActiveViewKey);
    }
  };

  if (!rootView.viewKey) {
    return null;
  }

  return (
    <div className="top-view-view-wrapper">
      <div className="top-view-view">
        <ViewContext.Provider
          value={{
            rootView,
            updateRootView: (newRootView: IView) => {
              setRootView(newRootView);
              setItem(RootViewCache, JSON.stringify(newRootView));
            },
            activeViewKey,
            setActiveView: (newActiveViewKey: string) => {
              if (newActiveViewKey === activeViewKey) return;
              setActiveViewKey(newActiveViewKey);
              setItem(ActiveViewKeyCache, newActiveViewKey);
            },
          }}
        >
          <SplitView
            view={rootView}
            rootView={rootView}
            activeViewKey={activeViewKey}
            renderComponent={renderComponent}
          />
        </ViewContext.Provider>
      </div>
    </div>
  );
};
