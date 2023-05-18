import { Tabs as AntTabs, type TabsProps } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import {
  ContentVessel,
  NameVessel,
  PanelContext,
  updateTabsData,
  type ITabs,
} from '../../../src';
import './index.less';

const { TabPane } = AntTabs;

interface Props {
  activeTabsKey: string;
  tabs: ITabs;
  emptyContent?: React.ReactNode;
  renderContent: (key: string, title: string) => React.ReactNode;
}

export function addTab(key: string, title: string) {
  document.dispatchEvent(new CustomEvent('addTab', { detail: { key, title } }));
}

export const Tabs: React.FC<Props> = (props) => {
  const { tabs } = props;
  const { items: tabsData = [] } = tabs;
  const { activeTabsKey, setActiveTabs, rootTabs, updateRootTabs } =
    useContext(PanelContext);
  const [activeTab, setActiveTab] = useState<string>(tabsData[0]?.id || '');

  const addTab = useCallback(
    (key: string, title: string, whenActive = true) => {
      // 该 tabs 不是活跃的，不处理
      if (whenActive && props.activeTabsKey !== props.tabs.tabsKey) return;
      const newTabData = { id: key, name: title };
      let newChilds = props.tabs.items;
      // 如果该 tab 已经存在，则不再添加
      const index = props.tabs.items.findIndex(
        (child) => child.id === newTabData.id
      );
      if (!(index > -1)) {
        newChilds = props.tabs.items.concat([newTabData]);
      }
      const newRootTabs = updateTabsData(
        rootTabs,
        props.tabs.tabsKey,
        newChilds
      );
      updateRootTabs(newRootTabs);
      setActiveTab(newTabData.id);
    },
    [
      props.activeTabsKey,
      props.tabs.items,
      props.tabs.tabsKey,
      setActiveTab,
      rootTabs,
      updateRootTabs,
    ]
  );

  const activeCurrentTab = () => {
    setActiveTabs(props.tabs.tabsKey);
  };

  useEffect(() => {
    /** 默认当前第一个 tabs 是活跃的 */
    if (!activeTabsKey) {
      activeCurrentTab();
    }

    const handleAddTab = ({ detail: { key, title } }) => addTab(key, title);

    document.addEventListener<any>('addTab', handleAddTab);
    return () => {
      document.removeEventListener<any>('addTab', handleAddTab);
    };
  }, [activeTabsKey, props.tabs.tabsKey, setActiveTabs]);

  const handleTabClick = (activeKey) => {
    if (activeTabsKey !== props.tabs.tabsKey) {
      activeCurrentTab();
    }
    setActiveTab(activeKey);
  };

  const handleTabClose = (key) => {
    let newChilds = props.tabs.items;
    const index = props.tabs.items.findIndex((child) => child.id === key);
    if (index > -1) {
      newChilds = props.tabs.items.filter((child) => child.id !== key);
    }
    const newRootTabs = updateTabsData(rootTabs, tabs.tabsKey, newChilds);
    updateRootTabs(newRootTabs);
    if (key === activeTab) {
      setActiveTab(newChilds?.at(-1)?.id || '');
    }
  };

  const handleTabEdit: TabsProps['onEdit'] = (targetKey, action) => {
    if (action === 'remove') {
      handleTabClose(targetKey);
    } else {
      activeCurrentTab();
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
        {tabsData.map((tab) => {
          return (
            <TabPane
              key={tab?.id}
              tab={
                <NameVessel
                  tabsKey={tabs.tabsKey}
                  tabData={tab}
                  children={tab.name}
                />
              }
            >
              <ContentVessel
                tabsKey={tabs.tabsKey}
                children={props.renderContent(tab?.id, tab?.name)}
              />
            </TabPane>
          );
        })}
      </AntTabs>
    </div>
  );
};
