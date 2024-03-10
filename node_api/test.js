let date = "05-02-2024";
console.log(new Date(date.split('-').reverse().join('-')).toLocaleDateString('en-US', { weekday: 'long' }));
