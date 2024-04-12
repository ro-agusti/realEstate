const isSeller = (userID, propertyUserID) => {
    return userID === propertyUserID
}

const formatDate = date => {
    const newDate = new Date(date).toISOString().slice(0,10)

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    return new Date( newDate).toLocaleDateString('en-GB', options)
}

export {
    isSeller,
    formatDate
}