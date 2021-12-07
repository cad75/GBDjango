window.onload = function () {

    var _quantity, _price, orderitem_num, delta_quantity, orderitem_quantity, delta_cost;
    var quantity_arr = [];
    var price_arr = [];

    var TOTAL_FORMS = parseInt($('input[name="orderitems-TOTAL_FORMS"]').val());

    var order_total_quantity = parseInt($('.order_total_quantity').text()) || 0;
    var order_total_cost = parseFloat($('.order_total_cost').text().replace(',', '.')) ||0;

    for (var i = 0; i < TOTAL_FORMS; i++) {
        _quantity = parseInt($('input[name="orderitems-' + i + '-quantity"]').val());
        _price = parseFloat($('.orderitems-' + i + '-price').text().replace(',', '.'));
        quantity_arr[i] = _quantity;
        if (_price) {
            price_arr[i] = _price;
        } else {
            price_arr[i] = 0;
        }
    }

    $('.order_form').on('click', 'input[type=number]', function (){
        var target = event.target;
        orderitem_num = parseInt(target.name.replace('orderitems-', '').replace('-quantity', ''));

        if(price_arr[orderitem_num]){
            orderitem_quantity = parseInt(target.value);
            delta_quantity = orderitem_quantity - quantity_arr[orderitem_num];
            quantity_arr[orderitem_num] = orderitem_quantity;
            order_summary_update(price_arr[orderitem_num], delta_quantity);

        }
    });

    $('.order_form').on('click', 'input[type=checkbox]', function (){
        var target = event.target;
        orderitem_num = parseInt(target.name.replace('orderitems-', '').replace('-quantity', ''));
        if(target.checked){
            delta_quantity = -quantity_arr[orderitem_num];
        } else {
            delta_quantity = +quantity_arr[orderitem_num];
        }
        order_summary_update(price_arr[orderitem_num], delta_quantity);
    });

    function order_summary_update(orderitem_price, delta_quantity){
        delta_cost = orderitem_price * delta_quantity;
        order_total_cost = Number((order_total_cost + delta_cost).toFixed(2));
        order_total_quantity = order_total_quantity + delta_quantity;

        $('.order_total_quantity').html(order_total_quantity.toString());
        $('.order_total_cost').html(order_total_cost.toString());
    };

    $('.formset_row').formset({
        addText: 'Добавить товар',
        deleteText: 'Удалить товар',
        prefix: 'orderitems',
        removed: delete_order_item,
    });

    $('.order_form').on('change', 'select', function (){
        var target = event.target;
        orderitem_num = parseInt(target.name.replace('orderitems-', '').replace('-quantity', ''));
        var product_id = target.options[target.selectedIndex].value;
        if (product_id){
            $.ajax({
                url: '/order/product/price/' + product_id + '/',
                success: function (data){
                    if(data.price){
                        price_arr[orderitem_num] = data.price;
                        if(isNaN(quantity_arr[orderitem_num])){
                            quantity_arr[orderitem_num] = 0;
                        }
                        var price_string = '<span>' + data.price.toString().replace('.', ',') + '</span>'
                        var current_tr = $('.order_form table').find('tr:eq(' + (orderitem_num + 1) + ')');
                        current_tr.find('td:eq(2)').html(price_string);

                    }
                }
            })
        };
    });

    function delete_order_item(row){
        var target_name = row[0].querySelector('input[type=number]').name;
        orderitem_num = parseInt(target_name.replace('orderitems-', '').replace('-quantity', ''));
        delta_quantity = -quantity_arr[orderitem_num];
        order_summary_update(price_arr[orderitem_num], delta_quantity);
    }

}


