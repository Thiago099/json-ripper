# json-ripper

This library allows you to make queries, to turn json nested data into relational data.

To install it you can run
```bash
npm i json-ripper
```
then import it like this
```js
import jsonRipper from "json-ripper"
```

Lets say you have a javascript object:

```js
const obj = [
    {
        "Id": 0,
        "Name":"Jhon doe",
        "Age": 39,
        "Occupations":[
            "Programmer",
            "Design"
        ]
    },
    {
        "Id": 1,
        "Age": 25,
        "Name":"Mary",
        "Occupations":[
            "Nurse",
        ]
    }
]
```

You can do this query recover some data from it:

```js
const query = [
    "*/Id:IdUser",
    "*/Name",
    "*/Age",
]
```

```js
const result = jsonRipper(obj, query)

console.log(result)
```

That will result on this output:

```json
[
    {
        "IdUser": 0,
        "Name": "Jhon doe",
        "Age": 39
    },
    {
        "IdUser": 1,
        "Name": "Mary",
        "Age": 25
    }
]
```

Here is another example of a query you can do:

```js
const query = [
    "*/Id:IdUser",
    "*/Occupations/*:Occupation",
]
```

result:

```json
[
    {
        "IdUser": 0,
        "Occupation": "Programmer"
    },
    {
        "IdUser": 0,
        "Occupation": "Design"
    },
    {
        "IdUser": 1,
        "Occupation": "Nurse"
    }
]
```

The structure is pretty simple.

The jsonRipper method receives two parameters, an object and a query.

The query parameter is an array of patterns, that all non optional must be fulfilled to the object be added in the result.

The pattern consists of

```
"any text": a key to be matched in a object
"*": a array to be matched in the object
":": optional paramter, at the end, that is a alias for the column
"?": if the fist character is a interrogation, the match is optional
```
