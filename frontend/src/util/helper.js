export function date() {
    var data = new Date(),
        dia  = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0'+dia : dia,
        mes  = (data.getMonth()+1).toString(),
        mesF = (mes.length == 1) ? '0'+mes : mes,
        anoF = data.getFullYear(),
        hour = data.getHours(),
        minute = data.getMinutes()
    return diaF+"/"+mesF+"/"+anoF+" "+hour+":"+minute
}

export function baseURL() {
    const baseUrl = 'http://localhost:3001'
    return baseUrl
}

export function showDate(date) {
    let arrayDate = date.split("-")
    let newDate = arrayDate[2] + "/" + arrayDate[1] + "/" + arrayDate[0]
    return newDate
}

export function orderBy(a, b) {
    return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)
    
}

export function showCategoryFormated(category) {
    switch(category) {
        case "read":
            return "Read"
            break
        case "reading":
            return "Reading"
            break
        case "wantToRead":
            return "Want To Read"
            break
        default:
            return ""
            break
    }
}

