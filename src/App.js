import './App.css';
import React from 'react';
import {
  CircularProgress, Box, ImageList, ImageListItem, List, ListItem, ListItemText,
  Divider, Fab, Tooltip, Typography, Rating, Alert
} from "@mui/material";
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import KebabDiningRoundedIcon from '@mui/icons-material/KebabDiningRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import LocalBarRoundedIcon from '@mui/icons-material/LocalBarRounded';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useState, useEffect } from "react";
import axios from "axios";
import { roundRating } from './utils'
import yelpLogo from './assets/yelp_logo.svg';
import { getReviewRibbon } from './contants';

const StyledFab = styled(Fab)({
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
});

const Item = styled(Paper)(({ theme, fontSize }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
  fontSize: fontSize || theme.typography.body2.fontSize, // Use dynamic font size or default
  display: 'flex',            // Add Flexbox
  alignItems: 'center',       // Vertically center the content
  justifyContent: 'center',   // Horizontally center the content
  height: '100%',             // Ensure the height is 100% for Flexbox to work properly
}));

/*global chrome*/
function App() {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const res = await chrome.tabs.sendMessage(tab.id, { type: 'getInfo' });

      // Example of data returned by Yelp's Fusion API (/v3/businesses/search):
      // {
      //   'alias': 'blitz-moving-services-atlanta-2',
      //   'categories': [{'alias': 'movers', 'title': 'Movers'}],
      //   'coordinates': { 'latitude': 33.7169761657715,
      //                    'longitude': -84.4447937011719},
      //   'display_phone': '(404) 659-7974',
      //   'distance': 530.834635275939,
      //   'id': 'YkcuP2vXQGnMXAE1FDPwow',
      //   'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/-ayuodIADmVsLedb8N95Mg/o.jpg',
      //   'is_closed': False,
      //   'location': { 'address1': '1718 Sandtown Rd SW',
      //                 'address2': '',
      //                 'address3': '',
      //                 'city': 'Atlanta',
      //                 'country': 'US',
      //                 'display_address': [ '1718 Sandtown Rd SW',
      //                                      'Atlanta, GA 30311'],
      //                 'state': 'GA',
      //                 'zip_code': '30311'},
      //   'name': 'Blitz Moving Services',
      //   'phone': '+14046597974',
      //   'rating': 4.4,
      //   'review_count': 31,
      //   'transactions': [],
      //   'url': 'https://www.yelp.com/biz/blitz-moving-services-atlanta-2?adjust_creative=OmTYn-mRFzhWHGN2-S0kEA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=OmTYn-mRFzhWHGN2-S0kEA'
      // },

      axios.post("http://jiajianwu.pythonanywhere.com/redfin/yelp", JSON.stringify(res), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          setError(null);
          setData(response.data);
          setLoading(false);
        })
        .catch(setError);
    }
    fetchData();
  }, []);

  if (error) return <p>An error occurred. Please try again.</p>;
  if (isLoading) return (
    <Box sx={{ position: 'absolute', left: '45%', top: '45%' }}>
      <CircularProgress size='5rem' />
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',          // Use Flexbox
          flexDirection: 'column',  // Align children in a column
          alignItems: 'center',     // Horizontally center
          justifyContent: 'center', // Vertically center
          textAlign: 'center',      // Center text
          bgcolor: '#f0f0f0',       // Optional: Background color
        }}
      >
        {data.map((business, index) => (
          <React.Fragment key={index}>
            <Divider sx={{ width: '100%', marginY: 2 }}>
              <KebabDiningRoundedIcon fontSize="large" />
              <RestaurantMenuRoundedIcon fontSize="large" />
              <LocalBarRoundedIcon fontSize="large" />
              <DinnerDiningIcon fontSize="large" />
              <RestaurantIcon fontSize="large" />
            </Divider>
            <Stack direction="row" spacing={2}>
              <Typography variant="h4" gutterBottom>
                {business['name']}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ maxHeight: '20vh', overflow: 'auto', marginBottom: 2 }}>
              <Item fontSize="1.25rem">
                <img src={getReviewRibbon[roundRating(business['rating'])]} loading="lazy" style={{ width: '30%', marginRight: '8px' }} />
                {business['rating']} ({business['review_count']} reviews ) {business['price']}
                <Tooltip title="View on Yelp" arrow placement="top">
                  <a href={business['url']} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', width: '30%' }}> {/* Set width to match parent's space */}
                    <img
                      src={yelpLogo}
                      loading="lazy"
                      style={{ maxWidth: '80px', maxHeight: '50px', width: '100%', height: 'auto' }} // Make image fill the available space
                      alt="Yelp Logo"
                    />
                  </a>
                </Tooltip>
              </Item>
            </Stack>
            <Container maxWidth="sm">
              <img src={`${business['image_url']}`} loading="lazy" style={{ maxWidth: '100%' }} />
            </Container>
          </React.Fragment>
        ))}
      </Box>
    </>
  );
}

export default App;