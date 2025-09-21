// src/api/wbApi.ts
import axios from 'axios'

const host = ''
const token = import.meta.env.VITE_API_KEY

const api = axios.create({
    baseURL: host,
    timeout: 10000
})

async function fetchData(endpoint: string, params: Record<string, any> = {}) {
    const res = await api.get(endpoint, {
        params: {
            ...params,
            key: token
        }
    })
    return res.data
}

export function fetchIncomes(params: { dateFrom: string; dateTo: string; page?: number; limit?: number }) {
    return fetchData('/api/incomes', params)
}

export function fetchOrders(params: { dateFrom: string; dateTo: string; page?: number; limit?: number }) {
    return fetchData('/api/orders', params)
}

export function fetchStocks(params: { dateFrom: string; dateTo: string; page?: number; limit?: number }) {
    return fetchData('/api/sales', params)
}

