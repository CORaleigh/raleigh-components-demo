import "./App.css";
import "@esri/calcite-components/dist/components/calcite-list";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-select";
import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-dialog";
import "@esri/calcite-components/dist/components/calcite-button";

import "@esri/calcite-components/dist/components/calcite-option";
import "@esri/calcite-components/dist/components/calcite-switch";
import "@esri/calcite-components/dist/components/calcite-accordion";
import "@esri/calcite-components/dist/components/calcite-accordion-item";
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-navigation";
import "@esri/calcite-components/dist/components/calcite-navigation-logo";

import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-block";

import {
  CalciteAction,
  CalciteBlock,
  CalciteButton,
  CalciteDialog,
  CalciteInput,
  CalciteLabel,
  CalciteList,
  CalciteListItem,
  CalciteNavigation,
  CalciteNavigationLogo,
  CalciteOption,
  CalcitePanel,
  CalciteSelect,
  CalciteShell,
  CalciteShellPanel,
  CalciteSwitch,
} from "@esri/calcite-components-react";
import { useEffect, useRef, useState } from "react";
import WebMapSearch from "./WebMapSearch";
interface ValidationConstraint {
  id: string;
  patterns: ValidationPattern[];
}
interface ValidationPattern {
  value: RegExp;
  message: string;
  icon: string;
}

