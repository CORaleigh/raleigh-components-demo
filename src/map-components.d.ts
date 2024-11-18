declare namespace JSX {
    interface IntrinsicElements {
      'map-web-component': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'item-id'?: string;
        search?: string;
        legend?: string;
        scale?: number | string;
        zoom?: number | string;
        'layer-list'?: string;
        address?: string;
        center?: string | undefined;
        stationary?: string;
        'top-right'?: string[];
        'top-left'?: string[];
        'bottom-right'?: string[];
        'bottom-left'?: string[];
        'expand-positions'?: string[];
        expanded?: string[];
        'filter-layer'?: string | undefined;
        'filter-query'?: string | undefined;
      };
      'find-my-service': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'group-id'?: string;
        categories?: string[];
      };
    }
  }
  