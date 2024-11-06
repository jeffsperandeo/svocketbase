/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "sv6vdmf7y1uou64",
    "created": "2024-11-05 21:19:16.933Z",
    "updated": "2024-11-05 21:19:16.933Z",
    "name": "gyms",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zdimlrhl",
        "name": "owner_id",
        "type": "relation",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "2kceg3bw",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 3,
          "max": 50,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "j7enxxwf",
        "name": "location",
        "type": "text",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 3,
          "max": 50,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rcnafmum",
        "name": "contact_number",
        "type": "text",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 7,
          "max": 11,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "uzj7atix",
        "name": "website_url",
        "type": "url",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      },
      {
        "system": false,
        "id": "jsq332dz",
        "name": "description",
        "type": "text",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 3,
          "max": 100,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\" && owner_id = @request.auth.id",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("sv6vdmf7y1uou64");

  return dao.deleteCollection(collection);
})
