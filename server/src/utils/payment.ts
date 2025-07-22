import Stripe from 'stripe';
import { stripeConfig } from '../config';
import { logger } from '../middleware/logger';
import { ErrorResponse } from '../middleware/error';

// Initialize Stripe
const stripe = new Stripe(stripeConfig.secretKey!, {
  apiVersion: '2023-10-16'
});

// Interface for subscription plan
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

// Interface for payment method
interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expMonth: number;
  expYear: number;
  brand: string;
}

// Payment service
export const payment = {
  // Create customer
  createCustomer: async (email: string, name?: string): Promise<string> => {
    try {
      const customer = await stripe.customers.create({
        email,
        name
      });

      return customer.id;
    } catch (error) {
      logger.error('Error creating Stripe customer:', error);
      throw new ErrorResponse('Failed to create customer', 500);
    }
  },

  // Create subscription
  createSubscription: async (
    customerId: string,
    priceId: string,
    paymentMethodId: string
  ): Promise<string> => {
    try {
      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });

      // Set as default payment method
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        expand: ['latest_invoice.payment_intent']
      });

      return subscription.id;
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw new ErrorResponse('Failed to create subscription', 500);
    }
  },

  // Update subscription
  updateSubscription: async (subscriptionId: string, priceId: string): Promise<void> => {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscriptionId,
          price: priceId
        }],
        proration_behavior: 'create_prorations'
      });
    } catch (error) {
      logger.error('Error updating subscription:', error);
      throw new ErrorResponse('Failed to update subscription', 500);
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: string): Promise<void> => {
    try {
      await stripe.subscriptions.del(subscriptionId);
    } catch (error) {
      logger.error('Error canceling subscription:', error);
      throw new ErrorResponse('Failed to cancel subscription', 500);
    }
  },

  // Get payment methods
  getPaymentMethods: async (customerId: string): Promise<PaymentMethod[]> => {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });

      return paymentMethods.data.map(method => ({
        id: method.id,
        type: method.type,
        last4: method.card!.last4,
        expMonth: method.card!.exp_month,
        expYear: method.card!.exp_year,
        brand: method.card!.brand
      }));
    } catch (error) {
      logger.error('Error getting payment methods:', error);
      throw new ErrorResponse('Failed to get payment methods', 500);
    }
  },

  // Add payment method
  addPaymentMethod: async (
    customerId: string,
    paymentMethodId: string
  ): Promise<void> => {
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
    } catch (error) {
      logger.error('Error adding payment method:', error);
      throw new ErrorResponse('Failed to add payment method', 500);
    }
  },

  // Remove payment method
  removePaymentMethod: async (paymentMethodId: string): Promise<void> => {
    try {
      await stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      logger.error('Error removing payment method:', error);
      throw new ErrorResponse('Failed to remove payment method', 500);
    }
  },

  // Create payment intent
  createPaymentIntent: async (amount: number, currency: string): Promise<string> => {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: stripeConfig.paymentMethods as string[]
      });

      return paymentIntent.client_secret!;
    } catch (error) {
      logger.error('Error creating payment intent:', error);
      throw new ErrorResponse('Failed to create payment intent', 500);
    }
  },

  // Handle webhook event
  handleWebhookEvent: async (event: Stripe.Event): Promise<void> => {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          logger.info(`Payment succeeded: ${paymentIntent.id}`);
          // Handle successful payment
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          logger.error(`Payment failed: ${failedPayment.id}`);
          // Handle failed payment
          break;

        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          logger.info(`Subscription cancelled: ${subscription.id}`);
          // Handle subscription cancellation
          break;

        case 'customer.subscription.updated':
          const updatedSubscription = event.data.object as Stripe.Subscription;
          logger.info(`Subscription updated: ${updatedSubscription.id}`);
          // Handle subscription update
          break;

        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      logger.error('Error handling webhook event:', error);
      throw new ErrorResponse('Failed to handle webhook event', 500);
    }
  },

  // Get subscription details
  getSubscriptionDetails: async (subscriptionId: string): Promise<any> => {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['customer', 'default_payment_method']
      });

      return {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        plan: {
          id: subscription.items.data[0].price.id,
          name: subscription.items.data[0].price.nickname,
          amount: subscription.items.data[0].price.unit_amount,
          currency: subscription.items.data[0].price.currency
        }
      };
    } catch (error) {
      logger.error('Error getting subscription details:', error);
      throw new ErrorResponse('Failed to get subscription details', 500);
    }
  },

  // Get invoice details
  getInvoiceDetails: async (invoiceId: string): Promise<any> => {
    try {
      const invoice = await stripe.invoices.retrieve(invoiceId);

      return {
        id: invoice.id,
        number: invoice.number,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: invoice.status,
        paidAt: invoice.status === 'paid' ? invoice.status_transitions.paid_at : null,
        hostedInvoiceUrl: invoice.hosted_invoice_url
      };
    } catch (error) {
      logger.error('Error getting invoice details:', error);
      throw new ErrorResponse('Failed to get invoice details', 500);
    }
  }
};

// Export Stripe instance for direct access if needed
export { stripe };