import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const CityContext = createContext(null);

export const DEFAULT_CITY = {
  _id: 'default_mumbai',
  name: 'Mumbai',
  state: 'Maharashtra',
  isPopular: true,
  isActive: true,
  coordinates: { lat: 19.076, lng: 72.8777 },
};

export const CityProvider = ({ children }) => {
  // Stored selected city in localStorage
  const [selectedCity, setSelectedCity] = useState(() => {
    const saved = localStorage.getItem('selected_city');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to default
      }
    }
    return DEFAULT_CITY;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Fetch managed cities from backend with caching
  const { data: citiesData, isLoading: isCitiesLoading, refetch: refetchCities } = useQuery({
    queryKey: ['managed-cities'],
    queryFn: async () => {
      const res = await api.get('/cities');
      return res.data || [];
    },
    staleTime: 1000 * 60 * 15, // 15 minutes cache
  });

  const availableCities = citiesData && citiesData.length > 0 ? citiesData : [DEFAULT_CITY];
  const popularCities = availableCities.filter((c) => c.isPopular);

  // Manual city change
  const changeCity = useCallback((city) => {
    setSelectedCity(city);
    localStorage.setItem('selected_city', JSON.stringify(city));
    setIsModalOpen(false);
    setLocationError('');
  }, []);

  // Geolocation detection
  const detectUserLocation = useCallback(async () => {
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsModalOpen(true);
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await api.get('/cities/detect', {
            params: { lat: latitude, lng: longitude },
          });

          if (res.data?.city) {
            changeCity(res.data.city);
          }
        } catch (err) {
          console.warn('Backend city detection failed, using fallback:', err.message);
          setLocationError('Unable to match your location to a cinema city.');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        let message = 'Could not access location.';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location access was denied. Please choose your city manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          message = 'Location detection timed out.';
        }
        setLocationError(message);
        // Automatically open manual modal so user isn't stuck
        setIsModalOpen(true);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  }, [changeCity]);

  const openCityModal = () => {
    setLocationError('');
    setIsModalOpen(true);
  };

  const closeCityModal = () => {
    setIsModalOpen(false);
    setLocationError('');
  };

  const value = {
    selectedCity,
    availableCities,
    popularCities,
    isCitiesLoading,
    changeCity,
    detectUserLocation,
    isDetectingLocation,
    locationError,
    isModalOpen,
    openCityModal,
    closeCityModal,
    refetchCities,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};
