import moment from 'moment';
import { IProduct, IPurchaseOrderItem, ISupplier } from '../types/types';

export interface IPurchaseOrderPdf extends Document {
  _id?: string;
  orderNumber: string;
  supplier: ISupplier;
  orderDate: Date;
  status: string;
  orderTotal: number;
  items: {
    product: IProduct;
    quantity: number;
    price: number;
    lineTotal: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
export default function ({
  _id,
  supplier: { name, email, phone, address },
  orderDate = new Date(),
  orderNumber,
  // date = new Date(),
  // id = 'Id',
  // notes = 'Notes',
  // subTotal = 69,
  // type = 'Type',
  // vat = 69,
  orderTotal = 69,
  items,
  status = 'Status',
}: // totalAmountReceived = 69,
// balanceDue = 69,
IPurchaseOrderPdf) {
  const today = new Date();
  return `
<!DOCTYPE html>
<html>
<head>
<style>

.invoice-container {
    margin: 0;
    padding: 0;
    padding-top: 10px;
    font-family: 'Roboto', sans-serif;
    width: 530px;
    margin: 0px auto;
    }

table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

table td, table th {
  border: 1px solid rgb(247, 247, 247);
  padding: 10px;
}

table tr:nth-child(even){background-color: #f8f8f8;}

table tr:hover {background-color: rgb(243, 243, 243);}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #FFFFFF;
  color: rgb(78, 78, 78);
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 5px;
    

}
.address {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0px 15px 0px;
    line-height: 10px;
    font-size: 12px;
    margin-top: -20px

}

.status {
    text-align: right;
}
.receipt-id {
    text-align: right;
}

.title {
    font-weight: 100px;
    text-transform: uppercase;
    color: gray;
    letter-spacing: 2px;
    font-size: 8px;
    line-height: 5px;
}

.summary {
    margin-top: 2px;
    margin-right: 0px;
    margin-left: 50%;
    margin-bottom: 15px;
}

img {
    width: 100px;
   
}

</style>
</head>
<body>
<div class="invoice-container">
<section  class="header">
        <div>
          ${true ? `<img src="Logo" />` : `<h2>___</h2>`}
        </div>
        <div class="receipt-id" style="margin-top: -120px 0 40px 0">
            
        </div>
</section>
<section class="address">

      <div>
          <p class="title">From:</p>
          <h4 style="font-size: 9px; line-height: 5px">Business Name</h4>
          <p style="font-size: 9px; line-height: 5px">email@business.com</p>
          <p style="font-size: 9px; line-height: 5px">+21621612345678'</p>
          <p style="font-size: 9px; line-height: 5px">Contact Address</p>
      </div>

      <div style="margin-bottom: 100px; margin-top: 20px">
      <p class="title">Bill to:</p>
        <h4 style="font-size: 9px; line-height: 5px">${name}</h4>
        <p style="font-size: 9px; line-height: 5px">${email}</p>
        <p style="font-size: 9px; line-height: 5px">${phone}</p>
        <p style="font-size: 9px; line-height: 5px">${address.zip} ${
    address.state
  } ${address.city} ${address.street}</p>
      </div>

    <div class="status" style="margin-top: -280px">
    <p class="title" style="font-size: 8px">Order Number</p>
        <p style="font-size: 8px; margin-bottom: 10px">${orderNumber}</p>
        <p class="title" style="font-size: 8px">Status</p>
        <h3 style="font-size: 12px">${status}</h3>
        <p class="title" style="font-size: 8px">Date</p>
        <p  style="font-size: 9px" >${moment(today).format('ll')}</p>
        <p class="title"  style="font-size: 8px">Due Date</p>
        <p  style="font-size: 9px">${moment(orderDate).format('ll')}</p>
        <p class="title"  style="font-size: 8px">Amount</p>
        <h3 style="font-size: 12px">${orderTotal}</h3>
    </div>
</section>

<table>
  <tr>
    <th style="font-size: 9px">Item</th>
    <th style="font-size: 9px">Quantity</th>
    <th style="font-size: 9px">Price</th>
    <th style="font-size: 9px">Discount(%)</th>
    <th style="text-align: right; font-size: 9px">Line total</th>
  </tr>

  ${items.map(
    (item) =>
      `  <tr>
    <td style="font-size: 9px">${item.product.name}</td>
    <td style="font-size: 9px">${item.quantity}</td>
    <td style="font-size: 9px">${item.price}</td>
    <td style="font-size: 9px">0</td>
    <td style="text-align: right; font-size: 9px">${item.lineTotal}</td>
  </tr>`
  )}


</table>

<section class="summary">
    <table>
        <tr>
          <th style="font-size: 9px">Invoice Summary</th>
          <th></th>
        </tr>
        <tr>
          <td style="font-size: 9px">Sub Total</td>
          <td style="text-align: right; font-size: 9px; font-weight: 700">${orderTotal}</td>
        </tr>

        <tr>
            <td style="font-size: 10px">VAT</td>
            <td style="text-align: right; font-size: 9px; font-weight: 700">${69}</td>
          </tr>

        <tr>
            <td style="font-size: 10px">Total</td>
            <td style="text-align: right; font-size: 9px; font-weight: 700">${orderTotal}</td>
          </tr>

        <tr>
            <td style="font-size: 10px" >Paid</td>
            <td style="text-align: right; font-size: 9px; font-weight: 700">${69}</td>
          </tr>

          <tr>
          <td style="font-size: 9px">Balance Due</td>
          <td style="text-align: right; font-size: 9px; font-weight: 700">${69}</td>
        </tr>
        
      </table>
  </section>
  <div>
      <hr>
      <h4 style="font-size: 9px">Note</h4>
      <p style="font-size: 9px">Notes</p>
  </div>
</div>
</body>
</html>`;
}
