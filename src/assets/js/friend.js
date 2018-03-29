/**
 * Created by may on 2018/3/29.
 */
{
    let view = {
        el: 'main .photo'
    }
    let model = {}
    let controller = {
        init (view, model) {
            this.view = view
            this.model = model
        }
    }
    controller.init(view, model)
}