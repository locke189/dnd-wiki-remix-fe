import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

type TPortalProps = {
  children: React.ReactNode;
  portalId: string;
};

export const Portal: React.FC<TPortalProps> = ({ portalId, children }) => {
  const [el, setEl] = React.useState<HTMLDivElement>();

  useEffect(() => {
    if (!document) {
      return;
    }
    const element = document.createElement('div');
    element.classList.add('w-full');

    setEl(element);
  }, []);

  useEffect(() => {
    const mount = document.getElementById(portalId);
    if (el) {
      mount?.appendChild(el);
      return () => {
        mount?.removeChild(el);
      };
    }
  }, [el, portalId]);

  return el && createPortal(children, el);
};
