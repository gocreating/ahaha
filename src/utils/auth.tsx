import React, { useContext, useEffect, useState } from 'react'

const EndUserContext = React.createContext({
  isLoading: false,
  error: null,
  endUser: null,
})

export const EndUserProvider = (props: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [endUser, setEndUser] = useState(null)
  useEffect(() => {
    setIsLoading(true)
    const fetchEndUser = async () => {
      const res = await fetch('/api/end_users/me')
      if (!res.ok) {
        const { error } = await res.json()
        setError(error)
      } else {
        const { data } = await res.json()
        setEndUser(data)
      }
      setIsLoading(false)
    }
    fetchEndUser()
  }, [])
  return (
    <EndUserContext.Provider value={{ isLoading, error, endUser }} {...props} />
  )
}

export const useEndUser = () => {
  const endUserContext = useContext(EndUserContext)
  return {
    isLoading: endUserContext.isLoading,
    error: endUserContext.error,
    endUser: endUserContext.endUser,
  }
}
