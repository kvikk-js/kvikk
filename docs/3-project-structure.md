# Project Structure

In a Hubro app specific folders and files play an important role in how the application works. By default Hubro expects a given project structure.

If a Hubro app is created by the Hubro Launch tool the required project structure is auto created for you.

If one create the Hubro app manually the structure must be created manually. Only the folders and files marked as required must be created for the application to function.

## Folders and Files

Hubro utilizes the following structure:

### Top-level Files

The top level is the root of the application and are used to configure the application, manage dependencies and define environment variables. 

The following files are what we call top-level files:

 - `package.json` - **Required** - Node.js configuration file holding project dependencies and scripts
 - `hubro.config.js` - Optional - Configuration file for Hubro
 - `.env` - Optional - Environment variables
 - `.env.local` - Optional - Local environment variables
 - `.env.production` - Optional - Production environment variables
 - `.env.development` - Optional - Development environment variables
 - `tsconfig.json` - Optional - Configuration file for TypeScript

The root of the application can contain other files than these top-level files. Hubro only care about the files listed here.

### Top-level Folders

Top-level folders are used to organize the application code.

 - `/pages` - **Required** - Page router where the folder structure and what files they contain defines the HTTP routes.
 - `/system` - Optional - Hold application specific system wide templates and pages such as http error pages etc.
 - `/layouts` - Optional - Holds application specific page layouts.
 - `/components` - Optional - Hold application specific components.
 - `/public` - Optional - Static assets.
 - `/build` - Auto created - Where production ready assets will be placed by the build process.

The root of the application can contain other folders than these top-level folders. Hubro only care about the folders listed here.