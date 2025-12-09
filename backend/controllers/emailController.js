import { sendEmail } from "../utils/emailService.js";
import {
  generateOrderConfirmationTemplate,
  generateOrderShippedTemplate,
  generateOrderCancelledTemplate,
} from "../templates/emailTemplates.js";

export const sendOrderConfirmationEmail = async (req, res) => {
  try {
    const { user, order, orderItems } = req.body;

    const html = generateOrderConfirmationTemplate(user, order, orderItems);

    await sendEmail({
      to: user.email,
      subject: `Vakio Boky - Confirmation de votre commande #${order.order_number}`,
      html,
    });

    res.json({
      success: true,
      message: "Email de confirmation envoyé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur envoi email confirmation:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'envoi de l'email",
    });
  }
};

export const sendOrderShippedEmail = async (req, res) => {
  try {
    const { user, order, trackingNumber } = req.body;

    const html = generateOrderShippedTemplate(user, order, trackingNumber);

    await sendEmail({
      to: user.email,
      subject: `Vakio Boky - Votre commande #${order.order_number} a été expédiée !`,
      html,
    });

    res.json({
      success: true,
      message: "Email d'expédition envoyé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur envoi email expédition:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'envoi de l'email",
    });
  }
};

export const sendOrderCancelledEmail = async (req, res) => {
  try {
    const { user, order, reason } = req.body;

    const html = generateOrderCancelledTemplate(user, order, reason);

    await sendEmail({
      to: user.email,
      subject: `Vakio Boky - Annulation de votre commande #${order.order_number}`,
      html,
    });

    res.json({
      success: true,
      message: "Email d'annulation envoyé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur envoi email annulation:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de l'envoi de l'email",
    });
  }
};
