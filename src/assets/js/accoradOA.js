// 是否是本地数据，如果 本地 请改true
{
    let view  = {}
    let model = {
        data: {
            dataBase: 'OverTime2018'
        },
        getLocalName () {
            return localStorage.getItem('name')
        },
        // 填充名字
        fillName () {
            if (this.getLocalName()) {
                $('.login-info .login-name').html(this.getLocalName())
            } else {
                alert('请重新登录！')
                location.href = `http://${location.host}`

            }
        },
        // 初始化日期输入
        initDate () {
            $('#dateStart').datetimepicker({format: 'yyyy-mm-dd hh:ii'})
            $('#dateEnd').datetimepicker({format: 'yyyy-mm-dd hh:ii'})
        },
        init () {
            this.fillName()
            this.initDate()
        },
        // 拿到表格
        getTablet () {
            let query = new AV.Query(this.data.dataBase)
            query.limit(1000)
            // 后门
            if(this.getLocalName() !== '管理员') {
                query.equalTo('name', this.getLocalName())
            }
            return query.find().then( (response) => {
                return this.transformData(response)
            })
        },
        // 拿到的数据格式化
        transformData (data) {
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
    }
    let controller = {
        init (view, model) {
            this.view = view
            this.model = model
            this.model.init()
            this.getDate()
            this.bindEvent()
        },
        getDate () {
            return this.model.getTablet().then((response) => {
                this.gridManagerInit(response)
            })
        },
        gridManagerInit (data) {
            let table = document.querySelector('table');
            let TGM = table.GM({
                supportRemind: false
                ,gridManagerName: 'test'
                ,height: 'calc(100vh - 480px)'
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
            })
        },
        bindEvent() {
            let formData
            // 提交
            $('#overTimeForm').on('submit', (event) => {
                event.preventDefault()
                formData = $('#overTimeForm').serializeObject()
                formData.name = $('.login-info .login-name').text()

                let start = new Date(formData.dateStart)
                let end = new Date(formData.dateEnd)
                let diff = end.getTime() - start.getTime()
                if (diff < 0) {
                    alert('你穿越了吗？我又一次拿起了我的宝刀！')
                } else {
                    formData.time = this.diffTime(diff)
                    formData.week = new Date(formData.dateStart).getDay().toString()
                    formData.dateStart.toString()
                    formData.dateEnd.toString()
                    this.fillModel(formData, 'submit')
                }

            })
            // 确认提交
            $('.model-send').on('click', function () {
                $('#basicModal').modal('hide')
                let OverTime = AV.Object.extend('OverTime2018')
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
            })
            // 退出
            $('.exit').on('click', function () {
                localStorage.setItem('name', '')
                location.href = `http://${location.host}`
            })
        },
        // 删除数据
        deleteDate(node) {
            let tr = node.parentNode.parentNode;
            let data = document.querySelector('table').GM('getRowData', tr)
            this.fillModel(data, 'delete')
            $('.model-delete').on('click', function () {
                let OverTimeData = AV.Object.createWithoutData('OverTime2018', $(node).attr('learnlink-id'));
                OverTimeData.destroy().then(function (success) {
                    location.reload()
                }, function (error) {
                    alert('删除失败')
                })
            })
        },
        // 填充model
        fillModel (data, type) {
            if (type === 'submit') {
                $('#basicModal > h4').html('提交确认')
                $('.send-footer').show()
                $('.delete-footer').hide()
            } else if (type === 'delete'){
                $('#basicModal > h4').html('删除确认')
                $('.send-footer').hide()
                $('.delete-footer').show()
            }
            console.log(data)
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
        },
        // 计算时间差
        diffTime (diff) {
            // 计算出分钟
            let minutes = Math.floor(diff/(60*1000))
            return (minutes/60).toFixed(1)
        }
    }
    controller.init(view, model)

    function deleteDate(node) {
        let tr = node.parentNode.parentNode;
        let data = document.querySelector('table').GM('getRowData', tr)
        controller.fillModel(data, 'delete')
        $('.model-delete').on('click', function () {
            let OverTimeData = AV.Object.createWithoutData('OverTime2018', $(node).attr('learnlink-id'));
            OverTimeData.destroy().then(function (success) {
                location.reload()
            }, function (error) {
                alert('删除失败')
            })
        })
    }
}






