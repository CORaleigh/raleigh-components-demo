


import './App.css'
import "@esri/calcite-components/dist/components/calcite-list";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-select";
import "@esri/calcite-components/dist/components/calcite-label";

import "@esri/calcite-components/dist/components/calcite-option";
import "@esri/calcite-components/dist/components/calcite-switch";
import "@esri/calcite-components/dist/components/calcite-accordion";
import "@esri/calcite-components/dist/components/calcite-accordion-item";

import { CalciteAccordion, CalciteAccordionItem, CalciteInput, CalciteLabel, CalciteList, CalciteListItem, CalciteOption, CalciteSelect, CalciteSwitch } from "@esri/calcite-components-react";
import { useEffect, useState } from 'react';
interface ValidationConstraint {
  id: string;
  patterns: ValidationPattern[];
}
interface ValidationPattern {
  value: RegExp;
  message: string;
  icon: string;
}
function App() {

  const [categories, setCategories] = useState([
    'Community', 
    'Elections',
    'Environmental',
    'Leaf Collection',
    'Recreation',
    'Solid Waste'
  ])
  const [htmlTag, setHtmlTag] = useState('');
  const [component, setComponent] = useState('Find My Service')
  const [groupId, setGroupId] = useState('a8acaca3d4514d40bc7f302a8db291fb')
  const [webMapId, setWebMapId] = useState('')
  const [address, setAddress] = useState<string>('');
  const [stationary, setStationary] = useState(false);
  const [zoom, setZoom] = useState<number>();
  const [center, setCenter] = useState<string>();

  const [topLeftPosition, setTopLeftPosition] = useState<string[]>([])
  const [topRightPosition, setTopRightPosition] = useState<string[]>([])

  const [bottomLeftPosition, setBottomLeftPosition] = useState<string[]>([])
  const [bottomRightPosition, setBottomRightPosition] = useState<string[]>([])

  const [mapWidgets, setMapWidgets] = useState<string[]>([]);
  const [expandableWidgets, setExpandableWidgets] = useState<string[]>([]);
  const [expandedWidgets, setExpandedWidgets] = useState<string[]>([]);

  useEffect(() => {
    let element;
    if (component === 'Find My Service') {
      element = document.querySelector('find-my-service')
    }
    if (component === 'Web Map') {
      element = document.querySelector('map-web-component')
    }
    if (element) {
      setHtmlTag(element.outerHTML.replace(element.innerHTML as string, '').replace('=""', ''));
    }
  }, [component,categories,groupId,webMapId,address,stationary,zoom,center,
    topLeftPosition,topRightPosition,bottomLeftPosition, bottomRightPosition,
    mapWidgets, expandableWidgets, expandedWidgets
  ])

  const centerValid = (center: string) => {
    
    const centerInput = document.getElementById('center') as HTMLCalciteInputElement;
    if (centerInput) {
      
      if (centerInput.status !== 'invalid') {
        return center;
      } else {
        return undefined;
      }
    }
  }
  const validationConstraints: ValidationConstraint[] = [
    {
      id: "center",
      patterns: [
        {
          value: /^(-?(1[0-7][0-9]|[1-9]?[0-9]|180)(\.\d{1,6})?),\s*(-?(90|[1-8]?[0-9])(\.\d{1,6})?)$/,
          message: "Coordinates not valid, needs to be 'longitude,latitude'",
          icon: "exclamation-mark-triangle-f"
        }
      ]
    }
  ];

  // Specifies the custom validationMessage, validationIcon, and status when the user interacts with the component.
  function setCustomValidity(el: HTMLCalciteInputElement, message: string, icon: string) {
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
  useEffect(() => {
    // Defines an array of objects with validation constraints, icons, and messages for fields.
    if (component === 'Web Map') {

    //window.onload = () => {
      // Adds event listeners to form elements to update the validationMessage, validationIcon, and status on blur.
      validationConstraints.forEach(constraint => {
        document.querySelector(`#${constraint.id}`)?.addEventListener("blur", ({ target }) => {
          
          // Set a custom validationMessage for the 'pattern' constraint.
          if (typeof constraint?.patterns === "object" && constraint?.patterns?.length > 0 && (target as HTMLCalciteInputElement).value) {
            for (const pattern of constraint.patterns) {
              if (!(target as HTMLCalciteInputElement).value?.match(pattern?.value)) {
                
                setCustomValidity((target as HTMLCalciteInputElement), pattern?.message, pattern?.icon ?? true);
                return;
              }
            }
          }
          // Clear the custom validation message if all of the constraints are met.
          setCustomValidity((target as HTMLCalciteInputElement), "", "");
        });
      });
   // };
    }
  }, [component, validationConstraints])

  const updatePosition = (position: string, widget: string) => {
    if (position === 'top-left') {
      setTopLeftPosition(prevState => [...prevState, widget]);
      setTopRightPosition(topRightPosition.filter(
        item => item !== widget
      ));
      setBottomLeftPosition(bottomLeftPosition.filter(
        item => item !== widget
      ));
      setBottomRightPosition(bottomRightPosition.filter(
        item => item !== widget
      ));            
    }
    if (position=== 'top-right') {
      setTopRightPosition(prevState => [...prevState, widget]);
      setTopLeftPosition(topLeftPosition.filter(
        item => item !== widget
      ));
      setBottomLeftPosition(bottomLeftPosition.filter(
        item => item !== widget
      ));
      setBottomRightPosition(bottomRightPosition.filter(
        item => item !== widget
      ));   
    }
    if (position=== 'bottom-left') {
      setBottomLeftPosition(prevState => [...prevState, widget]);
      setTopLeftPosition(topLeftPosition.filter(
        item => item !== widget
      ));
      setTopRightPosition(topRightPosition.filter(
        item => item !== widget
      ));
      setBottomRightPosition(bottomRightPosition.filter(
        item => item !== widget
      ));  
    }
    if (position=== 'bottom-right') {
      setTopRightPosition(prevState => [...prevState, widget]);
      setTopLeftPosition(topLeftPosition.filter(
        item => item !== widget
      ));
      setTopRightPosition(topRightPosition.filter(
        item => item !== widget
      ));
      setBottomLeftPosition(bottomLeftPosition.filter(
        item => item !== widget
      ));
    }        
  }
  return (
    <>
    <CalciteLabel>
      Select Component
      <CalciteSelect onCalciteSelectChange={(e) => setComponent(e.target.selectedOption.value)} label={''}>
      <CalciteOption selected={component === 'Find My Service'} value="Find My Service" label='Find My Service'></CalciteOption>
        <CalciteOption selected={component === 'Web Map'} value="Web Map" label='Web Map'></CalciteOption>
      </CalciteSelect>
    </CalciteLabel>
    <code>{htmlTag}</code>
    {component === 'Find My Service' && 
    
    <div className='component-container'>
      <div className='settings'>
      <CalciteLabel>
          Group ID
          <CalciteInput onCalciteInputChange={e => setGroupId(e.target.value)} value={groupId}></CalciteInput>
        </CalciteLabel>
      <CalciteLabel>
        Categories
      <CalciteList selectionMode='multiple' onCalciteListChange={(e) => {
    const selected = e.target.selectedItems.map(item => {
        return item.value;
    });
    setCategories(selected);
  }}>
    <CalciteListItem selected={categories.includes('Community')} value="Community" label='Community'></CalciteListItem>
    <CalciteListItem selected={categories.includes('Elections')} value="Elections" label='Elections'></CalciteListItem>
    <CalciteListItem selected={categories.includes('Environmental')} value="Environmental" label='Environmental'></CalciteListItem>
    <CalciteListItem selected={categories.includes('Leaf Collection')} value="Leaf Collection" label='Leaf Collection'></CalciteListItem>
    <CalciteListItem selected={categories.includes('Recreation')} value="Recreation" label='Recreation'></CalciteListItem>
    <CalciteListItem selected={categories.includes('Solid Waste')} value="Solid Waste" label='Solid Waste'></CalciteListItem>
</CalciteList>
</CalciteLabel>

      </div>
      <div className='component'>
      <find-my-service group-id={groupId}
  categories={categories}
></find-my-service>
      </div>

    </div>
      

    }
    {component === 'Web Map' && 
      <div className='component-container'>
        <div className='settings'>
        <CalciteLabel>
          Web Map ID
          <CalciteInput onCalciteInputChange={e => setWebMapId(e.target.value)} value={webMapId}></CalciteInput>
        </CalciteLabel>
        <CalciteLabel>
          Stationary
          <CalciteSwitch onCalciteSwitchChange={() => setStationary(prevState => !prevState)} checked={stationary ? true : undefined}></CalciteSwitch>
        </CalciteLabel>        
        <CalciteLabel>
          Address
          <CalciteInput onCalciteInputChange={e => setAddress(e.target.value)}></CalciteInput>
        </CalciteLabel>
        <CalciteLabel>
          Center
          <CalciteInput id="center" pattern='^(-?(1[0-7][0-9]|[1-9]?[0-9]|180)(\.\d{1,6})?),\s*(-?(90|[1-8]?[0-9])(\.\d{1,6})?)' onCalciteInputChange={e => setCenter(e.target.value)}></CalciteInput>
        </CalciteLabel>        
        <CalciteLabel>
          Zoom Level
          <CalciteInput type='number' max={20} min={0} onCalciteInputChange={e => setZoom(parseFloat(e.target.value))}></CalciteInput>
        </CalciteLabel>        
        <CalciteAccordion>
          <CalciteAccordionItem heading='Widgets'>
            <CalciteList selectionMode='multiple' onCalciteListChange={(e) => {
                const selected = e.target.selectedItems.map(item => {
                      return item.value;
                });
                selected.forEach(item => {
                  if (!topLeftPosition.includes(item) && !topRightPosition.includes(item) && !bottomLeftPosition.includes(item) && !bottomRightPosition.includes(item)) {
                    updatePosition('top-left', item);
                  }
                })
              setMapWidgets(selected);
          }}>
            <CalciteListItem selected={mapWidgets.includes('layer-list')} value="layer-list" label='Layer List'>
              <CalciteSelect slot="actions-end" label={''} onCalciteSelectChange={
                e => {
                  updatePosition(e.target.selectedOption.value, 'layer-list');
                }
              }>
                <CalciteOption value="top-left" label='top-left'></CalciteOption>
                <CalciteOption value="top-right" label='top-right'></CalciteOption>
                <CalciteOption value="bottom-left" label='bottom-left'></CalciteOption>
                <CalciteOption value="bottom-right" label='bottom-right'></CalciteOption>

              </CalciteSelect>
            </CalciteListItem>
            <CalciteListItem selected={mapWidgets.includes('search')} value="search" label='Search'>
            <CalciteSelect slot="actions-end" label={''} onCalciteSelectChange={
                e => {
                  updatePosition(e.target.selectedOption.value, 'search');
                }
              }>
                <CalciteOption value="top-left" label='top-left'></CalciteOption>
                <CalciteOption value="top-right" label='top-right'></CalciteOption>
                <CalciteOption value="bottom-left" label='bottom-left'></CalciteOption>
                <CalciteOption value="bottom-right" label='bottom-right'></CalciteOption>

              </CalciteSelect>
            
            </CalciteListItem>
            <CalciteListItem selected={mapWidgets.includes('legend')} value="legend" label='Legend'>
            <CalciteSelect slot="actions-end" label={''} onCalciteSelectChange={
                e => {
                  updatePosition(e.target.selectedOption.value, 'legend');
                }
              }>
                <CalciteOption value="top-left" label='top-left'></CalciteOption>
                <CalciteOption value="top-right" label='top-right'></CalciteOption>
                <CalciteOption value="bottom-left" label='bottom-left'></CalciteOption>
                <CalciteOption value="bottom-right" label='bottom-right'></CalciteOption>

              </CalciteSelect>
            </CalciteListItem>


          </CalciteList>
          </CalciteAccordionItem>
          <CalciteAccordionItem heading='Expandable Positions'>
            <CalciteList selectionMode='multiple' onCalciteListChange={(e) => {
                setExpandableWidgets(e.target.selectedItems.map(item =>  item.value));
            }}>
              <CalciteListItem selected={expandableWidgets.includes('top-left')} value="top-left" label='top-left'></CalciteListItem>
              <CalciteListItem selected={expandableWidgets.includes('top-right')} value="top-right" label='top-right'></CalciteListItem>
              <CalciteListItem selected={expandableWidgets.includes('bottom-left')} value="bottom-left" label='bottom-left'></CalciteListItem>
              <CalciteListItem selected={expandableWidgets.includes('bottom-right')} value="bottom-right" label='bottom-right'></CalciteListItem>

            </CalciteList>

          </CalciteAccordionItem>
          <CalciteAccordionItem heading='Expanded Widgets'>
            <CalciteList selectionMode='multiple'  onCalciteListChange={(e) => {
            setExpandedWidgets(e.target.selectedItems.map(item =>  item.value));
          }}>
              <CalciteListItem selected={expandedWidgets.includes('layer-list')} value="layer-list" label='Layer List'></CalciteListItem>
              <CalciteListItem selected={expandedWidgets.includes('search')} value="search" label='Search'></CalciteListItem>
              <CalciteListItem selected={expandedWidgets.includes('legend')} value="legend" label='Legend'></CalciteListItem>

            </CalciteList>  
          </CalciteAccordionItem>
        </CalciteAccordion>
        </div>
        
        <div className='component'>
        <map-web-component 
          address={address.length ? address : undefined}
          top-left={topLeftPosition.length > 0 ? topLeftPosition : undefined} 
          top-right={topRightPosition.length > 0 ? topRightPosition : undefined} 
          bottom-left={bottomLeftPosition.length > 0 ? bottomLeftPosition : undefined} 
          bottom-right={bottomRightPosition.length > 0 ? bottomRightPosition : undefined}     
          expand-positions={expandableWidgets.length > 0 ? expandableWidgets : undefined} 
          expanded={expandedWidgets.length > 0 ? expandedWidgets : undefined} 
          item-id={webMapId} 
          layer-list={mapWidgets.includes('layer-list') ? '' : undefined} 
          stationary={stationary ? '' : undefined}
          zoom={zoom}
          center={centerValid(center)}
          search={mapWidgets.includes('search') ? '' : undefined} 
          legend={mapWidgets.includes('legend') ? '' : undefined}>

          </map-web-component>
          </div>

        </div>
    
    }



    </>
  )
}

export default App
