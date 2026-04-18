import axios from "axios";

export async function createRazorpayPayout(
  amount: number,
  accountNumber: string,
  ifsc: string,
  name: string,
  orderId: number,
) {
  const response = await axios.post(
    "https://api.razorpay.com/v1/payouts",
    {
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER!,
      fund_account: {
        account_type: "bank_account",
        bank_account: {
          name,
          ifsc,
          account_number: accountNumber,
        },
        contact: {
          name,
          type: "vendor",
        },
      },
      amount: Math.round(amount * 100),
      currency: "INR",
      mode: "NEFT",
      purpose: "payout",
      reference_id: `payout_order_${orderId}`,
    },
    {
      auth: {
        username: process.env.RAZORPAY_KEY_ID!,
        password: process.env.RAZORPAY_KEY_SECRET!,
      },
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
}