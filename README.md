phosphor-core
=============

[![Build Status](https://travis-ci.org/phosphorjs/phosphor-core.svg)](https://travis-ci.org/phosphorjs/phosphor-core?branch=master)
[![Coverage Status](https://coveralls.io/repos/phosphorjs/phosphor-core/badge.svg?branch=master&service=github)](https://coveralls.io/github/phosphorjs/phosphor-core?branch=master)

The core non-ui functionality of the PhosphorJS project.


Package Install
---------------

**Prerequisites**
- [node](http://nodejs.org/)

```bash
npm install --save phosphor-core
```


Source Build
------------

**Prerequisites**
- [git](http://git-scm.com/)
- [node](http://nodejs.org/)

```bash
git clone https://github.com/phosphorjs/phosphor-core.git
cd phosphor-core
npm install
```

**Rebuild**
```bash
npm run clean
npm run build
```


Run Tests
---------

Follow the source build instructions first.

```bash
npm test
```


Supported Runtimes
------------------

The runtime versions which are currently *known to work* are listed below.
Earlier versions may also work, but come with no guarantees.

- IE 11
- Edge (latest)
- Firefox (latest)
- Chrome (latest)
- Node (latest)


Bundle for the Browser
----------------------

The modules in this package are designed to be required directly:

```typescript
var Signal = require('phosphor-core/lib/patterns/signaling').Signal;

// or via ES6 import

import { Signal } from 'phosphor-core/lib/patterns/signaling';
```

Any bundler which understands the CommonJS format and the NodeJS module
lookup semantics can be used with this package.

[Webpack](https://webpack.github.io/) is known to work well for this purpose.
