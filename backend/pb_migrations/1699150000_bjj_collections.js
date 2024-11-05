migrate((db) => {
    const collections = [
      {
        "id": "_pb_users_auth_",
        "name": "users",
        "type": "auth",
        "system": false,
        "schema": [
          {
            "id": "users_name",
            "name": "name",
            "type": "text",
            "system": false,
            "required": true,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "pattern": ""
            }
          },
          {
            "id": "users_avatar",
            "name": "avatar",
            "type": "file",
            "system": false,
            "required": false,
            "unique": false,
            "options": {
              "maxSelect": 1,
              "maxSize": 5242880,
              "mimeTypes": ["image/jpeg", "image/png", "image/gif"],
              "thumbs": ["100x100"]
            }
          },
          {
            "id": "users_belt",
            "name": "belt_rank",
            "type": "select",
            "system": false,
            "required": true,
            "unique": false,
            "options": {
              "maxSelect": 1,
              "values": ["White", "Blue", "Purple", "Brown", "Black"]
            }
          },
          {
            "id": "users_stripes",
            "name": "stripes",
            "type": "number",
            "system": false,
            "required": true,
            "unique": false,
            "options": {
              "min": 0,
              "max": 4
            }
          }
        ],
        "listRule": "",
        "viewRule": "id = @request.auth.id",
        "createRule": "",
        "updateRule": "id = @request.auth.id",
        "deleteRule": "id = @request.auth.id",
        "options": {
          "allowEmailAuth": true,
          "allowOAuth2Auth": true,
          "allowUsernameAuth": true,
          "exceptEmailDomains": null,
          "manageRule": null,
          "minPasswordLength": 8,
          "requireEmail": true
        }
      },
      {
        "id": "profiles",
        "name": "profiles",
        "type": "base",
        "system": false,
        "schema": [
          {
            "id": "profiles_user",
            "name": "user",
            "type": "relation",
            "required": true,
            "unique": true,
            "options": {
              "collectionId": "_pb_users_auth_",
              "cascadeDelete": true,
              "maxSelect": 1,
              "displayFields": ["id"]
            }
          },
          {
            "id": "profiles_academy",
            "name": "academy_name",
            "type": "text",
            "required": true,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "pattern": ""
            }
          },
          {
            "id": "profiles_since",
            "name": "training_since",
            "type": "date",
            "required": true,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "id": "profiles_weight",
            "name": "weight",
            "type": "number",
            "required": false,
            "unique": false,
            "options": {
              "min": 0,
              "max": null
            }
          },
          {
            "id": "profiles_height",
            "name": "height",
            "type": "number",
            "required": false,
            "unique": false,
            "options": {
              "min": 0,
              "max": null
            }
          },
          {
            "id": "profiles_record",
            "name": "competition_record",
            "type": "json",
            "required": false,
            "unique": false,
            "options": {}
          },
          {
            "id": "profiles_positions",
            "name": "favorite_positions",
            "type": "select",
            "required": false,
            "unique": false,
            "options": {
              "maxSelect": 5,
              "values": [
                "Guard", "Half Guard", "Side Control", "Mount", "Back Control",
                "Spider Guard", "De La Riva", "Butterfly Guard", "X-Guard", "Single Leg X",
                "Closed Guard", "Open Guard", "North South", "Knee on Belly"
              ]
            }
          },
          {
            "id": "profiles_style",
            "name": "preferred_gi_nogi",
            "type": "select",
            "required": true,
            "unique": false,
            "options": {
              "maxSelect": 2,
              "values": ["Gi", "No-Gi"]
            }
          }
        ],
        "listRule": "",
        "viewRule": "@request.auth.id != \"\" && (user = @request.auth.id)",
        "createRule": "@request.auth.id != \"\" && (user = @request.auth.id)",
        "updateRule": "@request.auth.id != \"\" && (user = @request.auth.id)",
        "deleteRule": "@request.auth.id != \"\" && (user = @request.auth.id)"
      }
    ];
  
    const collection3 = {
      "id": "training_sessions",
      "name": "training_sessions",
      "type": "base",
      "system": false,
      "schema": [
        {
          "id": "training_user",
          "name": "user",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": true,
            "maxSelect": 1,
            "displayFields": ["id"]
          }
        },
        {
          "id": "training_date",
          "name": "date",
          "type": "date",
          "required": true,
          "options": {
            "min": "",
            "max": ""
          }
        },
        {
          "id": "training_type",
          "name": "type",
          "type": "select",
          "required": true,
          "options": {
            "maxSelect": 1,
            "values": ["Gi", "No-Gi", "Open Mat", "Competition Prep", "Private"]
          }
        },
        {
          "id": "training_duration",
          "name": "duration",
          "type": "number",
          "required": true,
          "options": {
            "min": 0,
            "max": null
          }
        },
        {
          "id": "training_techniques",
          "name": "techniques_learned",
          "type": "text",
          "required": false,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "id": "training_partners",
          "name": "rolling_partners",
          "type": "relation",
          "required": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "maxSelect": 10,
            "displayFields": ["id"]
          }
        },
        {
          "id": "training_notes",
          "name": "notes",
          "type": "editor",
          "required": false,
          "options": {}
        },
        {
          "id": "training_media",
          "name": "media",
          "type": "file",
          "required": false,
          "options": {
            "maxSelect": 5,
            "maxSize": 52428800,
            "mimeTypes": ["image/jpeg", "image/png", "video/mp4"],
            "thumbs": ["300x300"]
          }
        }
      ],
      "listRule": "@request.auth.id != \"\" && (user = @request.auth.id)",
      "viewRule": "@request.auth.id != \"\" && (user = @request.auth.id)",
      "createRule": "@request.auth.id != \"\"",
      "updateRule": "@request.auth.id != \"\" && (user = @request.auth.id)",
      "deleteRule": "@request.auth.id != \"\" && (user = @request.auth.id)"
    };
  
    const collection4 = {
      "id": "achievements",
      "name": "achievements",
      "type": "base",
      "system": false,
      "schema": [
        {
          "id": "achievement_user",
          "name": "user",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": true,
            "maxSelect": 1,
            "displayFields": ["id"]
          }
        },
        {
          "id": "achievement_title",
          "name": "title",
          "type": "text",
          "required": true,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "id": "achievement_date",
          "name": "date",
          "type": "date",
          "required": true,
          "options": {
            "min": "",
            "max": ""
          }
        },
        {
          "id": "achievement_type",
          "name": "type",
          "type": "select",
          "required": true,
          "options": {
            "maxSelect": 1,
            "values": ["Belt Promotion", "Competition Medal", "Stripe", "Seminar", "Teaching"]
          }
        },
        {
          "id": "achievement_desc",
          "name": "description",
          "type": "editor",
          "required": false,
          "options": {}
        },
        {
          "id": "achievement_media",
          "name": "media",
          "type": "file",
          "required": false,
          "options": {
            "maxSelect": 5,
            "maxSize": 52428800,
            "mimeTypes": ["image/jpeg", "image/png", "video/mp4"],
            "thumbs": ["300x300"]
          }
        }
      ],
      "listRule": "@request.auth.id != \"\"",
      "viewRule": "@request.auth.id != \"\"",
      "createRule": "@request.auth.id != \"\"",
      "updateRule": "@request.auth.id != \"\" && (user = @request.auth.id)",
      "deleteRule": "@request.auth.id != \"\" && (user = @request.auth.id)"
    };
  
    // Create the collections
    collections.forEach((collection) => {
      db.createCollection(collection);
    });
    
    db.createCollection(collection3);
    db.createCollection(collection4);
  
    return collections;
  }, (db) => {
    // Revert the changes
    db.deleteCollection("users");
    db.deleteCollection("profiles");
    db.deleteCollection("training_sessions");
    db.deleteCollection("achievements");
  })