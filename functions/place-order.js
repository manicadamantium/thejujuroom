require('dotenv').config()

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendOrder (name, email, products, shippingFee = 0) {
  const msg = {
    to: process.env.RECEIVER_EMAIL, // Change to your recipient
    from: process.env.SENDER_EMAIL, // Change to your verified sender
    subject: 'New order placed'
  }
  
  let total = products.reduce((previous, current) => {
    let itemPrice = 1;
    if (current.selectedVariant) {
      itemPrice = current.selectedVariant.price;
    } else {
      itemPrice = current.price;
    }

    const itemTotal = itemPrice * current.quantity;
    return previous + itemTotal;
  }, 0)

  console.log('[PRODUCTS]', products)
  const productsAsText = products
    .map(p => {
      let string = ''
      if (p.price)
        string = `- ${p.name} ($ ${p.price.toFixed()} × ${p.quantity})`
      else if (p.selectedVariant)
        string = `- ${p.name} [${p.selectedVariant.name}] ($ ${p.selectedVariant.price.toFixed()} × ${p.quantity})`

      return string
    })
    .join('\n')

  const productsAsHtml = products
    .map(p => {
      let string = ''
      if (p.price)
        string = `<li>${p.name} ($ ${p.price.toFixed()} × ${p.quantity})</li>`
      else if (p.selectedVariant)
        string = `<li>${p.name} [${p.selectedVariant.name}] ($ ${p.selectedVariant.price.toFixed()} × ${p.quantity})</li>`

      return string
    })
    .join('\n')

  msg.text = `Name: ${name}\nEmail: ${email}\n\nProducts ordered:\n${productsAsText}\nShipping fee: $ ${shippingFee.toFixed(
    2
  )}\n\nTOTAL: $ ${total.toFixed(2)}`
  msg.html = `<b>Name</b>: ${name}<br><b>Email</b>: ${email}<br><br><b>Products ordered</b>:<br><ul>${productsAsHtml}</ul><br><b>Shipping fee</b>: $ ${shippingFee.toFixed(
    2
  )}<br><b>TOTAL:</b> $ ${(total + shippingFee).toFixed(2)}`

  return sgMail.send(msg)
}

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: 'This endpoint only allows for POST requests.'
      })
    }
  }

  const { name, email, products, shippingFee } = JSON.parse(event.body)

  let response = {}

  await sendOrder(name, email, products, shippingFee)
    .then(() => {
      response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Order placed successfully!',
          body: { name, email, products, shippingFee }
        })
      }
    })
    .catch(error => {
      console.error(error)
      response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Something went wrong.',
          body: { name, email, products },
          error
        })
      }
    })

  return response
}
