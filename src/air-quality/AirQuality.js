import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./air-quality.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Graph from "../graph/Graph";
import { format } from "date-fns";

const AirQuality = () => {
  const [data, setData] = useState([]);
  const [reportLatest, setReportLatest] = useState({});
  const [aqiToday, setAquiToday] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const aqIndexDelhi =
    data?.map((item) => item.value).reduce((sum, val) => sum + val, 0) /
    data.length;

  useEffect(() => {
    getReport();
  }, []);

  useEffect(() => {
    getReport();
  }, [startDate, endDate]);

  const getReport = async () => {
    try {
      if (!startDate && !endDate) {
        const response = await axios.get(
          `https://api.openaq.org/v1/measurements?city=Delhi`
        );
        setData(response?.data.results);
        setReportLatest(response?.data.results[0]);
      }
      if (startDate && endDate) {
        const from = format(startDate, "yyyy-MM-dd");
        const to = format(endDate, "yyyy-MM-dd");
        const response = await axios.get(
          `https://api.openaq.org/v1/measurements?city=Delhi&date_from=${from}&date_to=${to}`
        );
        setData(response?.data.results);
        setReportLatest(response?.data.results[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onStartDateSelected = (date) => {
    setStartDate(date);
  };

  const onEndDateSelected = (date) => {
    setEndDate(date);
  };

  const showMainScreen = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  useMemo(() => {
    if (aqIndexDelhi < 50) {
      setAquiToday("Good");
    } else if (aqIndexDelhi < 100) {
      setAquiToday("Moderate");
    } else if (aqIndexDelhi > 100) {
      setAquiToday("Unhealthy for Sensitive Groups");
    } else if (aqIndexDelhi < 150) {
      setAquiToday("Unhealthy");
    } else if (aqIndexDelhi > 150) {
      setAquiToday("Very Unhealthy");
    } else if (aqIndexDelhi > 300) {
      setAquiToday("Hazardous");
    }
  }, [aqIndexDelhi]);

  return (
    <div className="air-quality">
      <div className="date-range">
        <h2>Check air quality values of Delhi</h2>
        <div className="date-pickers">
          <div className="d-flex">
            <h4>from:</h4>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              placeholderText="Start Date"
              selected={startDate}
              value={startDate}
              onChange={onStartDateSelected}
              maxDate={new Date()}
              name="start_date"
            />
          </div>
          <div className="d-flex">
            <h4>to:</h4>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              placeholderText="End Date"
              selected={endDate}
              value={endDate}
              onChange={onEndDateSelected}
              maxDate={new Date()}
              name="end_date"
            />
          </div>
        </div>
      </div>
      {startDate && endDate ? (
        <>
          <Graph data={data} />
          <button onClick={showMainScreen}>Go Back</button>
        </>
      ) : (
        <div className="show-quality">
          <h2>Air quality Today: Delhi</h2>
          <h3>City: {reportLatest?.city}</h3>
          <h3>Latitude: {reportLatest?.coordinates?.latitude}</h3>
          <h3>Longitude: {reportLatest?.coordinates?.longitude}</h3>
          <h3> Air quality: {aqiToday}</h3>
        </div>
      )}
    </div>
  );
};

export default AirQuality;
