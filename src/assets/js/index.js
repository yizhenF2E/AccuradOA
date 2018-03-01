// 是否是本地数据，如果 本地 请改true
let isLocal = false

let dataBase = 'OverTime2018'
// 假数据
let dummyOverTime = {
    'data':[
        {
            'department': 'may',
            'name': '28',
            'dateStart': '2018-02-12',
            'dateEnd': '2018-02-22',
            'time': '24',
            'fare': '10',
            'mealFee': '20',
            'operation': '修改',
            'week': '1'
        }
    ],
    'totals': 1
}

init(dataBase, dummyOverTime)
initInput(dummyOverTime)



/**
 * 拿到加班数据
 * @param data  表的名字
 */
function init(name, dummy) {
    let query = new AV.Query(name);
    if (!isLocal) {
        query.limit(1000)
        query.find().then( (response) => {
            let data = initDate(response)
            gridManagerInit(data)
        }, (error) => {
            alert('请稍后')
        }).then(()=> {}, (error) => {console.log(error)});
    } else {
        gridManagerInit(dummy)
    }
}
/**
 * 将拿到的数据转换为表格适应的数据结构
 * @param data // 拿到的表格数据
 * @returns {{}}  // 转为对应的数据
 */
function initDate (data) {
    let array = []
    let object = {}
    data.map(item => {
        item.attributes.id = item.id
        array.push(item.attributes)
    })
    object.data = array
    object.totals = array.length
    return object
}

/**
 * 表格配置及初始化
 * @param data
 */
function gridManagerInit (data) {
    let table = document.querySelector('table');
    let TGM = table.GM({
        supportRemind: false
        ,gridManagerName: 'test'
        ,height: 'calc(100vh - 476px)'
        ,supportAjaxPage:true
        ,supportSorting: false
        ,isCombSorting: false
        ,disableCache: true
        ,ajax_data: data
        ,pageSize: 100
        ,columnData: [
         {
            key: 'id',
            width: '100px',
            align: 'left',
            text: 'id',
            isShow: false,
         },{
            key: 'department',
            width: '100px',
            align: 'left',
            text: '部门名称'
        },{
            key: 'name',
            width: '100px',
            align: 'left',
            text: '你的名字'
        },{
            key: 'dateStart',
            width: '100px',
            align: 'left',
            text: '加班起始'
        },{
            key: 'dateEnd',
            width: '100px',
            align: 'left',
            text: '加班结束'
        },{
            key: 'time',
            width: '100px',
            align: 'left',
            text: '加班时长'
        },{
            key: 'fare',
            width: '100px',
            align: 'left',
            text: '交通费'
        },
        {
            key: 'mealFee',
            width: '100px',
            align: 'left',
            text: '餐补'
        },{
            key: 'week',
            width: '100px',
            align: 'left',
            text: '星期几'
        },{
            key: 'action',
            remind: 'the action',
            width: '10%',
            text: '操作',
            template: function(action, rowObject){
                return '<span class="plugin-action" onclick="deleteDate(this)" learnLink-id="'+rowObject.id+'">删除</span>';
            }
        }
        ]
        // 分页前事件
        ,pagingBefore: function(query){
            console.log('pagingBefore', query)
        }
        // 分页后事件
        ,pagingAfter: function(data){
            console.log('pagingAfter', data)
        }
        // 排序前事件
        ,sortingBefore: function (data) {
            console.log('sortBefore', data)
        }
        // 排序后事件
        ,sortingAfter: function (data) {
            console.log('sortAfter', data)
        }
        // 宽度调整前事件
        ,adjustBefore: function (event) {
            console.log('adjustBefore', event)
        }
        // 宽度调整后事件
        ,adjustAfter: function (event) {
            console.log('adjustAfter', event)
        }
        // 拖拽前事件
        ,dragBefore: function (event) {
            console.log('dragBefore', event)
        }
        // 拖拽后事件
        ,dragAfter: function (event) {
            console.log('dragAfter', event)
        }
    }, function(query){
        // 渲染完成后的回调函数
        console.log('渲染完成后的回调函数:', query)
    });
}

/**
 * 初始化日期输入
 * @param dummy
 */
function initInput (dummy) {
    $('#dateStart').datetimepicker({format: 'yyyy-mm-dd hh:ii'})
    $('#dateEnd').datetimepicker({format: 'yyyy-mm-dd hh:ii'})
    console.log(1)
    submitEvent(dummy)
}
/**
 * 删除
 * @param node
 */
