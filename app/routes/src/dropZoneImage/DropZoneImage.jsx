import {DropZone, Thumbnail, Text, Grid, Button} from '@shopify/polaris';
import {NoteIcon} from '@shopify/polaris-icons';
import {useCallback} from 'react';

function DropZoneImage({ tierData, setTierData, currentProductIndex}) {
  const selectedImage = tierData.products[currentProductIndex].image;

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
        setImage(acceptedFiles[0]),
    [],
  );

  const handleRemoveImage = () => {
    let tempData = tierData;
    tempData.products[currentProductIndex].image = ''
    setTierData({
        ...tempData
    });
  }

  const setImage = (imageFile) => {
    let tempData = {...tierData};
    tempData.products[currentProductIndex].image = imageFile;
    setTierData({...tempData});
  }

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !selectedImage && <DropZone.FileUpload />;
  const uploadedFile = selectedImage && (
    <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
            <Thumbnail
                size="large"
                alt={selectedImage.name}
                source={
                validImageTypes.includes(selectedImage.type)
                    ? window.URL.createObjectURL(selectedImage)
                    : NoteIcon
                }
            />
        </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
            {selectedImage.name}{' '}
            <Text variant="bodySm" as="p">
            {selectedImage.size} bytes
            </Text>
        </Grid.Cell>
    </Grid>
  );

  return (
    <div className='productImageDropZone'>
        <DropZone className="productImageDropZone" accept="image/*" type="image" allowMultiple={false} onDrop={handleDropZoneDrop}>
            {uploadedFile}
            {fileUpload}
        </DropZone>

        {selectedImage ? <Button onClick={()=> handleRemoveImage()}>Remove Image</Button> : null}
    </div>
  );
}

export default DropZoneImage;