import { Button } from 'antd';
import React from 'react';
import { v4 } from 'uuid';
import { SplitPanel } from '../../src';
import { Tabs, addTab } from './Tabs';
import './index.less';
import { log } from 'console';

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
            renderComponent={(tabs, activeTabsKey) => {
              console.log(tabs);
              return (
                <Tabs
                  tabs={tabs}
                  activeTabsKey={activeTabsKey}
                  renderContent={(key, name) => <div>{`${key}-${name}`}</div>}
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
