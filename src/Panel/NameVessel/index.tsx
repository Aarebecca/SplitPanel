import React from 'react';

interface Props {
  tabsKey: string;
  tabData: any;
  children: React.ReactNode | undefined;
}

type DragHandler = React.DragEventHandler<HTMLDivElement>;

export const NameVessel = ({ tabsKey, tabData, children }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const onDragStart: DragHandler = React.useCallback(
    (e) => {
      e.dataTransfer.setData(
        'text/plain',
        JSON.stringify({
          tabsKey,
          dragNode: tabData,
        })
      );
    },
    [tabData]
  );

  const onDragOver: DragHandler = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (ref.current) {
      ref.current.classList.add('dp-tabpane-dragover');
    }
  }, []);

  const onDragLeave: DragHandler = React.useCallback((e) => {
    if (ref.current) {
      ref.current.classList.remove('dp-tabpane-dragover');
    }
  }, []);

  const onDrop: DragHandler = React.useCallback(
    (e) => {
      if (ref.current) {
        ref.current.classList.remove('dp-tabpane-dragover');
      }
    },
    [tabData]
  );

  return (
    <div
      ref={ref}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
};
