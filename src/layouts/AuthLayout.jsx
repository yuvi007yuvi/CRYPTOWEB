import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="/crypto-icon.svg"
            alt="CryptoSimX"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            CryptoSimX
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Crypto Test Trading and Withdrawal Simulator
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            This is a simulation platform. No real cryptocurrency transactions are performed.
          </p>
        </div>
      </div>
    </div>
  )
}