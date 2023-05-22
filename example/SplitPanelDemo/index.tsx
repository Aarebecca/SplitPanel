import { Button } from 'antd';
import React from 'react';
import { v4 } from 'uuid';
import { SplitPanel, type IView } from '../../src';
import { Tabs, addTab } from './Tabs';
import './index.less';

const defaultView: IView = {
  isRoot: true,
  items: [
    {
      name: 'DSL查询 1',
      id: '19bf97e4-fc19-4592-bbcb-cb9614b82eec',
      asset: {
        fn: () => {},
      },
    },
    {
      name: 'DSL查询 2',
      id: '00a7373a-5c15-4984-8e3c-ba22adab2159',
      asset: {
        fn: () => {},
      },
    },
    {
      name: 'DSL查询 3',
      id: '0911d246-2ab4-46f6-bda8-4ff146f2e980',
      asset: {
        fn: () => {},
      },
    },
  ],
  parentViewKey: '',
  viewKey: 'root-view',
};

const defaultActiveViewKey = 'root-view';

const TabContent = React.memo(({ id, label }: any) => {
  return <div>{`${id}-${label}`}</div>;
});

const SplitPanelDemo: React.FC = () => {
  const addNewTab = () => {
    addTab(v4(), `New Tab`);
  };

  return (
    <div className="split-panel-demo">
      <div className="body">
        <Button onClick={addNewTab}>Add Tab</Button>
        <div className="body-content">
          <SplitPanel
            cacheView={true}
            defaultView={defaultView}
            defaultActiveViewKey={defaultActiveViewKey}
            onActiveViewChange={(key) => {
              console.log('active view change:', key);
            }}
            onViewChange={(view) => {
              console.log('view change:', view);
            }}
            renderComponent={({ view, rootView }) => {
              return (
                <Tabs
                  tabs={view}
                  rootTabs={rootView}
                  emptyContent={
                    <div>⬅️Click "Add Tab" Button to add new tab.</div>
                  }
                  renderContent={(id, label) => {
                    return <TabContent key={id} id={id} label={label} />;
                  }}
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplitPanelDemo;
