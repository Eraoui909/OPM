# OPM

OPM (Oracle Package Manager) is a package manager designed for Oracle database applications. Its primary functions include:

 * __Packaging__: Standardizing the format of any SQL or PL/SQL application.
 * __Installation__: Deploying packages to a target environment.
 * __Uninstallation__: Removing packages from a target environment.
 * __Updating__: Modifying existing packages in a target environment.
 * __Distribution__: Publishing packages to a shared registry (local or remote) for centralized management.

# Understanding the Core Concepts

Before diving into code, it's essential to grasp the fundamental principles of package management:

- ***Package format:*** Decide on a structure for the packages (e.g., .tar.gz, .deb, .rpm).
- ***Metadata:*** Define how to store package information (name, version, dependencies, etc.).
- ***Repository:*** Determine where packages will be stored (local, remote, distributed).
- ***Dependency resolution:*** Implement algorithms to handle package dependencies and conflicts.
- ***Installation/removal:*** Define how packages will be installed, upgraded, and removed.
- ***User interface:*** Choose a way for users to interact with your package manager (CLI, GUI).

# Defining the Scope

It's crucial to narrow down the focus of the package manager. Consider these questions:

- ***Target platform:*** Will it be Linux, macOS, Windows, or a specific environment?
- ***Package types:*** Will it handle system packages, programming language packages, or both?
- ***Features:*** What core functionalities are essential? (e.g., search, install, update, remove)

# Technical Implementation

Once we have a clear scope, we can start building the core components:

- ***Package format:*** we will create our custom package format ***.opm***
- ***Repository:*** We will start by just a local repository called ***.opm*** that will be created in the end user local machine.
- ***Metadata:*** We will store the package metadata in a json format in a file called ***panguan.json***.
- ***Dependency resolution:*** Implement algorithms to handle dependencies and conflicts. This can be challenging and requires careful consideration.
- ***Installation/removal:*** Create functions to install, upgrade, and remove packages. This involves copying files, running scripts, and updating package databases.
- ***User interface:*** We cill Develop a CLI for users to interact with your package manager.

# Additional Considerations

- ***Security:*** Implement measures to verify package integrity and protect user systems.
- ***Performance:*** Optimize package downloads, installations, and updates for speed.
- ***Error handling:*** Provide informative error messages and recovery options.
- ***Testing:*** Thoroughly test your package manager with various scenarios.





# Getting start

## Architecture

To ensure our package manager doesn't interfere with user applications, we'll use a multiple schemas approach to store different object types:

 * ***OPM*** schema: For storing package manager-specific objects.
 * ***DEPENDENCIES*** schema: To isolate dependencies for easy addition or removal (How tcould we access the depenedencies object from our app schema?).
 * ***USER_SCHEMA*** schema: The user defined schema

By default, the OPM will include two default schemas and will grant the necessary grants, roles, and synonyms (to be determined soon).

## Grants, Roles and Synonyms

TBD

## Basic features

To get started, I'll try to build a MVP that can be considered a POC.

This POC will contains 4 basic commands:
  * ***opm install**: to install the dependencies
  * ***opm uninstall**: to uninstall the dependencies
  * ***opm update**: to update the dependencies
  * ***opm publish**: to publish the dependencies

We will also cover project publishing in V1. To achieve this, every project must follow a specific format that will be defined later.

## CLI

To interact with OPM, we will offer users a CLI. This CLI will be developed in this POC using Node.js.

## Example

This is how a project will look like

```
├── README.md
├── .gitignore
├── panguan.json
└── .opm
    ├── dependency1
    ├── dependency2
    └── dependency3
└── src
    └── database
        ├── hr
        │   ├── create_users
        │   ├── indexes
        │   ├── procedures
        │   ├── ref_constraints
        │   ├── sequences
        │   ├── tables
        │   ├── triggers
        │   ├── type_specs
        │   └── views
        └── sys
            └── object_grants

```
An example of ***panguan.json*** file:
```
{
    "name": "project-name",
    "version": "1.0.0",
    "description": "The description of your project",
    "author": "Author",
    "license": "license",
    "repository": {
      "type": "git",
      "url": "The repo url"
    },
    "dependencies": {
      "dependecy1": "^11.1.0",
      "dependecy2": "^4.1.0"
    }
}
```
## Commands details
### OPM INSTALL

The main functionality of the install command is to grab dependencies from the panguan.json file and install them in the project (target database). The installation process will be simply by calling an install script after connecting to the target database.

QQ: Should we install the dependencies in a separate schema?

# OPM Registry

The registry is the place where you can publish packages or install them from. The plan is to support both remote and local registries. However, for our proof of concept (POC), we will start with just a local registry.

The local registry will be a folder named __.opm__ that will be created on the user's local machine in the following directories:

 * Windows: `C:\Users\YourUsername\.opm`
 * Linux/macOS: `/home/YourUsername/.opm` or `/Users/YourUsername/.opm`
   
You can override the location by adding a new entry to the __panguan.json__ file called __registry.local__

Each entry in the registry is a zipped folder identified by a package name and version, with additional metadata stored in the database. Packages are organized within a namespace, which corresponds to an organization ID (whether a person or an organization).

The unique identifier for each package is a combination of organization_id|package_name|version. Attempting to upload or publish a package with the same identifier will result in an error.

Before publishing to the OPM registry, the user must set up an account. A user can be either a person or an organization. The difference is that an organization can have multiple users who can publish to the same namespace (organization ID) while adhering to certain privileges (to be determined later).

### How can the user create an account?

A command named `opm connect --sign-up` will prompt the user for the required information to create an account. A namespace with the organization ID will then be automatically created in the registry. After that, the user can log in with their credentials whenever they want to publish a new package using `opm connect`.

### Are there public vs. private packages?

Yes, there will be some private packages that are protected with a password. Each time you want to install such a package, the user will be prompted to enter the password.

### Example of how the registry will look:

```
└── .opm
    └── namespace1
        ├── package1-1.0.0.zip
        └── package2-1.2.5.zip
    └── oracle
        ├── logger-2.1.0.zip
        │   ├── indexes/
        │   ├── procedures/
        │   ├── ref_constraints/
        │   ├── sequences/
        │   ├── tables/
        │   ├── triggers/
        │   ├── views/
        │   └── install.sql
        └── analytics-3.0.0.zip
```
### Publishing a pckage workflow

To publish your package, follow these steps that OPM will execute:

   1. Ensure that the user has already initialized the package/project (look for the panguan.json file).
   2. Verify that the configuration file is correctly set up.
   3. Check if the install.sql file exists within the project and that its path matches what is defined in the panguan.json file.
   4. Confirm that the user is logged into their account; if not, prompt them to create one.
   5. Verify that the package does not already exist in the registry.
   6. Insert the package metadata into the database.
   7. Zip the package.
   8. Upload it to the local registry under the correct namespace.

### Taken into consideration

We may offer a graphical interface to manage the registry. Oracle APEX is a good choice for building the interface for the registry.

### Where should the OPM database objects live?

The question here is about the OPM database objects. Should they be created in the end-user database or in a central database for OPM?

The current solution is to use a central database where the registry objects will reside. This means the end user CLI will communicate with the registry via a REST API.

### Registry DATA Model

![opm-data-model](https://github.com/user-attachments/assets/f074a4ba-1651-4981-8d53-f307767dde4f)


