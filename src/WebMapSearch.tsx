// WebMapSearch.tsx
import React, { useEffect, useRef, useState } from "react";
import Portal from "@arcgis/core/portal/Portal";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams";
import PortalItem from "@arcgis/core/portal/PortalItem";
import WebMap from "@arcgis/core/WebMap";
import {
  CalciteButton,
  CalciteInput,
  CalciteList,
  CalciteListItem,
  CalciteNotice,
  CalcitePagination,
  CalcitePanel,
  CalciteScrim,
} from "@esri/calcite-components-react";
import { CalciteListCustomEvent } from "@esri/calcite-components";
import { ArcgisMap } from "@arcgis/map-components-react";
import { ArcgisMapCustomEvent } from "@arcgis/map-components";
import "@esri/calcite-components/dist/components/calcite-pagination";
import "@esri/calcite-components/dist/components/calcite-notice";
import "@esri/calcite-components/dist/components/calcite-scrim";
import "@esri/calcite-components/dist/components/calcite-panel";

import esriConfig from "@arcgis/core/config.js"
interface WebMapSearchProps {
  organizationId: string; // ArcGIS organization ID
  onWebMapSelect: (webMapId: string) => void;
}

interface WebMapItem {
  id: string;
  title: string;
  snippet: string;
  thumbnailUrl: string;
}

const WebMapSearch: React.FC<WebMapSearchProps> = ({
  organizationId,
  onWebMapSelect,
}) => {
  const arcgisMap = useRef<HTMLArcgisMapElement>(null);
  const mapSearch = useRef<HTMLCalciteInputElement>(null);

  const [webMaps, setWebMaps] = useState<WebMapItem[]>([]);
  const [selectedWebMap, setSelectedWebMap] = useState<WebMap | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [mapHasErrors, setMapHasErrors] = useState(false);
  const fetchWebMaps = async (
    organizationId: string,
    query: string,
    start: number
  ) => {
    const portal = new Portal();
    //portal.authMode = "immediate";

    await portal.load();
    const queryParams = new PortalQueryParams({
      query: `${query} AND type:"Web Map" AND access:"public" AND orgid:"${organizationId}"`,
      num: 10, // Limit to 10 results for simplicity,
      start: start,
    });

    try {
      const result = await portal.queryItems(queryParams);
      setTotalResults(result.total);
      const items = result.results.map((item: PortalItem) => ({
        id: item.id,
        title: item.title,
        snippet: item.snippet,
        thumbnailUrl: item.thumbnailUrl,
      }));
      setWebMaps(items);
    } catch (error) {
      console.error("Error fetching web maps:", error);
    }
  };

  const handleViewReadyChange = React.useCallback(
    async (e: ArcgisMapCustomEvent<void>) => {
      if (selectedWebMap && e.target.itemId && e.target.ready) {
        const item = new PortalItem({
          id: e.target.itemId as string,
        });
        const m = await item.load();

        e.target.goTo(m.extent)

        
      }
    },
    [selectedWebMap]
  );

  useEffect(() => {
    esriConfig.request.useIdentity = false;
    fetchWebMaps(
      organizationId,
      mapSearch.current?.value.length ? mapSearch.current.value : "*",
      0
    );

  }, [organizationId]);

  const handleMapSelect = async (e: CalciteListCustomEvent<void>) => {
    if (e.target.selectedItems.length) {
      const map = new WebMap({
        portalItem: {
          id: e.target.selectedItems[0].value,
        },
      });

      setMapHasErrors(false);
      setSelectedWebMap(map);
    }
  };

  return (
    <div className="dialog-content">
      <CalciteInput
        ref={mapSearch}
        placeholder="Search for web map"
        onCalciteInputInput={(e) =>
          fetchWebMaps(
            organizationId,
            e.target.value.length ? e.target.value : "*",
            0
          )
        }
      ></CalciteInput>
       
      <div className="search-container">
        <div className="map-list">
          <CalciteList
            selectionMode="single"
            onCalciteListChange={handleMapSelect}
          >
            {webMaps.map((webMap) => (
              <CalciteListItem
                key={webMap.id}
                description={webMap.snippet}
                label={webMap.title}
                value={webMap.id}
              >
                <img slot="content-start" src={webMap.thumbnailUrl}></img>
              </CalciteListItem>
            ))}
          </CalciteList>
          <div className="example-wrapper">
            <CalcitePagination
              pageSize={10}
              totalItems={totalResults}
              onCalcitePaginationChange={(e) => {
                fetchWebMaps(
                  organizationId,
                  mapSearch.current?.value.length
                    ? mapSearch.current?.value
                    : "*",
                  e.target.startItem
                );
              }}
            ></CalcitePagination>
          </div>
        </div>
        <div className="map-preview">
            <CalcitePanel>
          {!selectedWebMap && <CalciteScrim>Select a web map</CalciteScrim>}
          {mapHasErrors && <CalciteScrim><CalciteNotice
                icon="exclamation-mark-triangle-f"
                kind="danger"
                open={mapHasErrors ? true : undefined}
              >
                <div slot="message">
                  Map contains layers that are not shared publicly
                </div>
              </CalciteNotice></CalciteScrim>}

          {selectedWebMap && !mapHasErrors && (
            <>
              <ArcgisMap
                ref={arcgisMap}
                id="preview-map"
                itemId={selectedWebMap?.portalItem.id}
                onArcgisViewReadyChange={handleViewReadyChange}
              ></ArcgisMap>
              {!mapHasErrors && (
                <CalciteButton
                  width="full"
                  onClick={() => {
                    if (selectedWebMap) {
                      onWebMapSelect(selectedWebMap.portalItem.id);
                    }
                  }}
                >
                  Select
                </CalciteButton>
              )}

              
            </>
          )}
           </CalcitePanel>

        </div>
      </div>
    </div>
  );
};

export default WebMapSearch;
