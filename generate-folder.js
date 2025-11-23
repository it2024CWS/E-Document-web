import fs from 'fs';
import path from 'path';

function generateCleanArchitecture(projectDir) {
  fs.mkdirSync(`src/pages/${projectDir}`, { recursive: true });

  const directories = ['controllers', 'page', 'components', 'context'];

  for (const directory of directories) {
    const fullPath = path.join(`src/pages/${projectDir}`, directory);
    fs.mkdirSync(fullPath, { recursive: true });
  }

  const fileName = projectDir.charAt(0).toUpperCase() + projectDir.slice(1);
  const controllerName = `useMainController`;

  // * Page
  const pageContent = `import useMainControllerContext from './context';
import { MainControllerProvider } from './context/MainControllerProvider';

  const Content = () => {
  const ctrl = useMainControllerContext();

  return (
      <div>
       {/* Your page content goes here */}
      </div>
    );
  };

  const ${fileName}Page = () => {
  return (
    <MainControllerProvider>
       <Content/>      
    </MainControllerProvider>
  )
}

export default ${fileName}Page
`;

  // * Controller
  const controllerContent = `const ${controllerName} = () => {
  return {
  }    
}

export default ${controllerName}`;

  // * Context
  const contextContent = `import { useContext, createContext } from 'react';
import { MainControllerType } from './MainControllerProvider';

export const MainControllerContext = createContext<MainControllerType | null>(null);

const useMainControllerContext = () => {
  const context = useContext(MainControllerContext);
  if (!context) {
    throw new Error('useMainControllerContext must be used within MainControllerProvider');
  }
  return context;
};
export default useMainControllerContext;`;

  // *  Provider
  const mainControllerProvider = `import { ReactNode } from 'react';
import ${controllerName} from '../controllers';
import { MainControllerContext } from '.';

export type MainControllerType = ReturnType<typeof ${controllerName}>;

export const MainControllerProvider = ({ children }: { children: ReactNode }) => {
  const controller = ${controllerName}();

  return <MainControllerContext.Provider value={controller}>{children}</MainControllerContext.Provider>;
};
`;

  const page = path.join(`src/pages/${projectDir}`, `index.tsx`);
  fs.writeFileSync(page, pageContent);

  const controller = path.join(`src/pages/${projectDir}/controllers`, `index.ts`);
  fs.writeFileSync(controller, controllerContent);

  const context = path.join(`src/pages/${projectDir}/context`, `index.ts`);
  fs.writeFileSync(context, contextContent);

  const provider = path.join(`src/pages/${projectDir}/context`, `MainControllerProvider.tsx`);
  fs.writeFileSync(provider, mainControllerProvider);
}

function main() {
  const commandLineArgs = process.argv.slice(2);
  if (commandLineArgs.length !== 1) {
    console.log('Usage: node generate_clean_architecture.js <project_dir>');
    process.exit(1);
  }

  const projectDir = commandLineArgs[0];
  generateCleanArchitecture(projectDir);
  console.log(`${projectDir} created successfully`);
}

main();
