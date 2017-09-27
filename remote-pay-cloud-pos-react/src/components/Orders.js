import React from 'react';
import TitleBar from "./TitleBar";
import OrderRow from "./OrderRow";
import OrderItemRow from "./OrderItemRow";
import OrderPaymentRow from "./OrderPaymentRow";
import ButtonNormal from "./ButtonNormal";
import { browserHistory } from 'react-router';

export default class Orders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            order: null,
            orderItems: [],
            orderPayments: [],
            orderOpen: false,
        }
        this.store = this.props.store;
        this.orders = this.store.getOrders();
        this.showOrderDetails = this.showOrderDetails.bind(this);
        this.goToPayment = this.goToPayment.bind(this);
        this.goToRegister = this.goToRegister.bind(this);
        //console.log("store",this.store);
        //console.log("orders", this.orders);
    }

    showOrderDetails(id){
        let order = this.store.getOrderById(id);
        if(order !== null){
            let orderOpen = false;
            if(order.status === "OPEN"){
                orderOpen = true;
            }
            this.setState({order: order, orderItems:order.getDisplayItems(), orderPayments:order.getOrderPayments(), orderOpen: orderOpen});
        }

    }

    goToPayment(orderPayment){
        browserHistory.push({pathname: '/payment', state: {type: 'payment', id: orderPayment.cloverPaymentId}});
    }

    goToRegister(order){
        this.store.setCurrentOrder(order);
        browserHistory.push({pathname: '/register'});
    }

    render(){
        let discounts = false;
        let discount = null;
        if(this.state.order != null && this.state.order.getDiscount() !== null){
            discounts = true;
            discount = this.state.order.getDiscount();
        }
        let register = this.state.orderOpen;

        return(
            <div className="orders">
                <div className="column">
                    <div className="orders_list">
                        <TitleBar title="Orders"/>
                        {this.orders.map(function (order, i) {
                            return <OrderRow key={'order-'+i} order={order} onClick={this.showOrderDetails}/>
                        }, this)}
                    </div>
                    <div className="order_items_and_payments">

                        <div className="order_items container_left">
                            <TitleBar title="Order Items"/>
                            {this.state.orderItems.map(function (orderItem, i) {
                                return <OrderItemRow key={'order_orderItem-'+i} orderItem={orderItem}/>
                            })}
                            {discounts &&
                            <div className="order_item_row"><strong>Discount: </strong>{discount.name}</div>
                            }
                        </div>

                        <div className="order_payments container_right">
                            <div>
                                <TitleBar title="Transactions"/>
                            </div>
                            {this.state.orderPayments.map(function (orderPayment, i) {
                                return <OrderPaymentRow key={'order_orderPayment-'+i} order={this.state.order} orderPayment={orderPayment} onClick={this.goToPayment}/>
                            },this)}
                            {register &&
                            <div className="column_plain flex_end margin_bottom">
                                <div className="filler_space"/>
                                <ButtonNormal title="Open in Register" color="white" extra="open_register_button" onClick={() => {this.goToRegister(this.state.order)}} />
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}