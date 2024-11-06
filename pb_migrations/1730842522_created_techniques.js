/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "o9iyc92yi60ick1",
    "created": "2024-11-05 21:35:22.849Z",
    "updated": "2024-11-05 21:35:22.849Z",
    "name": "techniques",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "5lducgo2",
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
        "id": "ebjouasr",
        "name": "category",
        "type": "text",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "mruty2j6",
        "name": "proficiency_level",
        "type": "text",
        "required": false,
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
        "id": "tkrrva3k",
        "name": "focus_areas",
        "type": "text",
        "required": false,
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
        "id": "5ssb0c2h",
        "name": "description",
        "type": "text",
        "required": false,
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
        "id": "peocc1va",
        "name": "video_link",
        "type": "url",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "exceptDomains": [],
          "onlyDomains": []
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("o9iyc92yi60ick1");

  return dao.deleteCollection(collection);
})
