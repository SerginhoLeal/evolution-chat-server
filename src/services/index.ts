import axios from 'axios';

const evolution_api = axios.create({
  baseURL: `${process.env.EVOLUTION_API}`,
  headers: {
    'Content-Type': 'application/json',
    apikey: `${process.env.API_KEY}`
  }
})

export { evolution_api };