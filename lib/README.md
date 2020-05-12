# DHIS2 Program Rule Engine

DHIS2 based javascript library for evaluating programs rules for DHIS2 tracker or event implementations

# Usage

- ES2015 module import:

```javascript
import * as d2Rule from '@iapps/dhis2-program-rule-engine';
// ...
d2Rule.execute(args*);
```

- CommonJS module require:

```javascript
const d2Rule require('@iapps/dhis2-program-rule-engine');
// ...
d2Rule.execute(args*);
```

- AMD module require:

```javascript
require(['d2Rule'], function (webpackNumbers) {
  // ...
  d2Rule.execute(args*);
});
```

- Library can also be used via script tag

```html
<!DOCTYPE html>
<html>
  ...
  <script src="https://unpkg.com/@iapps/dhis2-program-rule-engine"></script>
  <script>
    // ...
    // Global variable
    d2Rule.execute(args*);
    // ...
  </script>
</html>
```
