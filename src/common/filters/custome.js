let dateServer = value => {
    return value.replace(/T/, " ").split('.')[0]
}
export { dateServer }
