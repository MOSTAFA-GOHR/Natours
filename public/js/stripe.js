import axios from 'axios';
import { showAlert } from './alert';


const stripe = new Stripe('pk_test_51UGXYEDA5BxkdIao6XgMPwBsFUNS7H1gC6Eh1JIz0FPXMFlJ29oTBzd599AkP8BT5un9GCigrOUstzLyM5tKAJpH008rakZqQ2');

export const bookTour = async tourId => {
  try {
    //1)Get Session from api
    const session = await axios.get(`http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`);

    //2)create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });

  } catch (err) {
    console.log(err);
    showAlert('error', err)
  }
}