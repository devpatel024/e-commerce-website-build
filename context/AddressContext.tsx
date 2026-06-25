'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Address } from '@/lib/types'
import { useAuthContext } from '@/components/AuthProvider'

interface AddressContextType {
  addresses: Address[]
  addAddress: (address: Omit<Address, 'id'>) => void
  removeAddress: (id: string) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  setDefaultAddress: (id: string) => void
  getDefaultAddress: () => Address | undefined
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)

const ADDRESSES_KEY = 'luxe_addresses'

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [mounted, setMounted] = useState(false)

  // Load addresses on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const key = `${ADDRESSES_KEY}_${user.id}`
      const saved = localStorage.getItem(key)
      if (saved) {
        setAddresses(JSON.parse(saved))
      }
    }
    setMounted(true)
  }, [user])

  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses)
    if (typeof window !== 'undefined' && user) {
      const key = `${ADDRESSES_KEY}_${user.id}`
      localStorage.setItem(key, JSON.stringify(newAddresses))
    }
  }

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`,
    }
    saveAddresses([...addresses, newAddress])
  }

  const removeAddress = (id: string) => {
    saveAddresses(addresses.filter(a => a.id !== id))
  }

  const updateAddress = (id: string, updates: Partial<Address>) => {
    saveAddresses(
      addresses.map(a =>
        a.id === id ? { ...a, ...updates } : a
      )
    )
  }

  const setDefaultAddress = (id: string) => {
    saveAddresses(
      addresses.map(a => ({
        ...a,
        isDefault: a.id === id,
      }))
    )
  }

  const getDefaultAddress = () => {
    return addresses.find(a => a.isDefault)
  }

  const value: AddressContextType = {
    addresses: mounted ? addresses : [],
    addAddress,
    removeAddress,
    updateAddress,
    setDefaultAddress,
    getDefaultAddress,
  }

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
}

export function useAddresses() {
  const context = useContext(AddressContext)
  if (context === undefined) {
    throw new Error('useAddresses must be used within an AddressProvider')
  }
  return context
}
