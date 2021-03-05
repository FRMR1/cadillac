export const formatDate = date => {
    const isoDate = new Date(date)

    const year = isoDate.getUTCFullYear()
    let month = "" + (isoDate.getMonth() + 1)
    let day = "" + isoDate.getDate()

    if (month.length < 2) month = "0" + month
    if (day.length < 2) day = "0" + day

    return [month, day, year].join("/")
}
