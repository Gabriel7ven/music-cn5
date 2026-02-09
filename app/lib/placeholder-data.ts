// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    // id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Gabriel Santos',
    email: 'gabriel.oficial@yahoo.com',
    password: '123456',
  },
  {
    // id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Adda Castro',
    email: 'adda.oficial@yahoo.com',
    password: '123456',
  },
];

const teams = [
  {id: 'd123f845-5d29-47f8-b7b0-cc463b0169d2',
  name: 'Diogo'},
  {id: '0b266a3f-3477-4a72-b1d6-823c8391ef6e',
  name: 'Nascimento'},
  {id: '4f5ca563-62d2-4ecc-8ae5-4fc4ec97760d',
  name: 'Moisés'},
  {id: '5a1dd5cb-23dc-4d2a-a0af-89f9365bdeb4',
  name: 'Gisele'},
]


const participants = [
  {
    // id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Adda D\'Castro',
    email: 'evil@rabbit.com',
    birth_date: '24/11/1995',
    image_url: '/customers/evil-rabbit.png',
    team_id: teams[0].id,
  },
  {
    // id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Gabriel Santos',
    email: 'gabriel.oficial@yahoo.com',
    birth_date: '06/07/1995',
    image_url: '/customers/delba-de-oliveira.png',
    team_id: teams[1].id,
  },
  {
    // id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Camila Tompson',
    email: 'lee@robinson.com',
    birth_date: '12/06/1995',
    image_url: '/customers/lee-robinson.png',
    team_id: teams[2].id,
  },
];


const appointments = [
  {team_id: teams[0].id,
  date: '01/02/2026',
  details: '',
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending'},
  {team_id: teams[1].id,
  date: '07/03/2026',
  details: '',
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'completed'},
]



export { users, participants, appointments, teams };
