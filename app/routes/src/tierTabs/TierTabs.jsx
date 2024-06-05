import {
  Card, 
  Tabs, 
  Text,
  Checkbox
} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import Tier from '../tier/Tier';
import GeneralSettings from '../generalSettings/GeneralSettings';
import './TierTabs.css'

export default function TierTabs({ 
  generalSettingsConfig,
  setGeneralSettingsConfig,
  tier1Data,
  setTier1Data,
  tier2Data,
  setTier2Data,
  tier3Data,
  setTier3Data,
}) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
);

  const handleTierEnable = (value, data, setData) => {
    setData({...data, enabled: value})
  }

  const tabs = [
    {
      id: 'generalSettings',
      content: 'General Settings',
      panelID: 'tier-tab-general-settings',
      tabComponent: <GeneralSettings 
        generalSettingsConfig={generalSettingsConfig} 
        setGeneralSettingsConfig={setGeneralSettingsConfig} 
      />
    },
    {
      id: 'tier1',
      content: 'Tier 1',
      panelID: 'tier-1',
      tabComponent: 
        <Tier
          tierData={tier1Data}
          setTierData={setTier1Data}
          maxProducts={4}
        />
    },
    {
      id: 'tier2',
      content: 'Tier 2',
      panelID: 'tier-2',
      tabComponent: 
        <div>
          <Checkbox
            label="Enable Tier 2"
            checked={tier2Data.enabled}
            onChange={(value) => handleTierEnable(Boolean(value), tier2Data, setTier2Data)}
          />
          <Tier
            tierData={tier2Data}
            setTierData={setTier2Data}
            maxProducts={1}
          />
        </div>
    },
    {
      id: 'tier3',
      content: 'Tier 3',
      panelID: 'tier-3',
      tabComponent: 
        <div>
          <Checkbox
            label="Enable Tier 3"
            checked={tier3Data.enabled}
            onChange={(value) => handleTierEnable(Boolean(value), tier3Data, setTier3Data)}
          />
          <Tier
            tierData={tier3Data}
            setTierData={setTier3Data}
            maxProducts={1}
          />
        </div>
      },
  ];

  return (
    <Card>
      <Tabs
        tabs={tabs}
        selected={selected}
        onSelect={handleTabChange}
        disclosureText="More views"
      >
        <div className='tabHeading'>
          <Text variant="heading2xl" as="h2">{tabs[selected].content}</Text>
        </div>  
        {tabs[selected].tabComponent}
      </Tabs>
    </Card>
  );
}
