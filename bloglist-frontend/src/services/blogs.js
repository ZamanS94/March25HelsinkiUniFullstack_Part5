import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: { Authorization: token }
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (updatedBlog) => {
  try {
    console.log('Blog updates:', updatedBlog);

    const config = {
      headers: { Authorization: token }
    };
    
    console.log('URL:', `${baseUrl}/${updatedBlog.id}`);
    console.log('Headers:', config);

    const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config);

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error.response?.data || error.message);
    throw error;
  }
};

const remove = async (id) => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`${baseUrl}/${id}`, config)
}


export default { setToken, getAll, create, update, remove }