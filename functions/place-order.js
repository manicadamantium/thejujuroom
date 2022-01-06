require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendOrder(name, email, products, shippingFee = 0) {
  const msg = {
    to: process.env.RECEIVER_EMAIL, // Change to your recipient
    from: process.env.RECEIVER_EMAIL, // Change to your verified sender
    subject: "New order placed",
  };

  const total = products.reduce((previous, current) => {
        const itemPrice = current.price * current.quantity;
        return previous + itemPrice;
  }, 0);
  
  const productsAsText = products
    .map((p) => `- ${p.name} ($ ${p.price.toFixed()} x ${p.quantity})`)
    .join("\n");
  const productsAsHtml = products
    .map((p) => `<li>${p.name} ($ ${p.price.toFixed()} x ${p.quantity})</li>`)
    .join("\n");

  msg.text = `Name: ${name}\nEmail: ${email}\n\nProducts ordered:\n${productsAsText}\nShipping fee: $ ${shippingFee.toFixed(2)}\n\nTOTAL: $ ${total.toFixed(2)}`;
  msg.html = `<b>Name</b>: ${name}<br><b>Email</b>: ${email}<br><br><b>Products ordered</b>:<br><ul>${productsAsHtml}</ul><br><b>Shipping fee</b>: $ ${shippingFee.toFixed(2)}<br><b>TOTAL:</b> $ ${(total + shippingFee).toFixed(2)}`;

  return sgMail.send(msg);
}

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: "This endpoint only allows for POST requests.",
      }),
    };
  }

  const { name, email, products, shippingFee } = JSON.parse(event.body);

  let response = {};

  await sendOrder(name, email, products, shippingFee)
    .then(() => {
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: "Order placed successfully!",
          body: { name, email, products, shippingFee },
        }),
      };
    })
    .catch((error) => {
      response = {
        statusCode: 500,
        body: JSON.stringify({
          message: "Something went wrong.",
          body: { name, email, products },
          error
        }),
      };
    });

  return response;
};
