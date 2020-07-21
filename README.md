# search_site

creer un indexe


`curl -X PUT localhost:9200/books`

envoyer les documents


`curl -X POST -H "Content-Type: application/json" localhost:9200/books/_bulk --data-binary @books.json`


`curl -X POST -H "Content-Type: application/json" localhost:9200/books/_bulk --data-binary @books.2.json`
