import toast from 'react-hot-toast'

export const success = text => {
  return toast.success(text, {
    style: { borderRadius: '10px', background: '#333', color: '#fff' }
  })
}

export const error = text => {
  return toast.error(text, {
    style: { borderRadius: '10px', background: '#333', color: '#fff' }
  })
}
