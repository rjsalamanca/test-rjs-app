import isEqual from 'lodash/isEqual';

export default function compareObjects(obj1, obj2) {
    let  tempObj1 = {...obj1};
    let  tempObj2 = {...obj2};

    const removeKeys = (obj) => {
        if(obj.hasOwnProperty('appDataId')){
            delete obj.id
            delete obj.appDataId
        }
    }

    removeKeys(tempObj1)
    removeKeys(tempObj2)

    return isEqual(tempObj1,tempObj2);
}