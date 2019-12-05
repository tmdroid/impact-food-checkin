# Impact Food CheckIn API

This is an API used at the Impact Congress used together with a mobile application for the participants to be able to check in for the meals.

The API basically consists of a `node.js` server and a `mongodb` database.

# Endpoints:
  - `GET /qr` - get meals for a specified day for a participant
  - `POST /qr` - log a meal as consumed for a participant

# `GET /qr`

```http
GET /qr HTTP/1.1

code=<qr>&day=31
```

This example will look for user with qr code `<qr>` and will return his/her meals for the day of `31 December`

| Parameter | Required | Example |
| ------ | ------ | ------ |
| **qr** | **yes** | **value of qr code from badge** |
| day | no | 29, 30, 31, 1, 2|



# `POST /qr`

```http
POST /qr HTTP/1.1
Content-Type: application/x-www-form-urlencoded

code=<qr>&meal=1&day=31
```

This example will look for user with qr code `<qr>` and log his breakfast as eaten for day `31 December`.

| Parameter | Required | Example |
| ------ | ------ | ------ |
| **qr** | **yes** | **value of qr code from badge** |
| **meal** | **yes** | **1, 2 or 3** |
| day | no | 29, 30, 31, 1 or 2|


# Meals
  - `1` => Breakfast
  - `2` => Lunch
  - `3` => Dinner

When `POST`ing to the API, various error can occure as:
  - `CODE 422` => Qr code or meal not specified (the call does not have `qr` or `meal` parameters specified)
  - `CODE 403` => Meal not available for participant (when signing up, the participant has not chosen this meal)
