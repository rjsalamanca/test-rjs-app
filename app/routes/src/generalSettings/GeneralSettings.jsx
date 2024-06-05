import {
  TextField,
  Checkbox
} from "@shopify/polaris";

export default function GeneralSettings({ 
  generalSettingsConfig, 
  setGeneralSettingsConfig
}) {

  const handleGeneralConfig = (value, configKey) => {
    let tempGeneralConfig = { ...generalSettingsConfig };
    tempGeneralConfig[configKey] = value;
    setGeneralSettingsConfig({ ...tempGeneralConfig });
  }

  return (
    <div style={{marginTop:'10px'}}>
      <div data-save-bar className="content">
        <TextField
          label="Qualifying Tiered Gift Codes:"
          value={generalSettingsConfig.giftCodes}
          onChange={(value) => handleGeneralConfig(value, 'giftCodes')}
          autoComplete="off"
          size="medium"
          multiline={4}
          helpText={
            <>
              List of gift codes that qualify for checkout gifts. Comma separated, without spaces.
            </>
          }
        /> 
        <TextField
          label="Heading"
          value={generalSettingsConfig.heading}
          onChange={(value) => handleGeneralConfig(value, 'heading')}
          autoComplete="off"
          size="medium"
        />
        <TextField
          label="Sub Heading"
          value={generalSettingsConfig.subHeading}
          onChange={(value) => handleGeneralConfig(value, 'subHeading')}
          autoComplete="off"
          size="medium"
        />
        <TextField
          label="Sample Select Error Message"
          value={generalSettingsConfig.selectError}
          onChange={(value) => handleGeneralConfig(value, 'selectError')}
          autoComplete="off"
          size="medium"
        />
        <TextField
          label="Cancel Button Text"
          value={generalSettingsConfig.cancelButton}
          onChange={(value) => handleGeneralConfig(value, 'cancelButton')}
          autoComplete="off"
          size="medium"
        />
        <TextField
          label="Add Button Text"
          value={generalSettingsConfig.addButton}
          onChange={(value) => handleGeneralConfig(value, 'addButton')}
          autoComplete="off"
          size="medium"
        />
        <Checkbox
          label="Enable Gift With Purchase Progress Bar"
          checked={generalSettingsConfig.enableProgressBar}
          onChange={(value) => handleGeneralConfig(value, 'enableProgressBar')}
        />
      </div>
    </div>
  );
}
