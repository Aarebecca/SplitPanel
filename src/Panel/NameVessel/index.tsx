import React from 'react';

interface Props {
  viewKey: string;
  viewData: any;
  children: React.ReactNode | undefined;
}

type DragHandler = React.DragEventHandler<HTMLDivElement>;

export const NameVessel = ({ viewKey, viewData, children }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const onDragStart: DragHandler = React.useCallback(
    (e) => {
      e.dataTransfer.setData(
        'text/plain',
        JSON.stringify({
          viewKey,
          dragNode: viewData,
        })
      );
    },
    [viewData]
  );

  const onDragOver: DragHandler = React.useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (ref.current) {
      ref.current.classList.add('dp-viewpane-dragover');
    }
  }, []);

  const onDragLeave: DragHandler = React.useCallback((e) => {
    if (ref.current) {
      ref.current.classList.remove('dp-viewpane-dragover');
    }
  }, []);

  const onDrop: DragHandler = React.useCallback(
    (e) => {
      if (ref.current) {
        ref.current.classList.remove('dp-viewpane-dragover');
      }
    },
    [viewData]
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
