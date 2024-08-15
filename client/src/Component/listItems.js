// src/listItems.js
import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Profile" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Income" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Settings" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListItem button>
      <ListItemText primary="Help" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Contact Us" />
    </ListItem>
  </div>
);
