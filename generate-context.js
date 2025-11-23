import fs from 'fs';
import path from 'path';

// Utility: Convert to PascalCase
function pascalCase(str) {
  return str.replace(/(^\w|-\w)/g, (s) => s.replace('-', '').toUpperCase());
}

// Core Function
function generateSubControllerContext(pageName, controllerName) {
  const Controller = pascalCase(controllerName);
  const contextHookName = `use${Controller}Context`;
  const providerFileName = controllerName.charAt(0).toUpperCase() + controllerName.slice(1) + 'Provider';

  const contextDir = path.join('src', 'pages', pageName, 'context');
  fs.mkdirSync(contextDir, { recursive: true });

  const providerContent = `import { ReactNode, createContext } from 'react';
import use${Controller} from '../controllers/${controllerName}';

export type ${Controller}Type = ReturnType<typeof use${Controller}>;

export const ${Controller}Context = createContext<${Controller}Type | null>(null);

export const ${Controller}Provider = ({ children }: { children: ReactNode }) => {
  const controller = use${Controller}();
  return (
    <${Controller}Context.Provider value={controller}>
      {children}
    </${Controller}Context.Provider>
  );
};
`;

  const hookContent = `import { useContext } from 'react';
import { ${Controller}Context } from './${providerFileName}';

const ${contextHookName} = () => {
  const context = useContext(${Controller}Context);
  if (!context) {
    throw new Error('${contextHookName} must be used within ${Controller}Provider');
  }
  return context;
};

export default ${contextHookName};
`;

  fs.writeFileSync(path.join(contextDir, `${providerFileName}.tsx`), providerContent);
  fs.writeFileSync(path.join(contextDir, `${contextHookName}.ts`), hookContent);

  console.log(`✅ Sub-controller context created for '${controllerName}' in page '${pageName}'`);
}

// CLI Entry
function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.log('Usage: node generate_sub_context.js <pageName> <controllerName>');
    process.exit(1);
  }

  const [pageName, controllerName] = args;
  generateSubControllerContext(pageName, controllerName);
}

main();
