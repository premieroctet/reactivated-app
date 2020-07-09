![image](https://user-images.githubusercontent.com/1102595/81568342-ea672c00-939d-11ea-8cd2-98270005822e.png)

[![prettier][prettier-badge]][prettier-url]
[![TypeScript][typescript-badge]][typescript-url]

# [Reactivated App](https://reactivated.app) 🔌

Reactivated App is the tool you need to maintain your projects' dependencies up-to-date

## Quick Demo

![Demo](reactivated-app.gif)

## Features

- Support for Node dependencies
- Add your GitHub repositories
- Visualizing your project's health
- Detection of the framework used
- Grouping the different dependencies by common prefix
- **beta** Automated PR in a new branch with the up-to-date dependencies _(⚠️only supporting yarn.lock : will be created even if there is a package-lock.json)_

## Getting started

- [API](api/README.md)
- [Front](front/README.md)

## Built with

We use TypeScript ❤️ for static typing

### API

- [Nestjs](https://nestjs.com/)
- [Nestjs Crud](https://github.com/nestjsx/crud)
- [MySQL](https://www.mysql.com/) or [PostgreSQL](https://www.postgresql.org/) for the database
- [Bull](https://github.com/OptimalBits/bull) with [Redis](https://redis.io/) for computing expensive operations with the worker process

### Front

- [Create React App](https://github.com/facebook/create-react-app)
- [Chakra UI](https://chakra-ui.com/)
- [Axios](https://github.com/axios/axios)
- [Framer motion](https://www.framer.com/motion/) for custom animations

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Install the dependencies (follow these instructions for the [API](api/README.md) and [Front](front/README.md))
3. Start the app, build your new feature and submit your pull request

OR

Make a new issue according to this [template](.github/ISSUE_TEMPLATE/custom.md)

[typescript-badge]: https://badges.frapsoft.com/typescript/code/typescript.svg?v=101
[typescript-url]: https://github.com/microsoft/TypeScript
[prettier-badge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg
[prettier-url]: https://github.com/prettier/prettier
