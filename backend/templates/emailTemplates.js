export const generateOrderConfirmationTemplate = (user, order, orderItems) => {
  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .product-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .total { font-weight: bold; font-size: 1.2em; text-align: right; margin-top: 15px; }
        .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vakio Boky</h1>
          <p>Communauté Littéraire</p>
        </div>
        
        <div class="content">
          <h2>Merci pour votre commande !</h2>
          <p>Bonjour <strong>${user.first_name}</strong>,</p>
          <p>Votre commande a été confirmée et est en cours de préparation.</p>
          
          <div class="order-details">
            <h3>Détails de la commande</h3>
            <p><strong>Numéro de commande:</strong> ${order.order_number}</p>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString("fr-FR")}</p>
            
            <h4>Articles commandés:</h4>
            ${orderItems
              .map(
                (item) => `
              <div class="product-item">
                <span>${item.quantity}x ${item.product_name}</span>
                <span>${(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            `,
              )
              .join("")}
            
            <div class="total">
              Total: ${total.toFixed(2)} €
            </div>
          </div>
          
          <p>Nous vous tiendrons informé de l'avancement de votre commande.</p>
          <p>Cordialement,<br>L'équipe Vakio Boky</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Vakio Boky. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateOrderShippedTemplate = (user, order, trackingNumber) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; }
        .tracking-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vakio Boky</h1>
          <p>Votre commande est en route !</p>
        </div>
        
        <div class="content">
          <h2>Votre commande a été expédiée</h2>
          <p>Bonjour <strong>${user.first_name}</strong>,</p>
          <p>Votre commande <strong>#${order.order_number}</strong> a été expédiée et est en route vers vous.</p>
          
          ${
            trackingNumber
              ? `
          <div class="tracking-info">
            <h3>Informations de suivi</h3>
            <p><strong>Numéro de suivi:</strong> ${trackingNumber}</p>
            <p>Vous pouvez suivre votre colis avec ce numéro sur le site du transporteur.</p>
          </div>
          `
              : ""
          }
          
          <p>Merci de votre confiance !</p>
          <p>Cordialement,<br>L'équipe Vakio Boky</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Vakio Boky. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateOrderCancelledTemplate = (user, order, reason) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; }
        .cancellation-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Vakio Boky</h1>
          <p>Annulation de commande</p>
        </div>
        
        <div class="content">
          <h2>Votre commande a été annulée</h2>
          <p>Bonjour <strong>${user.first_name}</strong>,</p>
          <p>Votre commande <strong>#${order.order_number}</strong> a été annulée.</p>
          
          <div class="cancellation-info">
            <h3>Raison de l'annulation</h3>
            <p>${reason || "Annulation demandée par le client."}</p>
          </div>
          
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          <p>Cordialement,<br>L'équipe Vakio Boky</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Vakio Boky. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
