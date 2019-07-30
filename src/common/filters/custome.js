let dateServer = value => {
    if(value){
        return value.replace(/T/, " ").split('.')[0]
    }
}
export { dateServer }
