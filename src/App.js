import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useState, useEffect } from "react";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

/*global chrome*/
function App() {
  const [value, setValue] = useState(0);
  const [yelpData, setYelpData] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const res = await chrome.tabs.sendMessage(tab.id, { type: 'getInfo' });

      const yelpPromise = axios.post("http://jiajianwu.pythonanywhere.com/redfin/yelp", JSON.stringify(res), { headers: { 'Content-Type': 'application/json' } });
      // const nichePromise = axios.get("https://api.example.com/api2");

      const [yelpResponse] = await Promise.all([
        yelpPromise,
        // nichePromise
      ]);

      setYelpData(yelpResponse.data);
      // setData2(nicheResponse.data);
    };

    fetchData();
  }, []);

  return (
      <Box>
        <Box sx={{ width: 650, margin: "auto", borderBottom: 1, borderColor: 'divider'}}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Restaurants" {...a11yProps(0)} />
            <Tab label="Schools" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          {yelpData && <YelpComponent data={yelpData} />}
        </TabPanel>

        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>

        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </Box>
  );
}

const YelpComponent = ({ data }) => {
  return (
    <>
      {data.map(({ name, url }) => (
        <>
          <div>{name}</div>
          <div>{url}</div>
        </>
      ))}
    </>
  )
}

export default App;
