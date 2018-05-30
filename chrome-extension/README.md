# chrome-extension
Prism Extension

# Running the project
NOTE: Use `yarn [command]` instead of `npm [command]` 
1. if `yarn` isn't installed, run the command `npm i -g yarn`
2. navigate to the project location
3. run `yarn install`
4. after the modules were fetched, run `yarn start/build` to run/compile the code

## Mastercard
### Prerequisites
- Elasticsearch mapping as below must be applied before reporting data in order to make strings not_analyzed in the Elasticsearch

```REST
POST /_template/mc_template
```
```JSON
{
    "template": "*_prism_*",
    "mappings": {
	  "browser_event": {
        "_all": {
          "enabled": false
        },
        "dynamic_templates": [
            {
                "strings": {
                    "match_mapping_type": "string",
                    "mapping": {
                        "type": "string",
                        "index": "not_analyzed"
                    }
                }
            },
            {
                "client_time_field": {
                    "match": "client_time",
                    "mapping": {
                        "type": "date"
                    }
                }
            }
        ]
      }
    }
}
```