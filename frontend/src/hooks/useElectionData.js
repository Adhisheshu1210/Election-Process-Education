import { useState, useEffect, useContext } from "react";
import { LocationContext } from "../App";

export function useElectionData() {
  const { location } = useContext(LocationContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!location) return;
    // Fetch election data from backend if needed
    // Example:
    // fetch(`${process.env.VITE_API_URL}/election-data?country=${location.country}`)
    //   .then(res => res.json())
    //   .then(setData);
  }, [location]);

  return data;
}
