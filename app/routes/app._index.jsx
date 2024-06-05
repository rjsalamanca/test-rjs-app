import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, Form } from "@remix-run/react";

import {
  Page,
  Layout,
  ButtonGroup,
  Button,
  BlockStack,
  TextField,
  Checkbox
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import TierTabs from "./src/tierTabs/TierTabs";
import compareObjects from '../helpers/compareObjects';
import db from '../db.server'

export const loader = async () => {
  let appData = await db.appData.findFirst({ 
    include: {
      generalSettings: true,
      tier1: true,
      tier2: true,
      tier3: true
    }
  });
  return json(appData);  
};

export const action = async ({ request }) => {
  await authenticate.admin(request);
  let allFormData = await request.formData();
  allFormData = Object.fromEntries(allFormData);

  const {
    gs_giftCodes, 
    gs_heading, 
    gs_subHeading, 
    gs_selectError, 
    gs_cancelButton, 
    gs_addButton, 
    gs_enableProgressBar,
    t1_CAD,
    t1_GBP,
    t1_USD,
    t1_products,
    t2_enabled,
    t2_CAD,
    t2_GBP,
    t2_USD,
    t2_products,
    t3_enabled,
    t3_CAD,
    t3_GBP,
    t3_USD,
    t3_products
  } = allFormData;

  // Update GeneralSettings Table
  await db.generalSettings.upsert({
    where: {
      id: 1
    },
    update: {
      giftCodes: gs_giftCodes,
      heading: gs_heading,
      subHeading: gs_subHeading,
      selectError: gs_selectError,
      cancelButton: gs_cancelButton,
      addButton: gs_addButton,
      enableProgressBar: Boolean(gs_enableProgressBar)
    },
    create: {
      giftCodes: gs_giftCodes,
      heading: gs_heading,
      subHeading: gs_subHeading,
      selectError: gs_selectError,
      cancelButton: gs_cancelButton,
      addButton: gs_addButton,
      enableProgressBar: Boolean(gs_enableProgressBar)
    }
  })

  // Update Tier Tables
  await db.tier1.upsert({
    where: {
      id: 1
    },
    update: {
      CAD: parseInt(t1_CAD),
      GBP: parseInt(t1_GBP),
      USD: parseInt(t1_USD),
      products: t1_products
    },
    create: {
      CAD: parseInt(t1_CAD),
      GBP: parseInt(t1_GBP),
      USD: parseInt(t1_USD),
      products: t1_products
    }
  })

  await db.tier2.upsert({
    where: {
      id: 1
    },
    update: {
      enabled: Boolean(t2_enabled),
      CAD: parseInt(t2_CAD),
      GBP: parseInt(t2_GBP),
      USD: parseInt(t2_USD),
      products: t2_products
    },
    create: {
      enabled: Boolean(t2_enabled),
      CAD: parseInt(t2_CAD),
      GBP: parseInt(t2_GBP),
      USD: parseInt(t2_USD),
      products: t2_products
    }
  })

  await db.tier3.upsert({
    where: {
      id: 1
    },
    update: {
      enabled: Boolean(t3_enabled),
      CAD: parseInt(t3_CAD),
      GBP: parseInt(t3_GBP),
      USD: parseInt(t3_USD),
      products: t3_products
    },
    create: {
      enabled: Boolean(t3_enabled),
      CAD: parseInt(t3_CAD),
      GBP: parseInt(t3_GBP),
      USD: parseInt(t3_USD),
      products: t3_products
    }
  })

  return null;
};

export default function Index() {
  const appData = useLoaderData();
  const updatedAppData = useActionData();
  const [saveState, setSaveState] = useState(true);
  const { generalSettings, tier1, tier2, tier3 } = appData;

  const [generalSettingsConfig, setGeneralSettingsConfig] = useState({
    giftCodes: generalSettings.giftCodes,
    heading: generalSettings.heading,
    subHeading: generalSettings.subHeading,
    selectError: generalSettings.selectError,
    cancelButton: generalSettings.cancelButton,
    addButton: generalSettings.addButton,
    enableProgressBar: generalSettings.enableProgressBar
  })

  const [tier1Data, setTier1Data] = useState({
    CAD: tier1.CAD,
    GBP: tier1.GBP,
    USD: tier1.USD,    
    products: tier1.products ? JSON.parse(tier1.products) : []
  });

  const [tier2Data, setTier2Data] = useState({
    enabled: tier2.enabled,
    CAD: tier2.CAD,
    GBP: tier2.GBP,
    USD: tier2.USD,   
    products: tier2.products ? JSON.parse(tier2.products) : []
  });

  const [tier3Data, setTier3Data] = useState({
    enabled: tier3.enabled,
    CAD: tier3.CAD,
    GBP: tier3.GBP,
    USD: tier3.USD,   
    products: tier3.products ? JSON.parse(tier3.products) : []
  });

  useEffect(() => {
    const {generalSettings, tier1, tier2, tier3} = appData;
    const saveStates = [];
    const checkTierSaveState = (stateTierData, appTierData) => {
      let tempAppTier = {...appTierData}
      tempAppTier.products = JSON.parse(tempAppTier.products);
      return compareObjects(stateTierData,tempAppTier)
    }

    saveStates.push(checkTierSaveState(tier1Data,tier1));
    saveStates.push(checkTierSaveState(tier2Data,tier2));
    saveStates.push(checkTierSaveState(tier3Data,tier3));
    saveStates.push(compareObjects(generalSettingsConfig, generalSettings));

    if(saveStates.includes(false)){
      setSaveState(false)
    } else {
      setSaveState(true)
    }
  },[generalSettingsConfig, tier1Data, tier2Data, tier3Data])

  const handleSave = () => {
    const saveAppDataButton = document.getElementById('saveAppData');
    if(saveAppDataButton) {
      saveAppDataButton.click();
      setSaveState(true);
    }
  }

  const handleReset = () => location.reload();

  const displayFormData = (dataObj, name) => {
    let formInputs = Object.keys(dataObj).map(key => {
      if(typeof dataObj[key] === 'boolean'){
        return <Checkbox
          key={`display-form-data_${key}`}
          name={`${name}_${key}`}
          type={typeof dataObj[key]}
          checked={dataObj[key]}
          value={dataObj[key]}
        />
      } else if(typeof dataObj[key] === 'object'){
        return <TextField
          key={`display-form-data_${key}`}
          name={`${name}_${key}`}
          type={typeof dataObj[key]}
          value={JSON.stringify(dataObj[key])}
          autoComplete="off"
        />
      } else {
        return <TextField
          key={`display-form-data_${key}`}
          name={`${name}_${key}`}
          type={typeof dataObj[key]}
          value={dataObj[key]}
          autoComplete="off"
        />
      }
    })
    return formInputs;
  }

  const renderGeneralSettingsForm = displayFormData(generalSettingsConfig,'gs');
  const renderTier1Form = displayFormData(tier1Data,'t1');
  const renderTier2Form = displayFormData(tier2Data,'t2');
  const renderTier3Form = displayFormData(tier3Data,'t3');

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <TierTabs 
              appData={updatedAppData ? updatedAppData : appData} 
              generalSettingsConfig={generalSettingsConfig}
              setGeneralSettingsConfig={setGeneralSettingsConfig}
              tier1Data={tier1Data}
              setTier1Data={setTier1Data}
              tier2Data={tier2Data}
              setTier2Data={setTier2Data}
              tier3Data={tier3Data}
              setTier3Data={setTier3Data}
            />
            <div style={{display:"none"}}>
              <Form method="POST">
                {renderGeneralSettingsForm}
                {renderTier1Form}
                {renderTier2Form}
                {renderTier3Form}
                <button id="saveAppData" style={{display:'none'}} submit="true">Save</button>
              </Form>
            </div>
          </Layout.Section>
          <Layout.Section>
            <ButtonGroup>
              <Button onClick={handleReset} disabled={saveState}>Reset</Button>
              <Button variant="primary" disabled={saveState} onClick={handleSave}>Save</Button>
            </ButtonGroup>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