interface Widget {
  label: string;
  id: string;
}
function App() {
  const widgets: Widget[] = [
    {label: 'Search', id: 'search'},
    {label: 'Layer List', id: 'layer-list'},
    {label: 'Legend', id: 'legend'},
  ]
  const [categories, setCategories] = useState([
    "Community",
    "Elections",
    "Environmental",
    "Leaf Collection",
    "Recreation",
    "Solid Waste",
  ]);
  const [htmlTag, setHtmlTag] = useState("");
  const [component, setComponent] = useState("Web Map");
  const [groupId, setGroupId] = useState("a8acaca3d4514d40bc7f302a8db291fb");
  const [webMapId, setWebMapId] = useState("d5dda743788a4b0688fe48f43ae7beb9");
  const [address, setAddress] = useState<string | undefined>();
  const addressInput = useRef<HTMLCalciteInputElement>(null);

  const [stationary, setStationary] = useState(false);
  const [zoom, setZoom] = useState<number>();
  const [center, setCenter] = useState<string>();

  const [topLeftPosition, setTopLeftPosition] = useState<string[]>([]);
  const [topRightPosition, setTopRightPosition] = useState<string[]>([]);

  const [bottomLeftPosition, setBottomLeftPosition] = useState<string[]>([]);
  const [bottomRightPosition, setBottomRightPosition] = useState<string[]>([]);

  const [mapWidgets, setMapWidgets] = useState<string[]>([]);
  const [expandableWidgets, setExpandableWidgets] = useState<string[]>([]);
  const [expandedWidgets, setExpandedWidgets] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const [showSettings, setShowSettings] = useState<boolean>(true);

  const [overlay, setOverlay] = useState<boolean>(false);

  useEffect(() => {
    let element;
    if (component === "Find My Service") {
      element = document.querySelector("find-my-service");
    }
    if (component === "Web Map") {
      element = document.querySelector("map-web-component");
    }
    if (element) {
      setHtmlTag(
        element.outerHTML
          .replace(element.innerHTML as string, "")
          .replace(/=""/g, "")
      );
    }
  }, [
    component,
    categories,
    groupId,
    webMapId,
    address,
    stationary,
    zoom,
    center,
    topLeftPosition,
    topRightPosition,
    bottomLeftPosition,
    bottomRightPosition,
    mapWidgets,
    expandableWidgets,
    expandedWidgets,
  ]);

  const centerValid = (center: string | undefined) => {
    const centerInput = document.getElementById(
      "center"
    ) as HTMLCalciteInputElement;
    if (centerInput) {
      if (centerInput.status !== "invalid") {
        return center;
      } else {
        return undefined;
      }
    }
  };

  useEffect(() => {
    const handleResize = () => setOverlay(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Defines an array of objects with validation constraints, icons, and messages for fields.
    if (component === "Web Map") {
      const validationConstraints: ValidationConstraint[] = [
        {
          id: "center",
          patterns: [
            {
              value:
                /^(-?(1[0-7][0-9]|[1-9]?[0-9]|180)(\.\d{1,6})?),\s*(-?(90|[1-8]?[0-9])(\.\d{1,6})?)$/,
              message:
                "Coordinates not valid, needs to be 'longitude,latitude'",
              icon: "exclamation-mark-triangle-f",
            },
          ],
        },
      ];

      // Specifies the custom validationMessage, validationIcon, and status when the user interacts with the component.
      function setCustomValidity(
        el: HTMLCalciteInputElement,
        message: string,
        icon: string
      ) {
        if (message) {
          el.validationMessage = message;
          el.validationIcon = icon;
          el.status = "invalid";
        } else {
          el.validationMessage = "";
          el.validationIcon = false;
          el.status = "idle";
        }
      }
      //window.onload = () => {
      // Adds event listeners to form elements to update the validationMessage, validationIcon, and status on blur.
      validationConstraints.forEach((constraint) => {
        document
          .querySelector(`#${constraint.id}`)
          ?.addEventListener("blur", ({ target }) => {
            // Set a custom validationMessage for the 'pattern' constraint.
            if (
              typeof constraint?.patterns === "object" &&
              constraint?.patterns?.length > 0 &&
              (target as HTMLCalciteInputElement).value
            ) {
              for (const pattern of constraint.patterns) {
                if (
                  !(target as HTMLCalciteInputElement).value?.match(
                    pattern?.value
                  )
                ) {
                  setCustomValidity(
                    target as HTMLCalciteInputElement,
                    pattern?.message,
                    pattern?.icon ?? true
                  );
                  return;
                }
              }
            }
            // Clear the custom validation message if all of the constraints are met.
            setCustomValidity(target as HTMLCalciteInputElement, "", "");
          });
      });
      // };
    }
  }, [component]);

  const updatePosition = (position: string, widget: string) => {
    if (position === "top-left") {
      setTopLeftPosition((prevState) => [...prevState, widget]);
      setTopRightPosition(topRightPosition.filter((item) => item !== widget));
      setBottomLeftPosition(
        bottomLeftPosition.filter((item) => item !== widget)
      );
      setBottomRightPosition(
        bottomRightPosition.filter((item) => item !== widget)
      );
    }
    if (position === "top-right") {
      setTopRightPosition((prevState) => [...prevState, widget]);
      setTopLeftPosition(topLeftPosition.filter((item) => item !== widget));
      setBottomLeftPosition(
        bottomLeftPosition.filter((item) => item !== widget)
      );
      setBottomRightPosition(
        bottomRightPosition.filter((item) => item !== widget)
      );
    }
    if (position === "bottom-left") {
      setBottomLeftPosition((prevState) => [...prevState, widget]);
      setTopLeftPosition(topLeftPosition.filter((item) => item !== widget));
      setTopRightPosition(topRightPosition.filter((item) => item !== widget));
      setBottomRightPosition(
        bottomRightPosition.filter((item) => item !== widget)
      );
    }
    if (position === "bottom-right") {
      setTopRightPosition((prevState) => [...prevState, widget]);
      setTopLeftPosition(topLeftPosition.filter((item) => item !== widget));
      setTopRightPosition(topRightPosition.filter((item) => item !== widget));
      setBottomLeftPosition(
        bottomLeftPosition.filter((item) => item !== widget)
      );
    }
  };
  return (
    <>
      <CalciteShell>
        <CalciteNavigation slot="header">
          <CalciteAction
            slot="logo"
            icon="gear"
            text={""}
            onClick={() => setShowSettings((prevState) => !prevState)}
          ></CalciteAction>
          <CalciteNavigationLogo
            slot="logo"
            heading="Raleigh Web Components"
          ></CalciteNavigationLogo>
        </CalciteNavigation>
        <CalciteShellPanel
          displayMode={overlay ? "overlay" : "dock"}
          collapsed={!showSettings}
          widthScale="l"
          slot="panel-start"
          position="start"
          id="shell-panel-start"
        >
          <CalcitePanel heading="Settings">
            <CalciteLabel>
              Select Component
              <CalciteSelect
                onCalciteSelectChange={(e) =>
                  setComponent(e.target.selectedOption.value)
                }
                label={""}
              >
                <CalciteOption
                  selected={component === "Web Map"}
                  value="Web Map"
                  label="Web Map"
                ></CalciteOption>
                <CalciteOption
                  selected={component === "Find My Service"}
                  value="Find My Service"
                  label="Find My Service"
                ></CalciteOption>                
              </CalciteSelect>
            </CalciteLabel>
            {component === "Find My Service" && (
              <>
                <CalciteLabel>
                  Group ID
                  <CalciteInput
                    onCalciteInputChange={(e) => setGroupId(e.target.value)}
                    value={groupId}
                  ></CalciteInput>
                </CalciteLabel>
                <CalciteLabel>
                  Categories
                  <CalciteList
                    selectionMode="multiple"
                    onCalciteListChange={(e) => {
                      const selected = e.target.selectedItems.map((item) => {
                        return item.value;
                      });
                      setCategories(selected);
                    }}
                  >
                    <CalciteListItem
                      selected={categories.includes("Community")}
                      value="Community"
                      label="Community"
                    ></CalciteListItem>
                    <CalciteListItem
                      selected={categories.includes("Elections")}
                      value="Elections"
                      label="Elections"
                    ></CalciteListItem>
                    <CalciteListItem
                      selected={categories.includes("Environmental")}
                      value="Environmental"
                      label="Environmental"
                    ></CalciteListItem>
                    <CalciteListItem
                      selected={categories.includes("Leaf Collection")}
                      value="Leaf Collection"
                      label="Leaf Collection"
                    ></CalciteListItem>
                    <CalciteListItem
                      selected={categories.includes("Recreation")}
                      value="Recreation"
                      label="Recreation"
                    ></CalciteListItem>
                    <CalciteListItem
                      selected={categories.includes("Solid Waste")}
                      value="Solid Waste"
                      label="Solid Waste"
                    ></CalciteListItem>
                  </CalciteList>
                </CalciteLabel>
              </>
            )}
            {component === "Web Map" && (
              <>
                <CalciteBlock open collapsible heading={"Map"} iconStart="map">
                  <CalciteLabel>
                    Web Map ID
                    <CalciteInput
                      onCalciteInputChange={(e) => setWebMapId(e.target.value)}
                      value={webMapId}
                    >
                      <CalciteButton
                        kind="inverse"
                        iconStart="magnifying-glass"
                        slot="action"
                        scale="m"
                        onClick={() => setShowSearch((prevState) => !prevState)}
                      ></CalciteButton>
                    </CalciteInput>
                  </CalciteLabel>
                  <CalciteLabel>
                    Stationary
                    <CalciteSwitch
                      onCalciteSwitchChange={() =>
                        setStationary((prevState) => !prevState)
                      }
                      checked={stationary ? true : undefined}
                    ></CalciteSwitch>
                  </CalciteLabel>
                </CalciteBlock>
                
                <CalciteBlock collapsible heading={"Location"} iconStart="pin">
                  <CalciteLabel>
                    Address
                    <CalciteInput
                      ref={addressInput}
                      onCalciteInputChange={(e) => setAddress(e.target.value)}
                    >
                      <CalciteButton
                        kind="inverse"
                        iconStart="magnifying-glass"
                        slot="action"
                        scale="m"
                        onClick={() => {
                          if (addressInput.current) {
                            setAddress(undefined);
                            setTimeout(() => {
                              setAddress(addressInput.current?.value);
                            });
                          }
                        }}
                      ></CalciteButton>
                    </CalciteInput>
                  </CalciteLabel>
                  <CalciteLabel>
                    Center
                    <CalciteInput
                      id="center"
                      pattern="^(-?(1[0-7][0-9]|[1-9]?[0-9]|180)(\.\d{1,6})?),\s*(-?(90|[1-8]?[0-9])(\.\d{1,6})?)"
                      onCalciteInputChange={(e) => setCenter(e.target.value)}
                    ></CalciteInput>
                  </CalciteLabel>
                  <CalciteLabel>
                    Zoom Level
                    <CalciteInput
                      type="number"
                      max={20}
                      min={0}
                      onCalciteInputChange={(e) => {
                        const zoomValue = parseInt(e.target.value);
                        setZoom(isNaN(zoomValue) ? undefined : zoomValue);
                      }}
                    ></CalciteInput>
                  </CalciteLabel>
                </CalciteBlock>

                <CalciteBlock collapsible heading="Widgets" iconStart="add-in">
                  <CalciteList
                    selectionMode="multiple"
                    onCalciteListChange={(e) => {
                      const selected = e.target.selectedItems.map((item) => {
                        return item.value;
                      });
                      selected.forEach((item) => {
                        if (
                          !topLeftPosition.includes(item) &&
                          !topRightPosition.includes(item) &&
                          !bottomLeftPosition.includes(item) &&
                          !bottomRightPosition.includes(item)
                        ) {
                          updatePosition("top-left", item);
                        }
                      });
                      setMapWidgets(selected);
                    }}
                  >
                    {widgets.map((widget: Widget) => {
                        return <CalciteListItem
                        selected={mapWidgets.includes(widget.id)}
                        value={widget.id}
                        label={widget.label}
                        key={widget.id}
                      >
                        {mapWidgets.includes(widget.id) && <div slot="content-bottom">
                          <CalciteLabel layout="inline-space-between">
                            Position
                            <CalciteSelect
  
                              label={""}
                              onCalciteSelectChange={(e) => {
                                updatePosition(
                                  e.target.selectedOption.value,
                                  widget.id
                                );
                              }}
                            >
                              <CalciteOption
                                value="top-left"
                                label="top-left"
                              ></CalciteOption>
                              <CalciteOption
                                value="top-right"
                                label="top-right"
                              ></CalciteOption>
                              <CalciteOption
                                value="bottom-left"
                                label="bottom-left"
                              ></CalciteOption>
                              <CalciteOption
                                value="bottom-right"
                                label="bottom-right"
                              ></CalciteOption>
                            </CalciteSelect>
                          </CalciteLabel>
                          <CalciteLabel layout="inline-space-between">
                            Expandable?
                            <CalciteSwitch checked={expandableWidgets.includes(widget.id) ? true : undefined} onCalciteSwitchChange={(e) => {
                                const { checked } = e.target;
  
                                setExpandableWidgets((prevItems) => {if (checked) {
                                  // Add value if checkbox is checked and it's not already in the list
                                  return [...prevItems, widget.id];
                                } else {
                                  // Remove value if checkbox is unchecked
                                  return prevItems.filter((item) => item !== widget.id);
                                }})
                            }}>
                            </CalciteSwitch>
                          </CalciteLabel>
                          <CalciteLabel layout="inline-space-between">
                            Expanded?
                            <CalciteSwitch checked={expandedWidgets.includes(widget.id) ? true : undefined} onCalciteSwitchChange={(e) => {
                                const { checked } = e.target;
  
                                setExpandedWidgets((prevItems) => {if (checked) {
                                  // Add value if checkbox is checked and it's not already in the list
                                  return [...prevItems, widget.id];
                                } else {
                                  // Remove value if checkbox is unchecked
                                  return prevItems.filter((item) => item !== widget.id);
                                }})
                            }}>
                            </CalciteSwitch>
                          </CalciteLabel>
                        </div>
                        }
                      </CalciteListItem>
                    })}

                  </CalciteList>
                </CalciteBlock>
              </>
            )}
          </CalcitePanel>
        </CalciteShellPanel>
        <CalcitePanel>
          <div className="code-container">
            <code>{htmlTag}</code>
          </div>

          {component === "Find My Service" && (
            <find-my-service
              group-id={groupId}
              categories={categories}
            ></find-my-service>
          )}
          {component === "Web Map" && (
            <map-web-component
              address={address}
              top-left={
                topLeftPosition.length > 0 ? topLeftPosition : undefined
              }
              top-right={
                topRightPosition.length > 0 ? topRightPosition : undefined
              }
              bottom-left={
                bottomLeftPosition.length > 0 ? bottomLeftPosition : undefined
              }
              bottom-right={
                bottomRightPosition.length > 0 ? bottomRightPosition : undefined
              }
              expandable-widgets={
                expandableWidgets.length > 0 ? expandableWidgets : undefined
              }
              expanded-widgets={
                expandedWidgets.length > 0 ? expandedWidgets : undefined
              }
              item-id={webMapId}
              layer-list={mapWidgets.includes("layer-list") ? "" : undefined}
              stationary={stationary ? "" : undefined}
              zoom={zoom}
              center={centerValid(center)}
              search={mapWidgets.includes("search") ? "" : undefined}
              legend={mapWidgets.includes("legend") ? "" : undefined}
            ></map-web-component>
          )}
        </CalcitePanel>
      </CalciteShell>
      <CalciteDialog
        heading="Select A Web Map"
        open={showSearch}
        onCalciteDialogClose={() => setShowSearch(false)}
        widthScale="l"
      >
        <WebMapSearch
          organizationId={"v400IkDOw1ad7Yad"}
          onWebMapSelect={(id: string) => {
            setWebMapId(id);
            setShowSearch((prevState) => !prevState);
          }}
        ></WebMapSearch>
      </CalciteDialog>
    </>
  );
}

export default App;
