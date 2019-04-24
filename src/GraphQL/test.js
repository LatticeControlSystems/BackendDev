filter: {
  comments: {
      createdAt:{
        contains: "2019-02-28"
    }
  }
})

mutation CreateEvent {
  createEvent(
    name: "My First Event"
    when: "Today"
    where: "My House"
    description: "Very first event"
  ) {
    id
    name
  }
}

## Pass back the result from DynamoDB. **
{
	"eventId": $util.toJson($context.result.eventId),
    "commentId": $util.toJson($context.result.commentId),
    "content": $util.toJson($context.result.content),
    "createdAt": $util.toJson($context.result.createdAt)
}



// Query of listevents--working
query ListEvents($limit: Int) {
  listEvents(limit: $limit){
    items {
      id
      name
    }
  }
}
{
"limit": 45
}

// filter using AND

{
"id":"0f576f22-afb9-4317-9f4d-fad2d61f9454",
"limit": 20,
"filter": {
    "AND": [{
      "id": "0f576f22-afb9-4317-9f4d-fad2d61f9454",
    }, {
      published: true
    }]
  }
}
}
// original QueryGetEvent
{
    "version": "2017-02-28",
    "operation": "Query",
        "key": {
        "id": { "S": "$context.arguments.id" }
    },
}
$util.toJson($context.result)
// using items as return
"message": "Unable to parse the JSON document: 'Unrecognized token '$util': was expecting ('true', 'false' or 'null')\n at [Source: (String)\"{\n    \"version\": \"2017-02-28\",\n    \"operation\": \"Scan\",\n    \"filter\":  $util.transform.toDynamoDBFilterExpression($ctx.args.filter) ,\n    \"limit\":  20 ,\n}\"; line: 4, column: 21]'"
// filter with AND operator
"filter": {
    "AND": [{
      "id": "0f576f22-afb9-4317-9f4d-fad2d61f9454"},
      {"createdAt": "2019-03-06"}]
}

// modified QueryGetEvent
{
    "version": "2017-02-28",
    "operation": "Scan",
    "filter": #if($context.args.filter) $util.transform.toDynamoDBFilterExpression($ctx.args.filter) #else null #end,
}
