const BASE = 'https://mini-market-6olo.onrender.com/api'

// Token helpers
const getToken = () => localStorage.getItem('mm_token')
const setToken = (t) => localStorage.setItem('mm_token', t)
const removeToken = () => localStorage.removeItem('mm_token')


async function req(path, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers[`Authorization`] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))

 
  console.log('API RESPONSE:', path, data)

  if (res.status === 401) {
    removeToken()
    window.location.href = '/login'
    throw new Error('Sessiya tugadi')
  }

  if (!res.ok) {
    throw new Error(data.message || data.detail || `Xato: ${res.status}`)
  }

  return data
}


export const authApi = {
  login: async (email, password) => {
    const data = await req('/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password, username: email }),
    })

    if (data.token || data.access_token) {
      setToken(data.token || data.access_token)
    }

    return data
  },

  register: async (name, email, password) => {
    const data = await req('/register/', {
      method: 'POST',
      body: JSON.stringify({
        username: name, 
        email,
        password,
      }),
    })

    if (data.token || data.access_token) {
      setToken(data.token || data.access_token)
    }

    return data
  },

  me: async () => {
    try { return await req('/me/') }
    catch { return null }
  },

  logout: () => {
    removeToken()
  },
}


export const productsApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return req(`/products/${q ? '?' + q : ''}`)
  },

  getOne: (id) => req(`/products/${id}/`),

  create: (data) =>
    req('/products/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    req(`/products/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    req(`/products/${id}/`, {
      method: 'DELETE',
    }),
}

export const categoriesApi = {
  getAll: () => req('/categories/'),
}

export const ordersApi = {
  getAll: () => req('/orders/'),

  create: (payload) =>
    req('/orders/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}