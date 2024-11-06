/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "24o2lj7etirkdeb",
    "created": "2024-11-05 21:11:27.301Z",
    "updated": "2024-11-05 21:11:27.301Z",
    "name": "profile",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sqrrcyqi",
        "name": "user_id",
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
        "id": "4rekwmif",
        "name": "belt_rank",
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
        "id": "peevrq4t",
        "name": "training_start_date",
        "type": "date",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "2ss44kib",
        "name": "total_training_hours",
        "type": "number",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "jf4ds9aj",
        "name": "goals",
        "type": "editor",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "qz6g4yjx",
        "name": "notable_achievements",
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
        "id": "o4ji6eey",
        "name": "injury_history",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 3,
          "max": 50,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "z2mi39fh",
        "name": "current_weight",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 3,
          "max": 4,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "fnu6oec4",
        "name": "current_height",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 3,
          "max": 5,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "tgnxmnly",
        "name": "guard_style",
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
        "id": "mlfkcsas",
        "name": "submission_specialties",
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
        "id": "xt3viq5i",
        "name": "competition_experience",
        "type": "bool",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "ab9xtfb8",
        "name": "last_promotion_date",
        "type": "date",
        "required": false,
        "presentable": true,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
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
  const collection = dao.findCollectionByNameOrId("24o2lj7etirkdeb");

  return dao.deleteCollection(collection);
})
