jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({
    params: {
      id: 'a1000000-0000-0000-0000-000000000001',
      checkIn: '2026-03-20',
      checkOut: '2026-03-25',
      guests: 2,
    },
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, _opts?: Record<string, unknown>) => key }),
}));

jest.mock('../../i18n', () => ({
  changeLanguage: jest.fn(),
}));

jest.mock('../../api/hooks/useSearch', () => ({
  useHotelDetail: () => ({ data: null, isLoading: true }),
  useHotelRooms: () => ({ data: null, isLoading: true }),
  useHotelReviews: () => ({ data: null, isLoading: true }),
}));

jest.mock('../../api/hooks/useCart', () => ({
  useSetCart: () => ({ mutate: jest.fn() }),
}));

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
      React.createElement(View, props, children),
  };
});

import React from 'react';
import { render } from '@testing-library/react-native';
import { LocaleProvider } from '../../contexts/LocaleContext';
import PropertyDetailScreen from './PropertyDetailScreen';

// Datos de hotel y habitaciones para pruebas con la pantalla cargada
const mockHotel = {
  id: 'a1000000-0000-0000-0000-000000000001',
  type: 'Hotel',
  name: 'Hotel Santa Clara Sofitel',
  location: 'Centro Historico, Cartagena',
  rating: 4.8,
  reviewCount: 312,
  stars: 5,
  photoCount: 3,
  freeCancellation: true,
  gradient: ['#006874', '#4A9FAA'],
  amenities: [
    { icon: 'wifi', label: 'Wi-Fi' },
    { icon: 'pool', label: 'Piscina' },
  ],
};

const mockRooms = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    room_type: 'Superior',
    capacity: 2,
    price_per_night: 480000,
    free_cancellation: true,
  },
  {
    id: 'b1000000-0000-0000-0000-000000000002',
    room_type: 'Doble',
    capacity: 4,
    price_per_night: 520000,
    free_cancellation: true,
  },
];

