'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser'); // Allows for request.body
const cors = require('cors'); // Frontend is servered from localhost: 8080 do cors is necessary

let contacts = require('./data'); // Here we pull in our json data

app.use(express.json()) // This will allow us to accept json payloads from the form we setup in clients/index.html post request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// GET, POST, PUT, DELETE, PATCH
const path = '/api/contacts';

// GET all responses
app.get(path, (request, response) => {
  // Check if no contacts are found; if not, display 404 message
  if (!contacts) {
    response.status(404).json({ message: 'No contacts found' });
  }

  // Respond/Send back all contacts
  response.json(contacts);
});

// GET single response by ID
app.get(`${path}/:id`, (request, response) => {
  // Define which parameter to GET
  const requestId = request.params.id;

  // Filter through IDs and get only the one that you are requesting
  let contact = contacts.filter((contact) => {
    return contact.id == requestId;
  });

  // Check if no individual contact is found; if not, display 404 message
  if (!contact) {
    response.status(404).json({ message: 'No contact found' });
  }

  // Respond/Send back only that ID
  response.json(contact[0]);
});

// POST route
app.post(path, (request, response) => {
  const contact = {
    id: contacts.length + 1,
    first_name: request.body.first_name,
    last_name: request.body.last_name,
    email: request.body.email,
    website: request.body.website,
  };
  contacts.push(contact);

  response.json(contact);
});

// PUT/Update route
app.put(`${path}/:id`, (request, response) => {
  // Define which parameter to PUT/Update
  const requestId = request.params.id;

  // We only want the first element in the array that we specify in the path
  let contact = contacts.filter((contact) => {
    return contact.id == requestId;
  })[0];

  // Locate the index of the contact we are updating within the array
  const index = contacts.indexOf(contact);

  // Make check for which keys are coming in on the request.body
  const keys = Object.keys(request.body);

  // Loop over keys
  keys.forEach((key) => {
    contact[key] = request.body[key];
  });

  // Update contact
  contacts[index] = contact;

  // Send/Put response
  response.json(contacts[index]);
});

// DELETE route
app.delete(`${path}/:id`, (request, response) => {
  // Define which parameter to DELETE
  const requestId = request.params.id;

  // We only want the first element in the array that we specify in the path
  let contact = contacts.filter((contact) => {
    return contact.id == requestId;
  })[0];

  // Locate the index of the contact we are updating within the array
  const index = contacts.indexOf(contact);

  // Remove contact at index position
  contacts.splice(index, 1)

  // Respond with message
  response.json({message: `User ${requestId} deleted`})
});

const hostname = 'localhost';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}`);
});
