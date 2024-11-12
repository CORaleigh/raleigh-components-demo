declare namespace JSX {
    interface IntrinsicElements {
      'map-web-component': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'item-id'?: string;
        search?: boolean;
        legend?: boolean;
        scale?: number | string;
        zoom?: number | string;
        'layer-list'?: boolean;
        address?: string;
        center?: string;
        stationary?: boolean;
        'top-right'?: string[];
        'top-left'?: string[];
        'bottom-right'?: string[];
        'bottom-left'?: string[];
        'expand-positions'?: string[];
        expanded?: string[];
      };
      'find-my-service': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'group-id'?: string;
        categories?: string[];
      };
    }
  }
  