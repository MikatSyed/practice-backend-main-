import httpStatus from 'http-status';
import axios from 'axios';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';

const initPayment = async (payload: any) => {
  try {
    const data = {
      store_id: config.ssl.storeId,
      store_passwd: config.ssl.storePass,
      total_amount: payload.total_amount,
      currency: 'BDT',
      tran_id: payload.tran_id, // use unique tran_id for each api call
      success_url: `http:localhost:6060/api/v1/payment/success?transectionId=${payload.tran_id}`,
      fail_url: `http:localhost:6060/fail?transectionId=${payload.tran_id}`,
      cancel_url: `http:localhost:6060/cancel`,
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'N/A',
      product_name: 'Service Payment',
      product_category: 'Payment',
      product_profile: 'User',
      cus_name: payload.cus_name,
      cus_email: payload.cus_email,
      cus_add1: payload.cus_add1,
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: payload.cus_phone,
      cus_fax: '01711111111',
      ship_name: 'Customer Name',
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
    };

    const response = await axios({
      method: 'post',
      url: config.ssl.sslPaymentUrl,
      data: data,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log(response);

    return response.data;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment error');
  }
};

const validate = async (data: any) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${config.ssl.sslValidationUrl}?val_id=${data.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`,
    });
    console.log(response);
    return response.data;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Payment error');
  }
};

export const sslService = {
  initPayment,
  validate,
};
