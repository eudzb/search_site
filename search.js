const elasticsearch = require('elasticsearch')

const client = new elasticsearch.Client({
  host: 'localhost:9200',
})

async function search(query, sort, authors) {
  const customSort = [];
  switch (sort) {
	case 'relevance':
	  customSort.push({
		_score: {
		  order: "desc",
		}
	  })
	  break;
	case 'download':
	  customSort.push({
		"download_count": {
		  "order": "desc"
		}
	  })
	  break;
	case 'author_birth':
	  customSort.push({
		"authors.birth_year": {
		  "order": "asc"
		}
	  })
	  break;
  }

  const searchOption = {
	index: "books",
	body: {
	  query: {
        bool: {
          must: [{
            multi_match: {
              query,
              fields: [
                "title^3",
                "authors.name^2",
                "subjects^1",
              ],
              fuzziness: "AUTO",
            },
          }],
        },
      },
	  highlight : {
		pre_tags : ["<b class='text-info'>"],
        post_tags : ["</b>"],
		fields : {
		  title : {},
		  "authors.name": {}
		}
	  },
	  sort : customSort
	}
  }

  if (authors.length) {
    searchOption.body.query.bool.filter = [{
        term: {
          "authors.name.keyword": authors[0]
        }
      }]
  }

  const results = await client.search(searchOption)
  return results.hits;
}

async function filterAuthor() {
  const filterOption = {
	  index: "books",
	  body: {
		aggs: {
		  "authors.name": {
			terms: {
			  field: "authors.name.keyword",
			  size: 14
			}
		  }
		}
	  }
  }

  const results = await client.search(filterOption);
  return results.aggregations["authors.name"].buckets;
}

module.exports = {
  search,
  filterAuthor
}