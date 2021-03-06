const { Client } = require('pg');
const moment = require('moment');
const INSERT = require('./pipelinedb_queries');

const client = new Client({ 
  user: 'sasha',
  host: 'localhost',
  database: 'sasha',
  port: '5432',
}); 

client.connect();

const addToPL = (msg) => {
  const json = JSON.parse(msg.content);
  let { eType, timestamp, metadata } = json;
  timestamp = moment.utc(timestamp).format();
  let text;
  let values;

  if (eType === 'clicks'){
    let { target_node, buttons, x, y } = json; 
    text = INSERT.click;
    values = [target_node, buttons, x, y, timestamp, metadata];
  } else if (eType === 'link_clicks') {
  	let { linkText, targetURL } = json; 
    text = INSERT.link_click;
    values = [linkText, targetURL, timestamp, metadata];
  } else if (eType === 'mouse_moves') {
    let { x, y } = json;
    text = INSERT.mouse_move;
    values = [x, y, timestamp, metadata];
  } else if (eType === 'key_press') {
    let { key } = json;
    text = INSERT.key_press;
    values = [key, timestamp, metadata];
  } else if (eType === 'pageview') {
    let { url, title } = json;
    text = INSERT.pageview;
    values = [url, title, timestamp, metadata];
  } else if (eType === 'form_submissions') {
    let { data } = json;
    text = INSERT.form_submission;
    values = [data, timestamp, metadata];
  }

  client.query(text, values, (err, res) => {
  	console.log(err ? err.stack : 'Success');
  })
}

module.exports = addToPL;