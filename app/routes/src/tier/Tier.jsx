import {
  TextField,
  Text,
  Button,
  Divider,
  Thumbnail,
  Link,
  Icon,
  Grid,
  Card,
  EmptyState
} from "@shopify/polaris";
import {ExternalIcon} from '@shopify/polaris-icons';
import DropZoneImage from '../dropZoneImage/DropZoneImage';

export default function Tier({ 
  tierData, 
  setTierData, 
  maxProducts,
 }) {
  const handleChangeThreshold = (value,currency) => {
    setTierData({
      ...tierData,   
      [currency]: value 
    })
  };
  
  const handleRemoveProduct = (productIndex) => {
    let tempData = {...tierData};
    tempData.products = tempData.products.filter((x, index) => index !== productIndex)
    setTierData({ ...tempData });
  }

  const handleAddProduct = async () => {
    const selectAProduct = await shopify.resourcePicker({type: 'product'});

    if(selectAProduct){
      const initiateProduct = {
        productDetails: selectAProduct[0],
        image:'',
        customProductName: '',
        productDescription: '',
        selectText: ''
      }
      setTierData({
        ...tierData,
        products:[...tierData.products, initiateProduct]
      })
    }
  }

  const handleProductUpdate = async (value, productIndex, productKey) => {
    let tierDataCopy = {...tierData};

    if(productKey === 'productDetails'){
      const selectAProduct = await shopify.resourcePicker({type: 'product'});
      if(selectAProduct){      
        tierDataCopy.products[productIndex][productKey] = selectAProduct[0]
      }
    } else {
      tierDataCopy.products[productIndex][productKey] = value;
    }
    // setSaveState(false);
    setTierData({...tierDataCopy});
  }

  const tierProductsDisplay = () => {
    if(tierData.products.length){
      return (
        <div style={{ paddingTop: '10px' }}>
          {tierData.products.map((product, productIndex) => {
            const { productDetails } = product;

            return(
              <div key={`tier-1-product-${productIndex + 1}`}>
                {productIndex === 0 ? <Divider borderColor="border-inverse" /> : null }
                <div className="productContent">
                  <Text variant='headingLg' as="h3">Product {productIndex + 1}</Text>
                  <div className="productContainer">
                    <Thumbnail
                      source={productDetails.images.length ? productDetails.images[0].originalSrc : ''}
                      size="large"
                      alt={productDetails.title}
                    />
        
                    <div className="productInfo">
                      <div style={{display:'flex'}}>
                        <Text variant="headingSm" as="h3">{productDetails.title}</Text>
                        <Link src={`//${shopify.config.shop}/products/${productDetails.handle}`} target="_blank">
                          <Icon source={ExternalIcon} tone="primary"/>
                        </Link>
                      </div>

                      <Button onClick={()=> handleProductUpdate(null, productIndex, 'productDetails')}>Change Product</Button>
                    </div> 
                  </div>
                  <div className="customProductSection">
                    <div className="customSectionHeading">
                      <Text variant="headingMd" as="h3">Customize View Product {productIndex + 1}</Text>
                    </div> 
                    <Grid>
                      <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                        <div className="dropZoneContainer" >
                          <Text variant="bodyMd" as="h4">Image</Text>
                          <DropZoneImage tierData={tierData} setTierData={setTierData} currentProductIndex={productIndex}/>                    
                        </div>
                      </Grid.Cell>
                      <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                        <div className="content">
                          <TextField
                            label="Custom Product Name"
                            value={tierData.products[productIndex].customProductName}
                            onChange={(value) => handleProductUpdate(value, productIndex, 'customProductName')}
                            autoComplete="off"
                            size="medium"
                          />
                          <TextField
                            label="Product Description"
                            value={tierData.products[productIndex].productDescription}
                            onChange={(value) => handleProductUpdate(value, productIndex, 'productDescription')}
                            autoComplete="off"
                            size="medium"
                            multiline={4}
                          />
                          <TextField
                            label="Select Text:"
                            value={tierData.products[productIndex].selectText}
                            onChange={(value) => handleProductUpdate(value, productIndex, 'selectText')}
                            autoComplete="off"
                            size="medium"
                          />
                        </div>
                      </Grid.Cell>
                    </Grid>

                    <Button onClick={()=> handleRemoveProduct(productIndex)} variant="primary" tone="critical">Remove Product</Button>
                  </div>
                </div>
                <Divider borderColor="border-inverse" />
              </div>
            )
          })}
        </div>
      );
    } else {
      return (
        <Card>
          <EmptyState
            heading="Add a product to get started"
            action={{content: 'Add Product', onAction: handleAddProduct}}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            fullWidth
          >
            <p>
              You currently have no products selected. 
              To get started, click the button below to add a product.
            </p>
          </EmptyState>
        </Card>
      )
    }
  }

  const renderTierProducts = tierProductsDisplay();
  return (
    <div style={{marginTop:'10px'}}>
      <div className="content">
        <TextField
          label="USD Minimum:"
          min={0}
          value={tierData.USD.toString()}
          type="number"
          onChange={(value) => handleChangeThreshold(parseInt(value, 10) || 0 , 'USD')}
          autoComplete="off"
          size="medium"
          helpText={
            <>
              Input in cents. (Ex: if 100.00, use 10000)
            </>
          }
        />
        <TextField
          label="CAD Minimum:"
          min={0}
          value={tierData.CAD.toString()}
          type="number"
          onChange={(value) => handleChangeThreshold(parseInt(value, 10) || 0, 'CAD')}
          autoComplete="off"
          size="medium"
          helpText={
            <>
              Input in cents. (Ex: if 100.00, use 10000)
            </>
          }
        />
        <TextField
          label="GBP Minimum:"
          min={0}
          value={tierData.GBP.toString()}
          type="number"
          onChange={(value) => handleChangeThreshold(parseInt(value, 10) || 0, 'GBP')}
          autoComplete="off"
          size="medium"
          helpText={
            <>
              Input in cents. (Ex: if 100.00, use 10000)
            </>
          }
        />

        {renderTierProducts}
      </div>

      {tierData.products.length < maxProducts && tierData.products.length > 0 ? <Button onClick={()=>handleAddProduct()}>Add product</Button> : null}  
    </div>
  );
}
