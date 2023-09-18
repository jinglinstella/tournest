/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51NrZu7LteDnvhYGQKgZCVqwnjAUQGPh9wkQDqn7TkBkaNRg2wHe6ETXKpKG1BUmtGmo4BDAG0ZcdtAdmBSL6PbhP00WsbRod4J');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log("session", session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
