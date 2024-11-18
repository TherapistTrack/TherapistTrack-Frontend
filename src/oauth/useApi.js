import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'

export function useApi() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const isLoading = ref(true)
  let url_base = 'https://api.therapisttrack.name'

  const getAuthToken = async () => {
    isLoading.value = true
    if (isAuthenticated.value) {
      try {
        isLoading.value = false
        return await getAccessTokenSilently()
      } catch (error) {
        isLoading.value = false
        console.error('Error fetching access token:', error)
        return null
      }
    }
    isLoading.value = false
    return null
  }

  const getRequest = async (url) => {
    const token = await getAuthToken()
    if (!token) {
      isLoading.value = false
      throw new Error('User is not authenticated')
    }

    try {
      const response = await axios.get(`${url_base}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      isLoading.value = false
      return response.data
    } catch (error) {
      console.error('Error making GET request:', error)
      isLoading.value = false
      throw error
    }
  }

  const putRequest = async (url, body) => {
    const token = await getAuthToken()
    if (!token) {
      isLoading.value = false
      throw new Error('User is not authenticated')
    }

    try {
      const response = await axios.put(`${url_base}${url}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      isLoading.value = false
      return response.data
    } catch (error) {
      console.error('Error making PUT request:', error)
      isLoading.value = false
      throw error
    }
  }

  const postRequest = async (url, body) => {
    const token = await getAuthToken()
    if (!token) {
      isLoading.value = false
      throw new Error('User is not authenticated')
    }
    try {
      const response = await axios.post(`${url_base}${url}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      isLoading.value = false
      return response.data
    } catch (error) {
      console.error('Error making POST request:', error)
      isLoading.value = false
      throw error
    }
  }

  const deleteRequest = async (url, body) => {
    const token = await getAuthToken()
    if (!token) {
      isLoading.value = false
      throw new Error('User is not authenticated')
    }

    try {
      const response = await axios.delete(`${url_base}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        data: body
      })
      isLoading.value = false
      return response.data
    } catch (error) {
      console.error('Error making DELETE request:', error)
      isLoading.value = false
      throw error
    }
  }

  const patchRequest = async (url, body) => {
    const token = await getAuthToken()
    if (!token) {
      isLoading.value = false
      throw new Error('User is not authenticated')
    }

    try {
      const response = await axios.patch(`${url_base}${url}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      isLoading.value = false
      return response.data
    } catch (error) {
      console.error('Error making PATCH request:', error)
      isLoading.value = false
      throw error
    }
  }

  const uploadRequest = async (url, file, metadata) => {
    const token = await getAuthToken()
    if (!token) {
      isLoading.value = false
      throw new Error('User is not authenticated')
    }

    let formData = new FormData()
    formData.append('metadata', JSON.stringify(metadata))
    formData.append('file', file)

    try {
      const response = await axios.post(`${url_base}${url}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data; charset=UTF-8',
          Authorization: `Bearer ${token}`
        }
      })
      isLoading.value = false
      return response.data
    } catch (error) {
      console.error('Error making PATCH request:', error)
      isLoading.value = false
      throw error
    }
  }

  const initialize = async () => {
    isLoading.value = true
    await getAuthToken()
    isLoading.value = false
  }

  return {
    isAuthenticated,
    user,
    isLoading,
    uploadRequest,
    getRequest,
    initialize,
    putRequest,
    postRequest,
    deleteRequest,
    patchRequest
  }
}
