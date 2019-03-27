import LookUp from './index';
export let tansfer = (columns) => {
    columns.forEach(item => {
        if(item.transferType === 'lookup') {
            item.formatter = (row, cell,val,index) => {
                if (LookUp[item.lookupKey].filter(subitem => subitem.value === val)[0]) {
                    return LookUp[item.lookupKey].filter(subitem => subitem.value === val)[0].label;
                }
                return ''
            }
        }
    });
}
