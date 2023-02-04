import React, { useContext, useEffect, useState } from 'react'

const EndUserContext = React.createContext({
  isLoading: false,
  error: null,
  endUser: null,
  sync: async () => {},
})

export const EndUserProvider = (props: any) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [endUser, setEndUser] = useState(null)

  const fetchEndUser = async () => {
    setIsLoading(true)
    const res = await fetch('/api/end_users/me')
    if (!res.ok) {
      const { error } = await res.json()
      setError(error)
      setEndUser(null)
    } else {
      const { data } = await res.json()
      setError(null)
      setEndUser(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchEndUser()
  }, [])
  return (
    <EndUserContext.Provider
      value={{ isLoading, error, endUser, sync: fetchEndUser }}
      {...props}
    />
  )
}

export const useEndUser = () => {
  const endUserContext = useContext(EndUserContext)
  return {
    isLoading: endUserContext.isLoading,
    error: endUserContext.error,
    endUser: endUserContext.endUser,
    sync: endUserContext.sync,
  }
}
