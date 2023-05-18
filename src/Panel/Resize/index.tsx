import React, { useRef } from 'react';
import './index.less';

export interface ResizeHandleProps {
  /** resizing回调 */
  onResize?: (prevElement: HTMLElement, nextElement: HTMLElement) => void;
  /** resize完成回调  */
  onFinished?: () => void;
}

/** 水平方向分割条 */
export const ResizeHandleHorizontal = (props: ResizeHandleProps) => {
  const resizeHandleRefH = useRef<HTMLElement | null>();

  const startX = useRef<number>(0);
  const startPrevWidth = useRef<number>(0);
  const startNextWidth = useRef<number>(0);
  const prevElement = useRef<HTMLElement | null>();
  const nextElement = useRef<HTMLElement | null>();

  const requestFrame = useRef<number>(0);

  const setSize = (prev: number, next: number) => {
    const parentWidth = resizeHandleRefH.current!.parentElement!.offsetWidth;
    const prevEle = prevElement.current!;
    const nextEle = nextElement.current!;

    const prevMinResize = Number(prevEle!.dataset.minResize) || 0;
    const nextMinResize = Number(nextEle!.dataset.minResize) || 0;

    if (prevMinResize || nextMinResize) {
      if (
        prev * parentWidth <= prevMinResize ||
        next * parentWidth <= nextMinResize
      ) {
        return;
      }
    }

    if (prevEle) {
      prevEle.style.width = prev * 100 + '%';
    }

    if (nextEle) {
      nextEle.style.width = next * 100 + '%';
    }

    if (props.onResize && nextEle && prevEle) {
      props.onResize(prevEle, nextEle);
    }
  };

  const onMouseDown = (e) => {
    resizeHandleRefH.current?.classList.remove('active');

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    startX.current = e.pageX;
    startPrevWidth.current = prevElement.current!.offsetWidth;
    startNextWidth.current = nextElement.current!.offsetWidth;
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    const prevWidth = startPrevWidth.current + e.pageX - startX.current;
    const nextWidth = startNextWidth.current - (e.pageX - startX.current);
    if (requestFrame.current) {
      window.cancelAnimationFrame(requestFrame.current);
    }
    requestFrame.current = window.requestAnimationFrame(() => {
      const parentWidth = resizeHandleRefH.current!.parentElement!.offsetWidth;
      setSize(prevWidth / parentWidth, nextWidth / parentWidth);
    });
  };

  const onMouseUp = (e) => {
    resizeHandleRefH.current?.classList.remove('active');

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (props.onFinished) {
      props.onFinished();
    }
  };

  React.useEffect(() => {
    if (resizeHandleRefH.current) {
      resizeHandleRefH.current.addEventListener('mousedown', onMouseDown);
      prevElement.current = resizeHandleRefH.current
        .previousSibling as HTMLElement;
      nextElement.current = resizeHandleRefH.current.nextSibling as HTMLElement;
    }
    return () => {
      if (resizeHandleRefH.current) {
        resizeHandleRefH.current.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    };
  }, []);

  return (
    <div
      ref={(e) => {
        e && (resizeHandleRefH.current = e);
      }}
      className="resize-handle-horizontal"
    />
  );
};

/** 竖直方向分割条  */
export const ResizeHandleVertical = (props: ResizeHandleProps) => {
  const resizeHandleRefV = useRef<HTMLElement>();

  const startY = useRef<number>(0);
  const startPrevHeight = useRef<number>(0);
  const startNextHeight = useRef<number>(0);
  const prevElement = useRef<HTMLElement | null>();
  const nextElement = useRef<HTMLElement | null>();

  const requestFrame = useRef<number>(0);

  const setSize = (prev: number, next: number) => {
    const parentHeight = resizeHandleRefV.current!.parentElement!.offsetHeight;
    const prevEle = prevElement.current!;
    const nextEle = nextElement.current!;

    const prevMinResize = Number(prevEle!.dataset.minResize) || 0;
    const nextMinResize = Number(nextEle!.dataset.minResize) || 0;

    if (prevMinResize || nextMinResize) {
      if (
        prev * parentHeight <= prevMinResize ||
        next * parentHeight <= nextMinResize
      ) {
        return;
      }
    }

    if (prevEle) {
      prevEle.style.height = prev * 100 + '%';
    }

    if (nextEle) {
      nextEle.style.height = next * 100 + '%';
    }

    if (props.onResize && nextEle && prevEle) {
      props.onResize(prevEle, nextEle);
    }
  };

  const onMouseDown = (e) => {
    resizeHandleRefV.current?.classList.add('active');

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    startY.current = e.pageY;
    startPrevHeight.current = prevElement.current!.offsetHeight;
    startNextHeight.current = nextElement.current!.offsetHeight;
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    const prevHeight = startPrevHeight.current + e.pageY - startY.current;
    const nextHeight = startNextHeight.current - (e.pageY - startY.current);
    if (requestFrame.current) {
      window.cancelAnimationFrame(requestFrame.current);
    }
    requestFrame.current = window.requestAnimationFrame(() => {
      const parentHeight =
        resizeHandleRefV.current!.parentElement!.offsetHeight;
      setSize(prevHeight / parentHeight, nextHeight / parentHeight);
    });
  };

  const onMouseUp = (e) => {
    resizeHandleRefV.current?.classList.remove('active');

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (props.onFinished) {
      props.onFinished();
    }
  };

  React.useEffect(() => {
    if (resizeHandleRefV.current) {
      resizeHandleRefV.current!.addEventListener('mousedown', onMouseDown);
      prevElement.current = resizeHandleRefV.current!
        .previousSibling as HTMLElement;
      nextElement.current = resizeHandleRefV.current!
        .nextSibling as HTMLElement;
    }
    return () => {
      if (resizeHandleRefV.current) {
        resizeHandleRefV.current!.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    };
  }, []);

  return (
    <div
      ref={(e) => {
        e && (resizeHandleRefV.current = e);
      }}
      className={'resize-handle-vertical'}
    />
  );
};
