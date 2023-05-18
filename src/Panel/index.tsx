import React from 'react';
import SplitView from './SplitView';
import { ITabs } from '../typing';
import { v4 } from 'uuid';
import './index.less';

export const PanelContext = React.createContext<{
  /** 原始的tabs数据 */
  rootTabs: ITabs;
  /** 更新原始的tabs数据 */
  updateRootTabs: (tabs: ITabs) => void;
  /** 活跃的tabsKey */
  activeTabsKey: string;
  /** 更新活跃的tabsKey */
  setActiveTabs: (tabsKey: string) => void;
}>({
  rootTabs: {
    parentTabsKey: '',
    tabsKey: '',
    mixed: false,
    items: [],
    v: [],
    h: [],
  },
  updateRootTabs: () => {},
  activeTabsKey: '',
  setActiveTabs: () => {},
});

export const AlreadyOpenedTabsCache = 'already_opened_tabs_cache';
const RootTabsCache = 'top_tabs_data_cache';
const ActiveTabsKeyCache = 'active_tabs_key_cache';

interface Props {
  cache?: boolean;
  renderComponent: (tabs: ITabs, activeTabsKey: string) => JSX.Element;
}

/** 研发模块顶层分栏 */
export const SplitPanel = (props: Props) => {
  const { cache, renderComponent } = props;
  const [rootTabs, setRootTabs] = React.useState<ITabs>({
    parentTabsKey: '',
    tabsKey: '',
    mixed: false,
    items: [],
    v: [],
    h: [],
  });
  const [activeTabsKey, setActiveTabsKey] = React.useState<string>('');

  React.useEffect(() => {
    getCacheData();
  }, []);

  const getCacheData = () => {
    /**
     * 为了兼容没有分屏功能前，已经打开过 tabs 的场景：
     * 1、默认将浏览器缓存的用户已经打开的 tabs 作为 topDevTabs 的tabs
     * 2、后续以 top_tabs_data_cache 缓存的数据为准
     */
    const cachedDevRootTabs = localStorage.getItem(RootTabsCache);
    if (cachedDevRootTabs) {
      setRootTabs(JSON.parse(cachedDevRootTabs));
    } else {
      const cachedTabs = localStorage.getItem(AlreadyOpenedTabsCache);
      const rootTabs: ITabs = {
        parentTabsKey: '',
        tabsKey: v4(),
        mixed: false,
        items: JSON.parse(cachedTabs || '[]'),
        v: [],
        h: [],
      };
      setRootTabs(rootTabs);
      localStorage.setItem(RootTabsCache, JSON.stringify(rootTabs));
    }

    const cachedActiveTabsKey = localStorage.getItem(ActiveTabsKeyCache);
    if (cachedActiveTabsKey) {
      setActiveTabsKey(cachedActiveTabsKey);
    }
  };

  if (!rootTabs.tabsKey) {
    return null;
  }

  return (
    <div className="top-tabs-view-wrapper">
      <div className="top-tabs-view">
        <PanelContext.Provider
          value={{
            rootTabs,
            updateRootTabs: (newRootTabs: ITabs) => {
              setRootTabs(newRootTabs);
              /** 缓存最新数据 */
              localStorage.setItem(RootTabsCache, JSON.stringify(newRootTabs));
            },
            activeTabsKey,
            setActiveTabs: (newActiveTabsKey: string) => {
              setActiveTabsKey(newActiveTabsKey);
              localStorage.setItem(ActiveTabsKeyCache, newActiveTabsKey);
            },
          }}
        >
          <SplitView
            tabs={rootTabs}
            activeTabsKey={activeTabsKey}
            renderComponent={renderComponent}
          />
        </PanelContext.Provider>
      </div>
    </div>
  );
};
