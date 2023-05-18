import { Tabs as AntTabs, type TabsProps } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import {
  ContentVessel,
  NameVessel,
  ViewContext,
  updateViewData,
  type IView,
} from '../../../src';
import './index.less';

const { TabPane } = AntTabs;

interface Props {
  tabs: IView;
  /** 空内容 */
  emptyContent?: React.ReactNode;
  /** Tab 渲染 */
  renderContent: (key: string, title: string) => React.ReactNode;
}

export function addTab(key: string, title: string) {
  document.dispatchEvent(new CustomEvent('addTab', { detail: { key, title } }));
}

export const Tabs: React.FC<Props> = (props) => {
  const { tabs } = props;

  const { items: tabsData = [] } = tabs;
  const { activeViewKey, setActiveView, rootView, updateRootView } =
    useContext(ViewContext);
  const [activeTab, setActiveTab] = useState<string>(tabsData[0]?.id || '');

  const addTab = useCallback(
    (key: string, title: string, whenActive = true) => {
      // 该 tabs 不是活跃的，不处理
      if (whenActive && activeViewKey !== props.tabs.viewKey) return;
      const newTabData = { id: key, name: title };
      let newChilds = props.tabs.items;
      // 如果该 tab 已经存在，则不再添加
      const index = props.tabs.items.findIndex(
        (child) => child.id === newTabData.id
      );
      if (!(index > -1)) {
        newChilds = props.tabs.items.concat([newTabData]);
      }
      const newRootTabs = updateViewData(
        rootView,
        props.tabs.viewKey,
        newChilds
      );
      updateRootView(newRootTabs);
      setActiveTab(newTabData.id);
    },
    [
      activeViewKey,
      props.tabs.items,
      props.tabs.viewKey,
      setActiveTab,
      rootView,
      updateRootView,
    ]
  );

  const activeCurrentTabs = useCallback(() => {
    setActiveView(props.tabs.viewKey);
  }, [setActiveView]);

  useEffect(() => {
    /** 默认当前第一个 tabs 是活跃的 */
    if (!activeViewKey) {
      activeCurrentTabs();
    }

    const handleAddTab = ({ detail: { key, title } }) => addTab(key, title);

    document.addEventListener<any>('addTab', handleAddTab);
    return () => {
      document.removeEventListener<any>('addTab', handleAddTab);
    };
  }, [activeCurrentTabs]);

  const handleTabClick = (activeKey) => {
    if (activeViewKey !== props.tabs.viewKey) {
      activeCurrentTabs();
    }
    setActiveTab(activeKey);
  };

  const handleTabClose = (key) => {
    let newChilds = props.tabs.items;
    const index = props.tabs.items.findIndex((child) => child.id === key);
    if (index > -1) {
      newChilds = props.tabs.items.filter((child) => child.id !== key);
    }
    const newRootTabs = updateViewData(rootView, tabs.viewKey, newChilds);
    updateRootView(newRootTabs);

    if (newChilds.length === 0) {
      setActiveView(newRootTabs.viewKey);
    } else activeCurrentTabs();

    if (key === activeTab) {
      setActiveTab(newChilds?.at(-1)?.id || '');
    }
  };

  const handleTabEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action === 'remove') {
      handleTabClose(targetKey);
    } else {
      activeCurrentTabs();
      addTab(v4(), 'New Tab', false);
    }
  };

  if (tabsData.length === 0) {
    return <>{props.emptyContent}</>;
  }

  return (
    <div className="antd-tabs-container">
      <AntTabs
        className="antd-tabs-custom"
        onTabClick={handleTabClick}
        activeKey={activeTab}
        type="editable-card"
        onEdit={handleTabEdit}
      >
        {tabsData.length === 0 ? (
          <div>Empty</div>
        ) : (
          tabsData.map((tab) => {
            return (
              <TabPane
                key={tab?.id}
                tab={
                  <NameVessel
                    viewKey={tabs.viewKey}
                    viewData={tab}
                    children={tab.name}
                  />
                }
              >
                <ContentVessel
                  viewKey={tabs.viewKey}
                  children={props.renderContent(tab?.id, tab?.name)}
                />
              </TabPane>
            );
          })
        )}
      </AntTabs>
    </div>
  );
};
