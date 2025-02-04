import { createContext, useContext, useState } from 'react';

const RentalPeriodContext = createContext();

export function RentalPeriodProvider({ children }) {
  const [rentalPeriod, setRentalPeriod] = useState({
    startDate: null,
    endDate: null
  });

  return (
    <RentalPeriodContext.Provider value={{ rentalPeriod, setRentalPeriod }}>
      {children}
    </RentalPeriodContext.Provider>
  );
}

export function useRentalPeriod() {
  return useContext(RentalPeriodContext);
}
