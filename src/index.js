const kebabize = str => {
  return str.split('').map((letter, idx) => {
    return letter.toUpperCase() === letter
     ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
     : letter;
  }).join('');
}

module.exports = function reactDataTest({
  types: t
}) {
  return {
    name: 'react-data-testid',
    visitor: {
      JSXElement: {
        enter(path) {
          const idName = 'data-testid';
          // Ignore child JSXElements or JSX who's parent is a Fragment
          if (path.parentPath.isJSXElement() || path.parentPath.isJSXFragment()) return;
          // Grab the parent variable declaration
          const parentVariable = path.findParent((path) => path.isVariableDeclarator());
          if (parentVariable) {
            let componentName = parentVariable.node.id.name;
            componentName = kebabize(componentName);
            let added = false;
            // Either concatenate with an existing data-test attribute or add a new one
            path.node.openingElement.attributes = path.node.openingElement.attributes.map(attr => {
              if (attr.name && attr.name.name === idName) {
                added = true;
                return t.JSXAttribute(t.JSXIdentifier(idName), t.StringLiteral(`${componentName} ${attr.value.value}`));
              } else {
                return attr;
              }
            });
            if (!added) {
              path.node.openingElement.attributes.unshift(t.JSXAttribute(t.JSXIdentifier(idName), t.StringLiteral(componentName)));
            }
          }
        }
      },
    }
  };
}
