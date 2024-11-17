import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

type TPortalProps = {
  children: React.ReactNode;
  portalId: string;
};

export const Portal: React.FC<TPortalProps> = ({ portalId, children }) => {
  const mount = document.getElementById(portalId);
  const el = document.createElement('div');

  useEffect(() => {
    mount?.appendChild(el);
    return () => {
      mount?.removeChild(el);
    };
  }, [el, mount]);

  return createPortal(children, el);
};
