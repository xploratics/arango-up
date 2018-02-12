[![Build Status](https://travis-ci.org/xploratics/arango-up.svg)](https://travis-ci.org/xploratics/arango-up)
[![dependencies Status](https://david-dm.org/xploratics/arango-up/status.svg)](https://david-dm.org/xploratics/arango-up)
[![devDependencies Status](https://david-dm.org/xploratics/arango-up/dev-status.svg)](https://david-dm.org/xploratics/arango-up?type=dev)

# arango-up

This component allow to migrate an arango database (schema / data) from a version to the most recent version.
Using javascript files in a folder, will find those files and execute them in sequencial order. 

## Usage

```js
var database = require('arangojs')({ url: 'http://localhost:8529' });
var updater = require('arango-up');

database.useDatabase('db').useBasicAuth('root', '');

updater
    .update({ path: './patches', database, data: { server } })
    .then(function () {
        console.log('update completed.');
    });
```

## Installation

```bash
npm install arango-up
```

Put update files in a `./patches` folder.
Each file should be identified with a number followed by the `.js` extension.

### Example structure

```bash
project
    |- patches
        |- 1.js
        |- 2.js
        |- 3.js
```

## update
Updater function takes an options object with the following parameters.

### Returns

A promise that is resolved when all patches as been applied.
If a patch fail, all subsequent patches are not run and the updater invoke
the catch branch of the promise.

### Options

- data:

Optionnal data that can be passed to the patches.
Usefull for passing the arango object.

- path:

The path to the folder containing the patches. Default is `./patches`

- database:

An arangojs database object.

## Example of a patch file.

Name the file as 1.js and put it in the `./patches` folder.

```js
module.exports = function (e) {
    return e.database.collection('users').create();
}
```

## Development and test
Clone the project

```bash
#Clone the project
git clone https://github.com/xploratics/arango-up.git

#Move into the cloned repo
cd arango-up

#Install all dependencies
npm install

#Mount the database, you can execute that to recreate the database
npm run mount-db

#Run the tests
npm test

#Unmount the database
npm run unmount-db
```

## License

MIT License
