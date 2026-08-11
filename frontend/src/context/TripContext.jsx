import { createContext, useState } from "react";

export const TripContext = createContext();

function TripProvider({ children }) {

  const [tripData, setTripData] = useState(null);

  return (
    <TripContext.Provider
      value={{
        tripData,
        setTripData,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export default TripProvider;