function deleteDate(node) {
    let tr = node.parentNode.parentNode;
    let data = document.querySelector('table').GM('getRowData', tr)
    fillModel(data, 'delete')
    $('.model-delete').on('click', function () {
        let OverTimeData = AV.Object.createWithoutData(dataBase, $(node).attr('learnlink-id'));
        OverTimeData.destroy().then(function (success) {
            location.reload()
        }, function (error) {
            alert('删除失败')
        })
    })
}


/**
 * 提交的数据
 * @param dummy
 */
function submitEvent (dummy) {
    let formData
    // 提交
    $('#overTimeForm').on('submit', (event) => {
        event.preventDefault()
        formData = $('#overTimeForm').serializeObject()
        let reg = /[\u4E00-\u9FA5]{2,4}/

        if (!formData.name || !formData.dateStart || !formData.dateEnd || !formData.fare || !formData.mealFee) {
            alert('都是必填项！我已经拿起了我的青龙偃月刀！')
        } else if (!reg.test(formData.name)) {
            alert('就是为了防止你这种人！还好我写了正则！我的刀已经出鞘！')
        } else {
            let start = new Date(formData.dateStart)
            let end = new Date(formData.dateEnd)
            let diff = end.getTime() - start.getTime()
            if (diff < 0) {
                alert('你穿越了吗？我又一次拿起了我的宝刀！')
            } else {
                formData.time = diffTime(diff)
                formData.week = new Date(formData.dateStart).getDay().toString()
                formData.dateStart.toString()
                formData.dateEnd.toString()
                fillModel(formData, 'submit')
            }
        }
    })
    // 确认提交
    $('.model-send').on('click', function () {
        $('#basicModal').modal('hide')
        if (!isLocal) {
            let OverTime = AV.Object.extend(dataBase);
            let OverTimeData = new OverTime();
            OverTimeData.save({
                'department': $('.modal-body .department').text(),
                'name': $('.modal-body .name').text(),
                'dateStart': $('.modal-body .start-date').text(),
                'dateEnd': $('.modal-body .end-date').text(),
                'time': parseFloat($('.modal-body .time').text()).toString(),
                'fare': parseFloat($('.modal-body .fare').text()).toString(),
                'mealFee': parseFloat($('.modal-body .meal-fee').text()).toString(),
                'week': $('.modal-body .week').text(),
            }).then((res) => {
                location.reload()
            })
        } else {
            alert('提交成功，本地数据就不不改了')
        }
    })
    // 搜索
    $('#searchName').keyup(function (e) {
        console.log(e)
        if(e.which === 13) {
            $("#search").click();
        }
    })
    $('#search').on('click', function () {
        let query = new AV.Query(dataBase)
        let searchVal = $('#searchName').val()
        if (!searchVal) {
            alert('二营长，你TND的意大利炮呢！给我轰死不填值的！')
        } else {
            query.equalTo('name', searchVal)
            query.find().then(function (results) {
                let data = initDate(results)
                document.querySelector('table').GM('setAjaxData', data);
            }, function (error) {
                alert('搜素失败')
            })
        }
    })
    // 重置
    $('#reset').on('click', function () {
        $('#searchName').val('')
        let query = new AV.Query(dataBase)
        query.limit(1000)
        query.find().then( (response) => {
            let data = initDate(response)
            document.querySelector('table').GM('setAjaxData', data)
        }, (error) => {
            alert('请稍后')
        }).then(()=> {}, (error) => {console.log(error)})

    })
}
/**
 * 计算时间差
 * @param diff
 * @returns {string}
 */
function diffTime (diff) {
    // 计算出分钟
    let minutes = Math.floor(diff/(60*1000))
    return (minutes/60).toFixed(1)
}
/**
 * 填充model
 * @param data
 */
function fillModel (data, type) {
    if (type === 'submit') {
        $('#basicModal > h4').html('提交确认')
        $('.send-footer').show()
        $('.delete-footer').hide()
    } else if (type === 'delete'){
        $('#basicModal > h4').html('删除确认')
        $('.send-footer').hide()
        $('.delete-footer').show()
    }
    $('.modal-body .department').text(data.department)
    $('.modal-body .name').text(data.name)
    $('.modal-body .start-date').text(data.dateStart)
    $('.modal-body .end-date').text(data.dateEnd)
    $('.modal-body .time').text(data.time + '小时')
    $('.modal-body .fare').text(data.fare + '元')
    $('.modal-body .meal-fee').text(data.mealFee + '元')
    $('.modal-body .week').text(data.week)
    $('#basicModal').modal('show')
    return data
}




