const payPalButtons = (fundingSource) => paypal
.Buttons({
    className:'treere',
  fundingSource,
  // Sets up the transaction when a payment button is clicked
  createOrder: function () {
    return fetch("/api/orders", {
      method: "post",
      body: JSON.stringify({
        price: 1,
        quantity: 1,
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  },
  // Finalize the transaction after payer approval
  onApprove: function (data) {
    return fetch(`/api/orders/${data.orderID}/capture`, {
      method: "post",
    })
      .then((response) => response.json())
      .then((orderData) => {
        console.log(
          "Capture result",
          orderData,
          JSON.stringify(orderData, null, 2)
        );
        const transaction = orderData.purchase_units[0].payments.captures[0];
        alert(`Transaction ${transaction.status}: ${transaction.id}
          See console for all available details
        `);
        // When ready to go live, remove the alert and show a success message within this page. For example:
        // var element = document.getElementById('paypal-button-container');
        // element.innerHTML = '<h3>Thank you for your payment!</h3>';
        // Or go to another URL:  actions.redirect('thank_you.html');
      });
  },
})
// .render("#paypal-button-container");



  paypal.getFundingSources().forEach(function(fundingSource) {
    // Check if the button is eligible
    if (paypal.FUNDING.PAYPAL === fundingSource) {
      // Initialize the buttons
      var button = payPalButtons(fundingSource);
      // Render the standalone button for that funding source
      button.render('#paypal-button-container');
    }
  });
