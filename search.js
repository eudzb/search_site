const elasticsearch = require('elasticsearch');

async function search(query) {
  const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace',
    apiVersion: '7.2', // use the same version of your Elasticsearch instance
  });
  // appeler elasticsearch pour effectuer la recherche
  const result = await client.search({
    index: 'books',
    body: {}
  })
  console.log(result.hits.hits);
  return result.hits.hits;
}

module.exports = search
