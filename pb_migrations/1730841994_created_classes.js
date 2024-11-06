/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ivzdqrc4nt3vnoj",
    "created": "2024-11-05 21:26:34.002Z",
    "updated": "2024-11-05 21:26:34.002Z",
    "name": "classes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vlqoxgvc",
        "name": "gym_id",
        "type": "relation",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "collectionId": "sv6vdmf7y1uou64",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "hpwhxr4u",
        "name": "instructor_id",
        "type": "relation",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "4irbtbal",
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
        "id": "cb6fpeta",
        "name": "description",
        "type": "text",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 5,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "az79inzp",
        "name": "schedule",
        "type": "date",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "02ujxrwr",
        "name": "duration",
        "type": "number",
        "required": true,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": 8,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "x9unhfhf",
        "name": "max_participants",
        "type": "number",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "mvagipnu",
        "name": "skill_level",
        "type": "text",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "min": 3,
          "max": 50,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("ivzdqrc4nt3vnoj");

  return dao.deleteCollection(collection);
})
