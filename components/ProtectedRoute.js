import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return children;
}