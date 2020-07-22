const elasticsearch = require('elasticsearch')

const client = new elasticsearch.Client({
  host: 'localhost:9200',
})

async function search(query) {
  const results = await client.search({
	index: "books",
	body: {
	  query: {
	    multi_match: {
	      query,
	      fields: [
	  	  "title^3",
	  	  "authors.name^2",
	  	  "subjects^1",
	      ],
	    fuzziness: "AUTO"
	    }
	  },
	  highlight : {
		pre_tags : ["<b class='text-info'>"],
        post_tags : ["</b>"],
		fields : {
		  title : {}
		}
	  }
	}
  })
  return results.hits;
}

module.exports = search