describe('PropertyDetailScreen', () => {
  it('muestra el skeleton mientras carga', () => {
    const { toJSON } = render(
      <LocaleProvider>
        <PropertyDetailScreen />
      </LocaleProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('muestra el contenido del hotel cuando los datos están disponibles', () => {
    jest
      .spyOn(require('../../api/hooks/useSearch'), 'useHotelDetail')
      .mockReturnValue({ data: mockHotel, isLoading: false });
    jest
      .spyOn(require('../../api/hooks/useSearch'), 'useHotelRooms')
      .mockReturnValue({ data: { rooms: mockRooms, total: 2 }, isLoading: false });

    const { getByText } = render(
      <LocaleProvider>
        <PropertyDetailScreen />
      </LocaleProvider>
    );

    expect(getByText(mockHotel.name)).toBeTruthy();
  });

  it('muestra la pantalla sin errores con datos cargados', () => {
    const useSearchMock = require('../../api/hooks/useSearch');
    useSearchMock.useHotelDetail = () => ({ data: mockHotel, isLoading: false });
    useSearchMock.useHotelRooms = () => ({
      data: { rooms: mockRooms, total: 2 },
      isLoading: false,
    });

    const { toJSON } = render(
      <LocaleProvider>
        <PropertyDetailScreen />
      </LocaleProvider>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('muestra el botón de reservar', () => {
    const useSearchMock = require('../../api/hooks/useSearch');
    useSearchMock.useHotelDetail = () => ({ data: mockHotel, isLoading: false });
    useSearchMock.useHotelRooms = () => ({
      data: { rooms: mockRooms, total: 2 },
      isLoading: false,
    });

    const { getByText } = render(
      <LocaleProvider>
        <PropertyDetailScreen />
      </LocaleProvider>
    );
    expect(getByText('propertyDetail.bookNow')).toBeTruthy();
  });

  it('muestra la descripción del hotel desde la API cuando está disponible', () => {
    const useSearchMock = require('../../api/hooks/useSearch');
    const hotelWithDescription = {
      ...mockHotel,
      description: 'Un hotel histórico en el corazón de Cartagena',
    };
    useSearchMock.useHotelDetail = () => ({ data: hotelWithDescription, isLoading: false });
    useSearchMock.useHotelRooms = () => ({
      data: { rooms: mockRooms, total: 2 },
      isLoading: false,
    });
    useSearchMock.useHotelReviews = () => ({ data: null, isLoading: false });

    const { getByText } = render(
      <LocaleProvider>
        <PropertyDetailScreen />
      </LocaleProvider>
    );

    expect(getByText('Un hotel histórico en el corazón de Cartagena')).toBeTruthy();
  });

  it('muestra el fallback i18n de descripción cuando el hotel no tiene descripción', () => {
    const useSearchMock = require('../../api/hooks/useSearch');
    const hotelWithoutDescription = { ...mockHotel, description: '' };
    useSearchMock.useHotelDetail = () => ({ data: hotelWithoutDescription, isLoading: false });
    useSearchMock.useHotelRooms = () => ({
      data: { rooms: mockRooms, total: 2 },
      isLoading: false,
    });
    useSearchMock.useHotelReviews = () => ({ data: null, isLoading: false });

    const { getByText } = render(
      <LocaleProvider>
        <PropertyDetailScreen />
      </LocaleProvider>
    );

    expect(getByText('propertyDetail.description')).toBeTruthy();
  });

  it('muestra las reseñas provenientes de la API cuando están disponibles', () => {
    const useSearchMock = require('../../api/hooks/useSearch');
    useSearchMock.useHotelDetail = () => ({ data: mockHotel, isLoading: false });
    useSearchMock.useHotelRooms = () => ({
      data: { rooms: mockRooms, total: 2 },
      isLoading: false,
    });
    useSearchMock.useHotelReviews = () => ({
      data: [
        { name: 'Laura P.', initial: 'LP', stars: 5, text: 'Excelente servicio y ubicación.' },
        { name: 'Juan S.', initial: 'JS', stars: 4, text: 'Muy buena experiencia.' },
      ],
      isLoading: false,
    });

    const { getByText } = render(
      <LocaleProvider>
        <PropertyDetailScreen />
      </LocaleProvider>
    );

    expect(getByText('Laura P.')).toBeTruthy();
    expect(getByText('Juan S.')).toBeTruthy();
  });

  it('no muestra reseñas cuando la API devuelve lista vacía', () => {
    const useSearchMock = require('../../api/hooks/useSearch');
    useSearchMock.useHotelDetail = () => ({ data: mockHotel, isLoading: false });
    useSearchMock.useHotelRooms = () => ({
      data: { rooms: mockRooms, total: 2 },
      isLoading: false,
    });
    useSearchMock.useHotelReviews = () => ({ data: [], isLoading: false });

    const { queryByText } = render(
      <LocaleProvider>
        <PropertyDetailScreen />
      </LocaleProvider>
    );

    expect(queryByText('Maria G.')).toBeNull();
    expect(queryByText('Carlos M.')).toBeNull();
    expect(queryByText('Ana L.')).toBeNull();
  });

  it('muestra un indicador de carga cuando las reseñas están cargando', () => {
    const useSearchMock = require('../../api/hooks/useSearch');
    useSearchMock.useHotelDetail = () => ({ data: mockHotel, isLoading: false });
    useSearchMock.useHotelRooms = () => ({
      data: { rooms: mockRooms, total: 2 },
      isLoading: false,
    });
    useSearchMock.useHotelReviews = () => ({ data: null, isLoading: true });

    const { getByText, queryByText } = render(
      <LocaleProvider>
        <PropertyDetailScreen />
      </LocaleProvider>
    );

    expect(getByText('propertyDetail.loadingReviews')).toBeTruthy();
    expect(queryByText('Maria G.')).toBeNull();
    expect(queryByText('Carlos M.')).toBeNull();
  });
});
