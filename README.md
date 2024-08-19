# OPM

OPM (Oracle Package Manager) is a package manager designed for Oracle database applications. Its primary functions include:

 * ***Packaging:*** Standardizing the format of any SQL or PL/SQL application.
 * ***Installation:*** Deploying packages to a target environment.
 * ***Uninstallation***: Removing packages from a target environment.
 * ***Updating:*** Modifying existing packages in a target environment.
 * ***Distribution:*** Publishing packages to a shared registry (local or remote) for centralized management.

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

## DATA Model

<img width="951" alt="erd" src="https://github.com/user-attachments/assets/729d6dd6-8e96-4c4f-86e0-4df7f4cfd16b">

# Database Schema

## Public Tables

### `accounts`
| Column         | Type      | Notes       |
| -------------- | --------- | ----------- |
| `id`           | `UUID`    | Primary Key |
| `handle`       | `TEXT`    |             |
| `avatar_path`  | `TEXT`    |             |
| `display_name` | `TEXT`    |             |
| `bio`          | `TEXT`    |             |
| `contact_email`| `TEXT`    |             |
| `created_at`   | `TIMESTAMP` |             |

### `organizations`
| Column         | Type      | Notes       |
| -------------- | --------- | ----------- |
| `id`           | `UUID`    | Primary Key |
| `handle`       | `TEXT`    |             |
| `avatar_path`  | `TEXT`    |             |
| `display_name` | `TEXT`    |             |
| `bio`          | `TEXT`    |             |
| `contact_email`| `TEXT`    |             |
| `created_at`   | `TIMESTAMP` |             |

### `members`
| Column            | Type      | Notes       |
| ----------------- | --------- | ----------- |
| `organization_id` | `UUID`    |             |
| `account_id`      | `UUID`    |             |
| `role`            | `TEXT`    |             |
| `created_at`      | `TIMESTAMP` | Primary Key: `(organization_id, account_id)` |

### `packages`
| Column             | Type      | Notes       |
| ------------------ | --------- | ----------- |
| `package_name`     | `TEXT`    | Primary Key |
| `handle`           | `TEXT`    |             |
| `partial_name`     | `TEXT`    |             |
| `latest_version`   | `TEXT`    |             |
| `description_md`   | `TEXT`    |             |
| `control_description` | `TEXT`    |             |
| `control_requires` | `TEXT`    |             |
| `created_at`       | `TIMESTAMP` |             |

### `package_upgrades`
| Column           | Type      | Notes       |
| ---------------- | --------- | ----------- |
| `id`             | `UUID`    | Primary Key |
| `package_id`     | `UUID`    |             |
| `package_name`   | `TEXT`    |             |
| `from_version`   | `TEXT`    |             |
| `to_version`     | `TEXT`    |             |
| `sql`            | `TEXT`    |             |
| `created_at`     | `TIMESTAMP` |             |

### `package_versions`
| Column             | Type      | Notes       |
| ------------------ | --------- | ----------- |
| `id`               | `UUID`    | Primary Key |
| `package_id`       | `UUID`    |             |
| `package_name`     | `TEXT`    |             |
| `version`          | `TEXT`    |             |
| `sql`              | `TEXT`    |             |
| `description_md`   | `TEXT`    |             |
| `control_description` | `TEXT`    |             |
| `control_requires` | `TEXT`    |             |
| `created_at`       | `TIMESTAMP` |             |

## Private Tables

### `accounts`
| Column            | Type      | Notes       |
| ----------------- | --------- | ----------- |
| `id`              | `UUID`    | Primary Key |
| `handle`          | `TEXT`    |             |
| `is_organization` | `BOOLEAN` |             |
| `avatar_id`       | `UUID`    |             |
| `display_name`    | `TEXT`    |             |
| `bio`             | `TEXT`    |             |
| `contact_email`   | `TEXT`    |             |
| `created_at`      | `TIMESTAMP` |             |

### `handle_registry`
| Column            | Type      | Notes       |
| ----------------- | --------- | ----------- |
| `handle`          | `TEXT`    | Primary Key |
| `is_organization` | `BOOLEAN` |             |
| `created_at`      | `TIMESTAMP` |             |

### `organizations`
| Column            | Type      | Notes       |
| ----------------- | --------- | ----------- |
| `id`              | `UUID`    | Primary Key |
| `is_organization` | `BOOLEAN` |             |
| `avatar_id`       | `UUID`    |             |
| `display_name`    | `TEXT`    |             |
| `bio`             | `TEXT`    |             |
| `contact_email`   | `TEXT`    |             |
| `created_at`      | `TIMESTAMP` |             |

### `members`
| Column            | Type      | Notes       |
| ----------------- | --------- | ----------- |
| `id`              | `UUID`    | Primary Key |
| `organization_id` | `UUID`    |             |
| `account_id`      | `UUID`    |             |
| `role`            | `TEXT`    |             |
| `created_at`      | `TIMESTAMP` |             |

### `downloads`
| Column            | Type      | Notes       |
| ----------------- | --------- | ----------- |
| `id`              | `UUID`    | Primary Key |
| `package_id`      | `UUID`    |             |
| `ip`              | `TEXT`    |             |
| `client_info`     | `TEXT`    |             |
| `created_at`      | `TIMESTAMP` |             |

### `packages`
| Column             | Type      | Notes       |
| ------------------ | --------- | ----------- |
| `id`               | `UUID`    | Primary Key |
| `package_name`     | `TEXT`    |             |
| `handle`           | `TEXT`    |             |
| `partial_name`     | `TEXT`    |             |
| `control_description` | `TEXT`    |             |
| `control_relocatable` | `BOOLEAN` |             |
| `control_requires` | `TEXT`    |             |
| `created_at`       | `TIMESTAMP` |             |

### `package_upgrades`
| Column           | Type      | Notes       |
| ---------------- | --------- | ----------- |
| `id`             | `UUID`    | Primary Key |
| `package_id`     | `UUID`    |             |
| `from_version_struct` | `JSONB` |             |
| `from_version`   | `TEXT`    |             |
| `to_version_struct` | `JSONB` |             |
| `to_version`     | `TEXT`    |             |
| `sql`            | `TEXT`    |             |
| `created_at`     | `TIMESTAMP` |             |

### `package_versions`
| Column             | Type      | Notes       |
| ------------------ | --------- | ----------- |
| `id`               | `UUID`    | Primary Key |
| `package_id`       | `UUID`    |             |
| `version_struct`   | `JSONB`   |             |
| `version`          | `TEXT`    |             |
| `sql`              | `TEXT`    |             |
| `description_md`   | `TEXT`    |             |
| `created_at`       | `TIMESTAMP` |             |


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

