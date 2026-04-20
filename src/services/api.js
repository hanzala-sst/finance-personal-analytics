import axios from 'axios'

const BASE_URL = 'https://api.exchangerate-api.com/v4/latest/INR'

export async function fetchExchangeRates() {
  try {
    const res = await axios.get(BASE_URL)
    return res.data.rates
  } catch (err) {
    console.error('Exchange rate fetch failed:', err)
    return null
  }
}
