import { Button } from 'antd';
import React from 'react';
import { v4 } from 'uuid';
import { SplitPanel, type IView } from '../../src';
import { Tabs, addTab } from './Tabs';
import './index.less';

const defaultView: IView = {
  parentViewKey: '',
  viewKey: '2ea3e78f-f9b7-42a4-9f6e-06431bfbcb22',
  isRoot: true,
  items: [],
  v: [
    {
      parentViewKey: '2ea3e78f-f9b7-42a4-9f6e-06431bfbcb22',
      viewKey: '0e0a8e9b-d3f6-4e44-9e93-c5d941c86b27',
      items: [],
      v: [],
      h: [
        {
          parentViewKey: '0e0a8e9b-d3f6-4e44-9e93-c5d941c86b27',
          viewKey: 'd026bbb2-205c-42f6-8c1c-7d5e7f1f8949',
          items: [
            { id: '944c6382-0192-4faa-bb2b-86efdbd52b2e', name: 'New Tab' },
            { id: '4c396e52-dea8-40d2-b176-7966d56a5bc7', name: 'New Tab' },
            { id: 'd222a660-6fd0-43d3-9290-d4848c5ddd18', name: 'New Tab' },
            { id: '9fb3e83a-e80d-4851-ae26-f5eb21ec6c40', name: 'New Tab' },
            { id: 'fa62cb3a-ed47-4cac-be2a-2d821c62dd05', name: 'New Tab' },
          ],
          v: [],
          h: [],
        },
        {
          parentViewKey: '0e0a8e9b-d3f6-4e44-9e93-c5d941c86b27',
          viewKey: 'bd9f5058-b92e-4134-a8ce-46ca479a8ee7',
          items: [
            { id: 'c88e9171-9461-483f-ba9a-f2d89dfe91c0', name: 'New Tab' },
            { id: '1a223e4d-a074-45c7-8532-e6d01488239d', name: 'New Tab' },
            { id: '43352627-eb38-4389-8641-faf728f89ff4', name: 'New Tab' },
          ],
          v: [],
          h: [],
        },
      ],
    },
    {
      parentViewKey: '2ea3e78f-f9b7-42a4-9f6e-06431bfbcb22',
      viewKey: '4d16a252-bfea-4068-86d2-3f070fb6b80b',
      items: [
        { id: '524f01be-b0fd-4421-96de-9cfc6bfdc54c', name: 'New Tab' },
        { id: '4faf47fe-02ae-44d8-97de-f853a9931567', name: 'New Tab' },
      ],
      v: [],
      h: [],
    },
  ],
  h: [],
};

const defaultActiveViewKey = '4d16a252-bfea-4068-86d2-3f070fb6b80b';

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
                  renderContent={(key, label) => <div>{`${key}-${label}`}</div>}
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
