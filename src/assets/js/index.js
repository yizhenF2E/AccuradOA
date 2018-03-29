$('#login').on('submit', (event) =>　{
    event.preventDefault()
    let login = $('#login').serializeObject()
    let reg = /[\u4E00-\u9FA5]{2,4}/
    if(!login.name) {
        alert('都是必填项！我已经拿起了我的青龙偃月刀！')
    } else if (!reg.test(login.name)) {
        alert('就是为了防止你这种人！还好我写了正则！我的刀已经出鞘！')
    } else {
        localStorage.setItem('name', login.name)
        location.href = `http://${location.host}/src/assets/html/accoradOA.html`
        // location.href = `http://${location.host}/src/assets/html/mine.html`
    }
})